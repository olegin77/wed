import type { Options as ArgonOptions } from "@node-rs/argon2";
import { hashPassword as hashPasswordImpl, needsRehash as needsRehashImpl, verifyPassword as verifyPasswordImpl } from "./password.js";

export interface PasswordHashOptions {
  /** Memory cost parameter `m` supplied to Argon2. Defaults to 19456. */
  memoryCost?: number;
  /** Iteration count `t` supplied to Argon2. Defaults to 2. */
  timeCost?: number;
  /** Parallelism parameter `p` supplied to Argon2. Defaults to 1. */
  parallelism?: number;
  /** Desired byte length of the derived hash. Defaults to 32. */
  hashLength?: number;
  /** Random salt length used for hashing. Defaults to 16. */
  saltLength?: number;
}

export type PasswordHash = string;

/**
 * Hashes a password using Argon2id and produces a PHC formatted digest string.
 */
export const hashPassword: (password: string, options?: PasswordHashOptions) => Promise<PasswordHash> = hashPasswordImpl as (
  password: string,
  options?: PasswordHashOptions,
) => Promise<string>;

/**
 * Verifies a password against the stored Argon2 digest.
 */
export const verifyPassword: (password: string, digest: PasswordHash) => Promise<boolean> = verifyPasswordImpl;

/**
 * Checks whether a digest should be rehashed with stronger parameters.
 */
export const needsRehash: (digest: PasswordHash, options?: PasswordHashOptions) => boolean = needsRehashImpl;

export type InternalHashOptions = ArgonOptions;
