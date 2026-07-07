import "server-only";
import { cookies } from "next/headers";
import { COOKIE_NAME, verifyAdminToken } from "./jwt";
import { unauthorized } from "./http";
import type { AdminProfile } from "@portfolio/types";

/**
 * Resolve the admin from either the Bearer token (localStorage-based client) or
 * the httpOnly cookie. Throws `unauthorized` when neither is valid.
 */
export async function requireAdmin(req: Request): Promise<AdminProfile> {
  const bearer = req.headers
    .get("authorization")
    ?.replace(/^Bearer\s+/i, "");
  const cookieToken = (await cookies()).get(COOKIE_NAME)?.value;
  const token = bearer || cookieToken;
  const profile = token ? verifyAdminToken(token) : null;
  if (!profile) throw unauthorized();
  return profile;
}
