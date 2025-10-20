import type { ServerResponse } from "http";

export type SecurityHeader = readonly [string, string];

export declare const securityHeaders: readonly SecurityHeader[];

export declare function applySecurityHeaders(
  res: ServerResponse,
  overrides?: readonly SecurityHeader[]
): ServerResponse;
