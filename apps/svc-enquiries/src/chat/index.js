// @ts-check
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

/**
 * @typedef {Object} ChannelParticipant
 * @property {"couple"|"vendor"} role
 * @property {string} userId
 * @property {string} displayName
 * @property {string | null | undefined} [email]
 */

/**
 * @typedef {Object} ChannelSummary
 * @property {string} id
 * @property {string} enquiryId
 * @property {string} coupleId
 * @property {string} vendorId
 * @property {ChannelParticipant[]} participants
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/**
 * Error raised by chat channel operations. Consumers can inspect the `code`
 * property to tailor HTTP responses.
 */
export class EnquiryChatError extends Error {
  /**
   * @param {"enquiry_not_found"|"enquiry_missing_couple"|"enquiry_missing_vendor"} code
   * @param {string} message
   */
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "EnquiryChatError";
  }
}

/** @type {import("@prisma/client").Prisma.EnquiryChannelInclude} */
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
};

/**
 * @typedef {import("@prisma/client").Prisma.EnquiryChannelGetPayload<{ include: typeof channelInclude }>} ChannelWithRelations
 */

/**
 * @typedef {Pick<import("@prisma/client").PrismaClient, "enquiry"|"enquiryChannel">} ChatPrismaClient
 */

/**
 * Service responsible for reconciling chat channels for enquiries. It ensures
 * idempotent creation, derives participants, and exposes query helpers for UI
 * layers.
 */
export class EnquiryChatChannelService {
  /**
   * @param {ChatPrismaClient} prisma
   */
  constructor(prisma) {
    this.prisma = prisma;
  }

  /**
   * Ensures a channel exists for the provided enquiry. The operation is
   * idempotent and will reconcile participant information on subsequent calls.
   *
   * @param {string} enquiryId
   * @returns {Promise<ChannelSummary>}
   */
  async ensureForEnquiry(enquiryId) {
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
      return this.#buildSummary(enquiry.channel);
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

    return this.#buildSummary(channel);
  }

  /**
   * Lists all chat channels visible to a user. Vendors see conversations they
   * own or manage, while couples see threads linked to their enquiries.
   *
   * @param {string} userId
   * @returns {Promise<ChannelSummary[]>}
   */
  async listForUser(userId) {
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

    return channels.map((channel) => this.#buildSummary(channel));
  }

  /**
   * @param {ChannelWithRelations} channel
   * @returns {ChannelSummary}
   */
  #buildSummary(channel) {
    /** @type {ChannelParticipant[]} */
    const participants = [];

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
 *
 * @param {ChatPrismaClient} [prisma]
 * @returns {EnquiryChatChannelService}
 */
export function createEnquiryChatChannelService(prisma = new PrismaClient()) {
  return new EnquiryChatChannelService(prisma);
}

/**
 * Shared singleton used by modules that do not manage their own Prisma
 * lifecycle (for example, HTTP handlers). Consumers are encouraged to manage
 * the returned client's lifecycle explicitly in long-running services.
 */
let defaultService = null;

/**
 * Returns a cached enquiry chat channel service. When a Prisma client is
 * supplied we reuse it, otherwise a singleton backed by its own client is
 * created lazily on first access.
 *
 * @param {ChatPrismaClient} [prisma]
 * @returns {EnquiryChatChannelService}
 */
export function getEnquiryChatChannels(prisma) {
  if (prisma) {
    defaultService = new EnquiryChatChannelService(prisma);
    return defaultService;
  }

  if (!defaultService) {
    defaultService = createEnquiryChatChannelService();
  }

  return defaultService;
}
