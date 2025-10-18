import { PrismaClient, type Prisma } from "@prisma/client";

/**
 * Participants that form a chat channel. Each participant is tied to a user
 * account but we also surface a display name so UI layers can present a
 * friendly label without performing extra lookups.
 */
export type ChannelParticipant = {
  role: "couple" | "vendor";
  userId: string;
  displayName: string;
  email?: string | null;
};

/**
 * Summary describing a chat channel that belongs to an enquiry. The structure
 * is intentionally compact so it can be serialised to JSON responses without
 * leaking internal Prisma details.
 */
export type ChannelSummary = {
  id: string;
  enquiryId: string;
  coupleId: string;
  vendorId: string;
  participants: ChannelParticipant[];
  createdAt: Date;
  updatedAt: Date;
};

/**
 * Error raised by chat channel operations. Consumers can inspect the `code`
 * property to tailor HTTP responses.
 */
export class EnquiryChatError extends Error {
  constructor(
    readonly code:
      | "enquiry_not_found"
      | "enquiry_missing_couple"
      | "enquiry_missing_vendor",
    message: string,
  ) {
    super(message);
    this.name = "EnquiryChatError";
  }
}

/**
 * Prisma include configuration reused across channel lookups. The definition is
 * hoisted to a constant so both runtime logic and TypeScript types stay in sync.
 */
const channelInclude = {
  enquiry: {
    include: {
      vendor: { include: { owner: true } },
      couple: { include: { user: true } },
      user: true,
    },
  },
  couple: { include: { user: true } },
  vendor: { include: { owner: true } },
  coupleUser: true,
  primaryVendorUser: true,
} satisfies Prisma.EnquiryChannelInclude;

type ChannelWithRelations = Prisma.EnquiryChannelGetPayload<{
  include: typeof channelInclude;
}>;

/**
 * Narrowed Prisma client requirements so the service stays easy to test. Any
 * object that implements these methods (including transaction clients) can back
 * the channel service.
 */
export type ChatPrismaClient = Pick<PrismaClient, "enquiry" | "enquiryChannel">;

/**
 * Service responsible for reconciling chat channels for enquiries. It ensures
 * idempotent creation, derives participants, and exposes query helpers for UI
 * layers.
 */
export class EnquiryChatChannelService {
  constructor(private readonly prisma: ChatPrismaClient) {}

  /**
   * Ensures a channel exists for the provided enquiry. The operation is
   * idempotent and will reconcile participant information on subsequent calls.
   */
  async ensureForEnquiry(enquiryId: string): Promise<ChannelSummary> {
    const enquiry = await this.prisma.enquiry.findUnique({
      where: { id: enquiryId },
      include: {
        vendor: { include: { owner: true } },
        couple: { include: { user: true } },
        user: true,
        channel: { include: channelInclude },
      },
    });

    if (!enquiry) {
      throw new EnquiryChatError(
        "enquiry_not_found",
        `Enquiry ${enquiryId} could not be located for chat channel provisioning`,
      );
    }

    if (!enquiry.couple) {
      throw new EnquiryChatError(
        "enquiry_missing_couple",
        `Enquiry ${enquiryId} does not have an associated couple profile`,
      );
    }

    if (!enquiry.vendor) {
      throw new EnquiryChatError(
        "enquiry_missing_vendor",
        `Enquiry ${enquiryId} does not reference a vendor`,
      );
    }

    if (enquiry.channel) {
      return this.buildSummary(enquiry.channel);
    }

    const coupleOwner = enquiry.user ?? enquiry.couple.user ?? null;
    const channel = await this.prisma.enquiryChannel.upsert({
      where: { enquiryId: enquiry.id },
      update: {
        coupleId: enquiry.coupleId,
        vendorId: enquiry.vendorId,
        coupleUserId: coupleOwner?.id ?? null,
        primaryVendorUserId: enquiry.vendor.ownerUserId,
      },
      create: {
        enquiryId: enquiry.id,
        coupleId: enquiry.coupleId,
        vendorId: enquiry.vendorId,
        coupleUserId: coupleOwner?.id,
        primaryVendorUserId: enquiry.vendor.ownerUserId,
      },
      include: channelInclude,
    });

    return this.buildSummary(channel);
  }

  /**
   * Lists all chat channels visible to a user. Vendors see conversations they
   * own or manage, while couples see threads linked to their enquiries.
   */
  async listForUser(userId: string): Promise<ChannelSummary[]> {
    const channels = await this.prisma.enquiryChannel.findMany({
      where: {
        OR: [
          { coupleUserId: userId },
          { primaryVendorUserId: userId },
          { vendor: { ownerUserId: userId } },
          { enquiry: { userId } },
        ],
      },
      orderBy: { updatedAt: "desc" },
      include: channelInclude,
    });

    return channels.map((channel) => this.buildSummary(channel));
  }

  private buildSummary(channel: ChannelWithRelations): ChannelSummary {
    const participants: ChannelParticipant[] = [];

    const coupleAccount =
      channel.coupleUser ?? channel.enquiry.user ?? channel.couple.user ?? null;
    if (coupleAccount) {
      participants.push({
        role: "couple",
        userId: coupleAccount.id,
        displayName: coupleAccount.email ?? `pair:${channel.coupleId}`,
        email: coupleAccount.email,
      });
    }

    const vendorAccount = channel.primaryVendorUser ?? channel.vendor.owner;
    participants.push({
      role: "vendor",
      userId: vendorAccount.id,
      displayName: channel.vendor.title,
      email: vendorAccount.email,
    });

    return {
      id: channel.id,
      enquiryId: channel.enquiryId,
      coupleId: channel.coupleId,
      vendorId: channel.vendorId,
      participants,
      createdAt: channel.createdAt,
      updatedAt: channel.updatedAt,
    };
  }
}

/**
 * Factory helper that instantiates the chat channel service with a dedicated
 * Prisma client. Services may prefer to inject their own client, but providing
 * a default keeps simple scripts ergonomic.
 */
export function createEnquiryChatChannelService(
  prisma: ChatPrismaClient = new PrismaClient(),
) {
  return new EnquiryChatChannelService(prisma);
}

/**
 * Shared singleton used by modules that do not manage their own Prisma
 * lifecycle (for example, HTTP handlers). Consumers are encouraged to manage
 * the returned client's lifecycle explicitly in long-running services.
 */
let defaultService: EnquiryChatChannelService | null = null;

/**
 * Returns a cached enquiry chat channel service. When a Prisma client is
 * supplied we reuse it, otherwise a singleton backed by its own client is
 * created lazily on first access.
 */
export function getEnquiryChatChannels(prisma?: ChatPrismaClient) {
  if (prisma) {
    defaultService = new EnquiryChatChannelService(prisma);
    return defaultService;
  }

  if (!defaultService) {
    defaultService = createEnquiryChatChannelService();
  }

  return defaultService;
}
