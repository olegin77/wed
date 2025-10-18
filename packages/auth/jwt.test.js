import assert from "node:assert/strict";
import { test } from "node:test";

import { decodeJwt, signJwt, verifyJwt } from "./jwt.js";

test("signJwt embeds exp/iat and verifyJwt returns claims when valid", () => {
  const now = 1_700_000_000;
  const token = signJwt(
    { sub: "user-123" },
    "top-secret",
    { now, expiresIn: "15m" }
  );

  const claims = verifyJwt(token, "top-secret", { now: now + 30 });
  assert.ok(claims);
  assert.equal(claims.sub, "user-123");
  assert.equal(claims.iat, now);
  assert.equal(claims.exp, now + 15 * 60);
});

test("verifyJwt returns null when token expired", () => {
  const now = 1_700_000_000;
  const token = signJwt({ aud: "catalog" }, "another-secret", { now, expiresIn: 30 });
  const claims = verifyJwt(token, "another-secret", { now: now + 45 });
  assert.equal(claims, null);
});

test("verifyJwt respects not-before claim with tolerance", () => {
  const now = 1_700_000_000;
  const token = signJwt({ role: "admin" }, "shared", { now, notBefore: "10s", includeIssuedAt: false });

  assert.equal(verifyJwt(token, "shared", { now: now + 5 }), null);
  const relaxed = verifyJwt(token, "shared", { now: now + 5, clockTolerance: "5s" });
  assert.ok(relaxed);
  assert.equal(relaxed.role, "admin");
  assert.equal(relaxed.nbf, now + 10);
  assert.equal(relaxed.iat, undefined);
});

test("decodeJwt exposes parsed header and payload without verification", () => {
  const now = 1_700_000_000;
  const token = signJwt({ sub: "user-1" }, "secret", { now, expiresIn: "1h" });
  const decoded = decodeJwt(token);

  assert.ok(decoded);
  assert.deepEqual(decoded.header, { alg: "HS256", typ: "JWT" });
  assert.equal(decoded.payload.sub, "user-1");
  assert.equal(decoded.payload.exp, now + 60 * 60);
});
