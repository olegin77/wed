import assert from "node:assert/strict";
import { test } from "node:test";

import { hashPassword, needsRehash, verifyPassword } from "./password.js";

test("hashPassword produces argon2id digest verifiable with verifyPassword", async () => {
  const digest = await hashPassword("super-secret", { memoryCost: 4096, timeCost: 3, parallelism: 1 });

  assert.match(digest, /^\$argon2id\$/);
  assert.equal(await verifyPassword("super-secret", digest), true);
  assert.equal(await verifyPassword("another", digest), false);
});

test("needsRehash detects weaker parameters", async () => {
  const digest = await hashPassword("password", { memoryCost: 4096, timeCost: 2, parallelism: 1 });
  assert.equal(needsRehash(digest, { memoryCost: 4096, timeCost: 2, parallelism: 1 }), false);
  assert.equal(needsRehash(digest, { memoryCost: 8192 }), true);
  assert.equal(needsRehash(digest, { timeCost: 3 }), true);
});

test("hashPassword rejects invalid inputs", async () => {
  await assert.rejects(() => hashPassword("", {}), /invalid_password_input/);
  await assert.rejects(() => hashPassword("pw", { memoryCost: -1 }), /invalid_memory_cost/);
  await assert.rejects(() => hashPassword("pw", { saltLength: 4 }), /invalid_salt_length/);
});

test("verifyPassword rejects malformed digest", async () => {
  const digest = await hashPassword("pw", { memoryCost: 4096 });
  await assert.rejects(() => verifyPassword("pw", ""), /invalid_digest_input/);
  await assert.rejects(() => verifyPassword("pw", digest.replace("$", "")), /invalid_digest_format/);
});
