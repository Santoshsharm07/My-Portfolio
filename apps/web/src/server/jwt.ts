import "server-only";
import jwt from "jsonwebtoken";
import { serverEnv } from "./env";
import type { AdminProfile } from "@portfolio/types";

const EXPIRES_IN = "12h";
export const COOKIE_NAME = "portfolio_admin";

export function signAdminToken(profile: AdminProfile): string {
  return jwt.sign(profile, serverEnv.jwtSecret, { expiresIn: EXPIRES_IN });
}

export function verifyAdminToken(token: string): AdminProfile | null {
  try {
    const decoded = jwt.verify(token, serverEnv.jwtSecret);
    if (typeof decoded === "object" && decoded && "username" in decoded) {
      return { username: String(decoded.username), role: "admin" };
    }
    return null;
  } catch {
    return null;
  }
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: serverEnv.isProd,
  path: "/",
  maxAge: 12 * 60 * 60, // seconds (Next cookies API)
};
