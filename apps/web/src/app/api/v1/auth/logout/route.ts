import { handle, ok } from "@/server/http";
import { COOKIE_NAME } from "@/server/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const POST = handle(async () => {
  const res = ok({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
});
