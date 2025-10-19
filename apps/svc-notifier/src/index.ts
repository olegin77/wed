import { randomUUID } from "node:crypto";

/**
 * Base payload used by services to describe what should be delivered to the user.
 */
export type NotificationPayload = {
  /** Optional external identifier that can be used for idempotency. */
  id?: string;
  /** Machine-readable notification type used for templates/preferences. */
  type: string;
  /** Short summary shown in feeds and inbox headers. */
  subject: string;
  /** Localised body content or pre-rendered HTML/text. */
  body: string;
  /** Recipients expressed as user ids. */
  recipients: string[];
  /** Arbitrary metadata (deep-linked URL, CTA labels, etc.). */
  meta?: Record<string, unknown>;
};

/** Status of a notification for a particular delivery channel. */
export type ChannelDeliveryState = "pending" | "sent" | "failed";

/** Aggregate delivery status for the notification attempt. */
export type NotificationDeliveryState =
  | "queued"
  | "delivered"
  | "partial"
  | "failed";

/**
 * Snapshot of how a notification was (or was not) delivered.
 */
export interface NotificationDeliverySnapshot {
  state: NotificationDeliveryState;
  channels: Record<string, ChannelDeliveryState>;
  failureReasons?: Record<string, string>;
  deliveredAt?: Date;
}

/**
 * Feed entry persisted for every user recipient.
 */
export interface NotificationRecord {
  id: string;
  userId: string;
  type: string;
  subject: string;
  body: string;
  meta: Record<string, unknown>;
  createdAt: Date;
  readAt?: Date;
  delivery: NotificationDeliverySnapshot;
}

/** Options when listing notifications for a user. */
export interface NotificationFeedListOptions {
  limit?: number;
  unreadOnly?: boolean;
  types?: readonly string[];
  after?: Date;
}

/**
 * Error raised when a dispatch fails partially or fully.
 */
export class NotificationDispatchError extends Error {
  public readonly delivery: NotificationDeliverySnapshot;

  constructor(message: string, delivery: NotificationDeliverySnapshot) {
    super(message);
    this.name = "NotificationDispatchError";
    this.delivery = cloneDeliverySnapshot(delivery);
  }
}

/**
 * Lightweight storage for the per-user notification feed.
 */
export class NotificationFeed {
  private readonly recordsByUser = new Map<string, NotificationRecord[]>();
  private readonly indexById = new Map<string, NotificationRecord>();

  /**
   * Store a notification result for every recipient.
   */
  record(payload: NotificationPayload, delivery: NotificationDeliverySnapshot): NotificationRecord[] {
    const createdAt = new Date();
    const records: NotificationRecord[] = [];

    payload.recipients.forEach((userId) => {
      const recordId = payload.id ? `${payload.id}:${userId}` : randomUUID();
      const baseRecord: NotificationRecord = {
        id: recordId,
        userId,
        type: payload.type,
        subject: payload.subject,
        body: payload.body,
        meta: { ...(payload.meta ?? {}) },
        createdAt,
        delivery: cloneDeliverySnapshot(delivery),
      };

      const existing = this.recordsByUser.get(userId) ?? [];
      existing.unshift(baseRecord);
      this.recordsByUser.set(userId, existing);
      this.indexById.set(baseRecord.id, baseRecord);
      records.push(cloneRecord(baseRecord));
    });

    return records;
  }

  /** Retrieve a feed for a user with optional filtering. */
  list(userId: string, options: NotificationFeedListOptions = {}): NotificationRecord[] {
    const { limit, unreadOnly = false, types, after } = options;
    const source = this.recordsByUser.get(userId) ?? [];

    const typeFilter = types ? new Set(types) : undefined;
    const filtered = source.filter((record) => {
      if (unreadOnly && record.readAt) {
        return false;
      }
      if (typeFilter && !typeFilter.has(record.type)) {
        return false;
      }
      if (after && record.createdAt <= after) {
        return false;
      }
      return true;
    });

    const sliced = typeof limit === "number" ? filtered.slice(0, Math.max(0, limit)) : filtered;
    return sliced.map((record) => cloneRecord(record));
  }

  /** Mark a single notification as read. */
  markRead(notificationId: string, readAt: Date = new Date()): NotificationRecord | undefined {
    const record = this.indexById.get(notificationId);
    if (!record) {
      return undefined;
    }
    if (!record.readAt) {
      record.readAt = new Date(readAt);
    }
    return cloneRecord(record);
  }

  /** Mark every unread notification for the user as read and return the amount of updates. */
  markAllRead(userId: string, readAt: Date = new Date()): number {
    const records = this.recordsByUser.get(userId);
    if (!records) {
      return 0;
    }
    let updated = 0;
    records.forEach((record) => {
      if (!record.readAt) {
        record.readAt = new Date(readAt);
        updated += 1;
      }
    });
    return updated;
  }

  /** Count unread notifications for badge indicators. */
  countUnread(userId: string): number {
    const records = this.recordsByUser.get(userId) ?? [];
    return records.reduce((count, record) => (record.readAt ? count : count + 1), 0);
  }
}

