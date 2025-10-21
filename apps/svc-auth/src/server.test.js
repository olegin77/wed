import assert from "node:assert/strict";
import { test } from "node:test";

import { createAuthHandlers } from "./server.js";

function createMemoryRepository() {
  const users = new Map();
  let sequence = 0;

  return {
    async findByEmail(email) {
      return users.get(email) ?? null;
    },
    async createUser(data) {
      const now = new Date(1_700_000_000_000);
      const user = {
        id: `user_${++sequence}`,
        email: data.email,
        passwordHash: data.passwordHash,
        role: data.role,
        locale: data.locale,
        phone: data.phone,
        createdAt: now,
        updatedAt: now,
      };
      users.set(user.email, user);
      return user;
    },
  };
}

test("register hashes password and returns session cookie", async () => {
  const repo = createMemoryRepository();
  const handlers = createAuthHandlers({
    userRepository: repo,
    jwtSecret: "secret",
    sessionTtlSeconds: 600,
    cookieName: "wt_session",
    now: () => new Date(1_700_000_000_000),
    hash: async (password) => `hashed:${password}`,
  });

  const result = await handlers.register({ email: "User@Example.com", password: "Password1", role: "pair" });

  assert.equal(result.status, 201);
  assert.ok(result.cookies?.[0].startsWith("wt_session="));
  assert.ok(result.body.token.length > 10);
  assert.equal(result.body.user.email, "user@example.com");
  assert.equal(result.body.user.role, "PAIR");

  const stored = await repo.findByEmail("user@example.com");
  assert.equal(stored.passwordHash, "hashed:Password1");
});

test("register rejects duplicate emails", async () => {
  const repo = createMemoryRepository();
  const handlers = createAuthHandlers({
    userRepository: repo,
    hash: async (password) => `hash:${password}`,
  });

  await handlers.register({ email: "test@example.com", password: "Password1" });
  const duplicate = await handlers.register({ email: "test@example.com", password: "Password1" });
  assert.equal(duplicate.status, 409);
  assert.equal(duplicate.body.error, "email_taken");
});

test("register enforces password policy", async () => {
  const repo = createMemoryRepository();
  const handlers = createAuthHandlers({ userRepository: repo });

  const weak = await handlers.register({ email: "weak@example.com", password: "short" });
  assert.equal(weak.status, 400);
  assert.equal(weak.body.error, "weak_password");
  assert.ok(Array.isArray(weak.body.reasons));
});

test("login validates credentials and issues a session", async () => {
  const repo = createMemoryRepository();
  const handlers = createAuthHandlers({
    userRepository: repo,
    jwtSecret: "secret",
    sessionTtlSeconds: 600,
    now: () => new Date(1_700_000_000_000),
    hash: async (password) => `hash:${password}`,
    verify: async (password, digest) => digest === "hash:Password1" && password === "Password1",
  });

  await handlers.register({ email: "login@example.com", password: "Password1" });
  const result = await handlers.login({ email: "login@example.com", password: "Password1" });

  assert.equal(result.status, 200);
  assert.equal(result.body.user.email, "login@example.com");
  assert.ok(result.cookies?.[0].includes("Max-Age=600"));
});

test("login rejects invalid credentials", async () => {
  const repo = createMemoryRepository();
  const handlers = createAuthHandlers({
    userRepository: repo,
    verify: async () => false,
  });

  await handlers.register({ email: "fail@example.com", password: "Password1" });
  const result = await handlers.login({ email: "fail@example.com", password: "wrong" });
  assert.equal(result.status, 400);
  const result2 = await handlers.login({ email: "fail@example.com", password: "Password1" });
  assert.equal(result2.status, 401);
});

// health

