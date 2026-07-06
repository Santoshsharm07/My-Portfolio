import type { Request, Response, NextFunction } from "express";
import { COOKIE_NAME, verifyAdminToken } from "../lib/jwt.js";
import { unauthorized } from "../lib/http-error.js";
import type { AdminProfile } from "@portfolio/types";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: AdminProfile;
    }
  }
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const token = req.cookies?.[COOKIE_NAME] ?? bearer;
  const profile = token ? verifyAdminToken(token) : null;
  if (!profile) return next(unauthorized());
  req.admin = profile;
  next();
}