/** Internal helper to clone delivery snapshots with fresh Date instances. */
function cloneDeliverySnapshot(delivery: NotificationDeliverySnapshot): NotificationDeliverySnapshot {
  return {
    state: delivery.state,
    channels: { ...delivery.channels },
    failureReasons: delivery.failureReasons ? { ...delivery.failureReasons } : undefined,
    deliveredAt: delivery.deliveredAt ? new Date(delivery.deliveredAt) : undefined,
  };
}

/** Internal helper to avoid leaking mutable references. */
function cloneRecord(record: NotificationRecord): NotificationRecord {
  return {
    ...record,
    meta: { ...record.meta },
    delivery: cloneDeliverySnapshot(record.delivery),
    createdAt: new Date(record.createdAt),
    readAt: record.readAt ? new Date(record.readAt) : undefined,
  };
}

/** Contract that delivery channels need to follow. */
export interface NotificationChannel {
  key: string;
  send(payload: NotificationPayload): Promise<void>;
}

/** Simple channel used for testing and smoke verifications. */
export class InMemoryChannel implements NotificationChannel {
  public readonly key = "memory";
  private readonly delivered: NotificationRecord[] = [];
  private readonly feed = new NotificationFeed();

  async send(payload: NotificationPayload): Promise<void> {
    const record = this.feed.record(payload, {
      state: "delivered",
      channels: { memory: "sent" },
      deliveredAt: new Date(),
    });
    this.delivered.push(...record);
  }

  /** Introspect previously delivered payloads for assertions. */
  list(): readonly NotificationRecord[] {
    return this.delivered.map((record) => cloneRecord(record));
  }
}

export interface NotificationDispatchResult {
  records: NotificationRecord[];
  delivery: NotificationDeliverySnapshot;
}

export interface NotificationCenterOptions {
  channels?: NotificationChannel[];
  feed?: NotificationFeed;
}

/**
 * Core notification center that coordinates delivery channels and feed storage.
 */
export class NotificationCenter {
  private readonly channels = new Map<string, NotificationChannel>();
  private readonly feed: NotificationFeed;

  constructor(options: NotificationCenterOptions = {}) {
    const { channels = [new InMemoryChannel()], feed = new NotificationFeed() } = options;
    this.feed = feed;
    channels.forEach((channel) => this.registerChannel(channel));
  }

  /** Direct access to the feed for listing or badge counts. */
  getFeed(): NotificationFeed {
    return this.feed;
  }

  /** Register (or replace) a channel by its key. */
  registerChannel(channel: NotificationChannel): void {
    this.channels.set(channel.key, channel);
  }

  /** Deliver a payload through the configured channels and persist the feed entries. */
  async dispatch(payload: NotificationPayload, channelKeys?: string[]): Promise<NotificationDispatchResult> {
    const keys = channelKeys ?? Array.from(this.channels.keys());

    if (keys.length === 0) {
      const delivery: NotificationDeliverySnapshot = { state: "queued", channels: {} };
      const records = this.feed.record(payload, delivery);
      return { records, delivery };
    }

    const missing: string[] = [];
    const channels = keys.map((key) => {
      const channel = this.channels.get(key);
      if (!channel) {
        missing.push(key);
      }
      return channel;
    });

    if (missing.length > 0) {
      const delivery: NotificationDeliverySnapshot = {
        state: "failed",
        channels: Object.fromEntries(keys.map((key) => [key, "failed" as ChannelDeliveryState])),
        failureReasons: Object.fromEntries(missing.map((key) => [key, "channel_not_found"])),
      };
      this.feed.record(payload, delivery);
      throw new NotificationDispatchError(
        `Notification channel not found: ${missing.join(", ")}`,
        delivery,
      );
    }

    const concreteChannels = channels.filter(
      (channel): channel is NotificationChannel => Boolean(channel),
    );

    const delivery: NotificationDeliverySnapshot = {
      state: "delivered",
      channels: Object.fromEntries(keys.map((key) => [key, "pending" as ChannelDeliveryState])),
      failureReasons: {},
    };

    const results = await Promise.allSettled(
      concreteChannels.map(async (channel) => {
        await channel.send(payload);
      }),
    );

    results.forEach((result, index) => {
      const key = keys[index];
      if (result.status === "fulfilled") {
        delivery.channels[key] = "sent";
      } else {
        delivery.channels[key] = "failed";
        const reason = result.reason instanceof Error ? result.reason.message : String(result.reason);
        if (delivery.failureReasons) {
          delivery.failureReasons[key] = reason;
        } else {
          delivery.failureReasons = { [key]: reason };
        }
      }
    });

    const channelStates = Object.values(delivery.channels);
    if (channelStates.every((state) => state === "sent")) {
      delivery.state = "delivered";
      delivery.deliveredAt = new Date();
      const records = this.feed.record(payload, delivery);
      return { records, delivery };
    }

    if (channelStates.every((state) => state === "failed")) {
      delivery.state = "failed";
    } else {
      delivery.state = "partial";
    }

    const records = this.feed.record(payload, delivery);
    throw new NotificationDispatchError(
      delivery.state === "partial"
        ? "Notification dispatch partially failed"
        : "Notification dispatch failed",
      delivery,
    );
  }
}

export const notificationCenter = new NotificationCenter();

export const notificationFeed = notificationCenter.getFeed();
