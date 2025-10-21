import type { JwtClaims } from "./jwt.js";
import { requireRole as requireRoleImpl } from "./roles.js";

export type AuthenticatedRequest = {
  headers?: { cookie?: string } & Record<string, unknown>;
  user?: JwtClaims & { role?: string };
};

export type RoleGuard = "ADMIN" | "VENDOR" | "USER";

export type RoleMiddleware = (req: AuthenticatedRequest, res: any, next: () => void) => void;

/**
 * Creates a middleware that ensures the authenticated principal satisfies the minimum
 * role requirement. When authorised, the decoded JWT claims are exposed on `req.user`.
 */
export const requireRole: (role: RoleGuard) => RoleMiddleware = requireRoleImpl;
