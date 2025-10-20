import assert from "node:assert/strict";
import test from "node:test";

import {
  createMemorySink,
  createSecurityAuditLogger,
  sanitiseMetadata,
  recordSecurityEvent,
} from "./index";

test("sanitises sensitive metadata keys", () => {
  const sanitised = sanitiseMetadata({ password: "secret", note: "ok" });
  assert.equal(sanitised.password, "[redacted]");
  assert.equal(sanitised.note, "ok");
});

test("logger normalises events and writes to sinks", async () => {
  const sink = createMemorySink();
  const logger = createSecurityAuditLogger({ sinks: [sink], clock: () => new Date("2024-01-01T00:00:00Z") });
  const event = await logger.record({ type: "login", actorId: "user-1", metadata: { token: "abc" } });
  assert.equal(event.type, "login");
  assert.equal(event.metadata.token, "[redacted]");
  assert.equal(event.createdAt.toISOString(), "2024-01-01T00:00:00.000Z");

  const stored = sink.all();
  assert.equal(stored.length, 1);
});

test("default logger is usable via recordSecurityEvent", async () => {
  const result = await recordSecurityEvent({ type: "password_reset", actorId: "user-2" });
  assert.equal(result.type, "password_reset");
});
