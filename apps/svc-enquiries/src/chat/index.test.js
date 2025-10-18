import assert from "node:assert/strict";
import { test } from "node:test";

import {
  EnquiryChatChannelService,
  EnquiryChatError,
} from "./index.js";

const NOW = new Date("2025-01-01T00:00:00.000Z");

const vendorOwner = { id: "user-vendor", email: "vendor@example.com" };
const vendor = {
  id: "vendor-1",
  title: "Royal Hall",
  ownerUserId: vendorOwner.id,
  owner: vendorOwner,
};
const coupleUser = { id: "user-couple", email: "aliya@example.com" };
const couple = { id: "couple-1", user: coupleUser };
const enquiry = {
  id: "enquiry-1",
  coupleId: couple.id,
  vendorId: vendor.id,
  vendor,
  couple,
  user: coupleUser,
  channel: null,
};
const channelRecord = {
  id: "channel-1",
  enquiryId: enquiry.id,
  coupleId: couple.id,
  vendorId: vendor.id,
  coupleUserId: coupleUser.id,
  primaryVendorUserId: vendorOwner.id,
  createdAt: NOW,
  updatedAt: NOW,
  enquiry: { ...enquiry, channel: undefined },
  couple,
  vendor,
  coupleUser,
  primaryVendorUser: vendorOwner,
};

const createMockPrisma = (options = {}) => {
  const state = {
    upsertCalled: false,
    upsertArgs: null,
    findManyArgs: null,
  };

  const prisma = {
    enquiry: {
      async findUnique(args) {
        if (options.missingEnquiry) {
          return null;
        }
        return {
          ...enquiry,
          ...(options.existingChannel ? { channel: channelRecord } : {}),
        };
      },
    },
    enquiryChannel: {
      async upsert(args) {
        state.upsertCalled = true;
        state.upsertArgs = args;
        return channelRecord;
      },
      async findMany(args) {
        state.findManyArgs = args;
        return [channelRecord];
      },
    },
  };

  return { prisma, state };
};

test("ensureForEnquiry creates a channel when missing", async () => {
  const { prisma, state } = createMockPrisma();
  const service = new EnquiryChatChannelService(prisma);

  const summary = await service.ensureForEnquiry("enquiry-1");

  assert.equal(state.upsertCalled, true, "expected upsert to be invoked");
  assert.equal(summary.id, channelRecord.id);
  assert.equal(summary.participants.length, 2);
  assert.deepEqual(
    summary.participants.map((p) => p.role),
    ["couple", "vendor"],
  );
  assert.equal(state.upsertArgs?.create?.coupleUserId, coupleUser.id);
  assert.equal(state.upsertArgs?.create?.primaryVendorUserId, vendorOwner.id);
});

test("ensureForEnquiry reuses an existing channel", async () => {
  const { prisma, state } = createMockPrisma({ existingChannel: true });
  const service = new EnquiryChatChannelService(prisma);

  const summary = await service.ensureForEnquiry("enquiry-1");

  assert.equal(state.upsertCalled, false, "should not upsert when channel exists");
  assert.equal(summary.id, channelRecord.id);
});

test("ensureForEnquiry surfaces not found errors", async () => {
  const { prisma } = createMockPrisma({ missingEnquiry: true });
  const service = new EnquiryChatChannelService(prisma);

  await assert.rejects(
    () => service.ensureForEnquiry("missing"),
    (error) => {
      assert.ok(error instanceof EnquiryChatError);
      assert.equal(error.code, "enquiry_not_found");
      return true;
    },
  );
});

test("listForUser returns enriched channel summaries", async () => {
  const { prisma, state } = createMockPrisma();
  const service = new EnquiryChatChannelService(prisma);

  const channels = await service.listForUser(coupleUser.id);

  assert.equal(state.findManyArgs.where.OR.length >= 1, true);
  assert.equal(channels.length, 1);
  assert.equal(channels[0].participants[0].role, "couple");
  assert.equal(channels[0].participants[1].role, "vendor");
});
