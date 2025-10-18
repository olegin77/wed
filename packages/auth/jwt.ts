import { decodeJwt as decodeJwtImpl, signJwt as signJwtImpl, verifyJwt as verifyJwtImpl } from "./jwt.js";

export type DurationInput = number | `${number}${"s" | "m" | "h" | "d"}`;

export type JwtClaims = Record<string, unknown> & {
  /** UNIX timestamp in seconds representing the issued-at moment. */
  iat?: number;
  /** UNIX timestamp in seconds after which the token becomes invalid. */
  exp?: number;
  /** UNIX timestamp in seconds before which the token is not yet valid. */
  nbf?: number;
};

export interface JwtSignOptions {
  /** Optional relative expiration configured either in seconds or a shorthand string such as `15m`. */
  expiresIn?: DurationInput;
  /** Optional relative not-before offset configured either in seconds or shorthand string such as `10s`. */
  notBefore?: DurationInput;
  /** Overrides the clock moment (in seconds or as a `Date`) used for `iat`/`exp`/`nbf` calculations. */
  now?: number | Date;
  /** When set to `false`, the helper will skip embedding the `iat` claim. */
  includeIssuedAt?: boolean;
}

export interface JwtVerifyOptions {
  /** Overrides the verification time (in seconds or as a `Date`) used for expiry/activation checks. */
  now?: number | Date;
  /**
   * Grace window applied to the `exp` and `nbf` checks. Can be a number of seconds or a shorthand string such as `2s`.
   */
  clockTolerance?: DurationInput;
}

/**
 * Signs an arbitrary set of claims using the shared HS256 secret.
 */
export const signJwt: (payload: JwtClaims, secret: string, options?: JwtSignOptions) => string = signJwtImpl;

/**
 * Validates a token and returns the original claims when the signature and temporal checks pass.
 */
export const verifyJwt: (token: string, secret: string, options?: JwtVerifyOptions) => JwtClaims | null = verifyJwtImpl;

/**
 * Decodes the token without validating the signature. Intended strictly for diagnostics.
 */
export const decodeJwt: (token: string) => { header: Record<string, unknown>; payload: JwtClaims } | null = decodeJwtImpl;
