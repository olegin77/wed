import assert from "node:assert/strict";
import { test } from "node:test";

import { signJwt } from "./jwt.js";
import { extractJwtFromCookie, requireRole, resolveJwtSecret } from "./roles.js";

const ORIGINAL_SECRET = process.env.JWT_SECRET;

function withJwtSecret(secret, fn) {
  return async () => {
    process.env.JWT_SECRET = secret;
    try {
      await fn();
    } finally {
      process.env.JWT_SECRET = ORIGINAL_SECRET;
    }
  };
}

test("extractJwtFromCookie returns token when present", () => {
  assert.equal(extractJwtFromCookie("foo=bar; jwt=abc.def.ghi"), "abc.def.ghi");
  assert.equal(extractJwtFromCookie(undefined), null);
  assert.equal(extractJwtFromCookie("session=1"), null);
});

test("resolveJwtSecret returns configured value or null", async () => {
  await withJwtSecret("", () => {
    assert.equal(resolveJwtSecret(), null);
  })();
  await withJwtSecret("super-secret", () => {
    assert.equal(resolveJwtSecret(), "super-secret");
  })();
});

test(
  "requireRole allows users meeting the threshold and attaches claims",
  withJwtSecret("test-secret", async () => {
    const token = signJwt({ sub: "user-1", role: "VENDOR" }, "test-secret");
    const req = { headers: { cookie: `jwt=${token}` } };
    const res = createMockResponse();

    let called = false;
    requireRole("USER")(req, res, () => {
      called = true;
    });

    assert.equal(called, true);
    assert.equal(res.statusCode, null);
    assert.equal(req.user.sub, "user-1");
    assert.equal(req.user.role, "VENDOR");
  }),
);

test(
  "requireRole rejects when role insufficient",
  withJwtSecret("another-secret", async () => {
    const token = signJwt({ sub: "user-2", role: "USER" }, "another-secret");
    const req = { headers: { cookie: `jwt=${token}` } };
    const res = createMockResponse();

    requireRole("ADMIN")(req, res, () => {
      throw new Error("should not call next");
    });

    assert.equal(res.statusCode, 403);
    assert.equal(res.body, "forbidden");
  }),
);

test(
  "requireRole responds with 401 when token missing or invalid",
  withJwtSecret("secret", async () => {
    const resMissing = createMockResponse();
    requireRole("USER")({ headers: {} }, resMissing, () => {
      throw new Error("should not call next");
    });
    assert.equal(resMissing.statusCode, 401);

    const resInvalid = createMockResponse();
    requireRole("USER")({ headers: { cookie: "jwt=invalid" } }, resInvalid, () => {
      throw new Error("should not call next");
    });
    assert.equal(resInvalid.statusCode, 401);
  }),
);

function createMockResponse() {
  return {
    statusCode: null,
    body: null,
    writeHead(status) {
      this.statusCode = status;
      return this;
    },
    end(payload) {
      this.body = payload ?? null;
    },
  };
}
