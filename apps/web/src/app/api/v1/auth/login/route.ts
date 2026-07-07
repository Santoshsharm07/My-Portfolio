import bcrypt from "bcryptjs";
import { loginInput } from "@portfolio/types";
import { handle, ok, unauthorized, readJson } from "@/server/http";
import { parse } from "@/server/resources";
import { serverEnv } from "@/server/env";
import { COOKIE_NAME, cookieOptions, signAdminToken } from "@/server/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = handle(async (req: Request) => {
  const { username, password } = parse(loginInput, await readJson(req)) as {
    username: string;
    password: string;
  };

  const userOk = username === serverEnv.adminUsername;
  const passOk = await bcrypt.compare(password, serverEnv.adminPasswordHash);
  if (!userOk || !passOk) throw unauthorized("Invalid credentials");

  const profile = { username, role: "admin" as const };
  const token = signAdminToken(profile);
  const res = ok({ profile, token });
  res.cookies.set(COOKIE_NAME, token, cookieOptions);
  return res;
});
