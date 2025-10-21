import argon2 from "@node-rs/argon2";
import crypto from "node:crypto";

const { hash: argonHash, verify: argonVerify } = argon2;
const ARGON_ALGORITHM = argon2.Algorithm?.Argon2id ?? 2;

const DEFAULT_HASH_LENGTH = 32;
const DEFAULT_MEMORY_COST = 19456; // 19 MiB keeps the hash strong but lightweight for tests.
const DEFAULT_TIME_COST = 2;
const DEFAULT_PARALLELISM = 1;
const DEFAULT_SALT_LENGTH = 16;

/**
 * Ensures the password input is a non-empty UTF-8 string.
 *
 * @param {unknown} password - Raw password to be validated.
 */
function assertPassword(password) {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("invalid_password_input");
  }
}

/**
 * Normalizes the hashing configuration, falling back to safe defaults.
 *
 * @param {{ memoryCost?: number; timeCost?: number; parallelism?: number; hashLength?: number; saltLength?: number; }} [options]
 *   Optional overrides for the Argon2 parameters.
 * @returns {{ memoryCost: number; timeCost: number; parallelism: number; hashLength: number; salt: Buffer }}
 *   Normalized hashing configuration with a random salt.
 */
function resolveHashOptions(options = {}) {
  const memoryCost = options.memoryCost ?? DEFAULT_MEMORY_COST;
  const timeCost = options.timeCost ?? DEFAULT_TIME_COST;
  const parallelism = options.parallelism ?? DEFAULT_PARALLELISM;
  const hashLength = options.hashLength ?? DEFAULT_HASH_LENGTH;
  const saltLength = options.saltLength ?? DEFAULT_SALT_LENGTH;

  if (!Number.isInteger(memoryCost) || memoryCost <= 0) {
    throw new Error("invalid_memory_cost");
  }
  if (!Number.isInteger(timeCost) || timeCost <= 0) {
    throw new Error("invalid_time_cost");
  }
  if (!Number.isInteger(parallelism) || parallelism <= 0) {
    throw new Error("invalid_parallelism");
  }
  if (!Number.isInteger(hashLength) || hashLength < 16) {
    throw new Error("invalid_hash_length");
  }
  if (!Number.isInteger(saltLength) || saltLength < 8) {
    throw new Error("invalid_salt_length");
  }

  return {
    memoryCost,
    timeCost,
    parallelism,
    hashLength,
    salt: crypto.randomBytes(saltLength),
  };
}

/**
 * Hashes the provided password using Argon2id and returns a PHC formatted string.
 *
 * @param {string} password - Password to hash.
 * @param {{ memoryCost?: number; timeCost?: number; parallelism?: number; hashLength?: number; saltLength?: number; }} [options]
 *   Optional hashing options.
 * @returns {Promise<string>} PHC formatted Argon2 hash string.
 */
export async function hashPassword(password, options) {
  assertPassword(password);
  const resolved = resolveHashOptions(options);
  return argonHash(password, {
    algorithm: ARGON_ALGORITHM,
    memoryCost: resolved.memoryCost,
    timeCost: resolved.timeCost,
    parallelism: resolved.parallelism,
    outputLen: resolved.hashLength,
    salt: resolved.salt,
  });
}

/**
 * Verifies the password against a stored Argon2 hash.
 *
 * @param {string} password - Candidate password to test.
 * @param {string} digest - Stored Argon2 PHC string.
 * @returns {Promise<boolean>} Whether the password matches the digest.
 */
export async function verifyPassword(password, digest) {
  assertPassword(password);
  if (typeof digest !== "string" || digest.length === 0) {
    throw new Error("invalid_digest_input");
  }

  if (!/^\$argon2/i.test(digest)) {
    throw new Error("invalid_digest_format");
  }

  try {
    return await argonVerify(digest, password, { algorithm: ARGON_ALGORITHM });
  } catch (error) {
    if (error instanceof Error && /hash verify failed/i.test(error.message)) {
      return false;
    }
    throw error;
  }
}

/**
 * Derives whether an Argon2 hash should be rehashed because options changed.
 *
 * @param {string} digest - Stored Argon2 PHC string.
 * @param {{ memoryCost?: number; timeCost?: number; parallelism?: number; hashLength?: number; }} [options]
 *   Desired hashing parameters.
 * @returns {boolean} True when the digest uses weaker parameters than requested.
 */
export function needsRehash(digest, options = {}) {
  if (typeof digest !== "string" || digest.length === 0) {
    throw new Error("invalid_digest_input");
  }

  const match = digest.match(/\$m=(\d+),t=(\d+),p=(\d+)/);
  if (!match) {
    throw new Error("invalid_digest_format");
  }

  const [, memoryCost, timeCost, parallelism] = match.map((value, index) => (index === 0 ? value : Number.parseInt(value, 10)));

  return (
    (options.memoryCost !== undefined && memoryCost < options.memoryCost) ||
    (options.timeCost !== undefined && timeCost < options.timeCost) ||
    (options.parallelism !== undefined && parallelism < options.parallelism)
  );
}

export const __internal = {
  assertPassword,
  resolveHashOptions,
};
