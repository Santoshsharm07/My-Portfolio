import { Router } from "express";
import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { loginInput } from "@portfolio/types";
import { validateBody } from "../middleware/validate.js";
import { requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/error.js";
import {
  COOKIE_NAME,
  cookieOptions,
  signAdminToken,
} from "../lib/jwt.js";
import { unauthorized } from "../lib/http-error.js";

export const authRouter: import("express").Router = Router();

authRouter.post(
  "/login",
  validateBody(loginInput),
  asyncHandler(async (req, res) => {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };
    const userOk = username === env.adminUsername;
    const passOk = await bcrypt.compare(password, env.adminPasswordHash);
    if (!userOk || !passOk) throw unauthorized("Invalid credentials");

    const profile = { username, role: "admin" as const };
    const token = signAdminToken(profile);
    res.cookie(COOKIE_NAME, token, cookieOptions);
    res.json({ data: { profile, token } });
  }),
);

authRouter.post("/logout", (_req, res) => {
  res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: undefined });
  res.json({ data: { ok: true } });
});

authRouter.get("/me", requireAdmin, (req, res) => {
  res.json({ data: { profile: req.admin } });
});
