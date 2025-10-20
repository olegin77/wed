import assert from "node:assert/strict";
import test from "node:test";

import {
  InMemoryArchiveStore,
  createArchiveManager,
  listArchivedEnquiries,
  archiveEnquiry,
  restoreEnquiry,
  purgeEnquiry,
} from "./index.js";

test("in-memory store persists and restores enquiries", async () => {
  const store = new InMemoryArchiveStore();
  const manager = createArchiveManager(store);

  const archived = await manager.archive({ enquiryId: "enq-1", reason: "spam" });
  assert.equal(archived.enquiryId, "enq-1");
  assert.equal(archived.reason, "spam");

  const listed = await manager.list();
  assert.equal(listed.length, 1);

  const restored = await manager.restore("enq-1");
  assert(restored);
  assert.equal(restored?.enquiryId, "enq-1");

  const afterRestore = await manager.list();
  assert.equal(afterRestore.length, 0);
});

test("default manager exposes helper wrappers", async () => {
  await archiveEnquiry({ enquiryId: "enq-2", archivedBy: "moderator" });
  const listed = await listArchivedEnquiries();
  assert.equal(listed.length, 1);
  assert.equal(listed[0]?.archivedBy, "moderator");

  const restored = await restoreEnquiry("enq-2");
  assert(restored);

  const purgeResult = await purgeEnquiry("enq-2");
  assert.equal(purgeResult, true);
});
