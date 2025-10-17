import { randomUUID } from "node:crypto";

export type NotificationPayload = {
  id?: string;
  type: string;
  subject: string;
  body: string;
  recipients: string[];
  meta?: Record<string, unknown>;
};

export interface NotificationChannel {
  key: string;
  send(payload: NotificationPayload): Promise<void>;
}

export class InMemoryChannel implements NotificationChannel {
  public readonly key = "memory";
  private readonly delivered: NotificationPayload[] = [];

  async send(payload: NotificationPayload): Promise<void> {
    this.delivered.push({ ...payload, id: payload.id ?? randomUUID() });
  }

  list(): readonly NotificationPayload[] {
    return this.delivered;
  }
}

export class NotificationCenter {
  private readonly channels = new Map<string, NotificationChannel>();

  constructor(initialChannels: NotificationChannel[] = [new InMemoryChannel()]) {
    initialChannels.forEach((channel) => this.registerChannel(channel));
  }

  registerChannel(channel: NotificationChannel): void {
    this.channels.set(channel.key, channel);
  }

  async dispatch(payload: NotificationPayload, channelKeys?: string[]): Promise<void> {
    const keys = channelKeys ?? Array.from(this.channels.keys());
    await Promise.all(
      keys.map(async (key) => {
        const channel = this.channels.get(key);
        if (!channel) {
          throw new Error(`Notification channel not found: ${key}`);
        }
        await channel.send(payload);
      }),
    );
  }
}

export const notificationCenter = new NotificationCenter();
