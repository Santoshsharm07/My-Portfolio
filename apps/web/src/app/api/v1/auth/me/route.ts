import { handle, ok } from "@/server/http";
import { requireAdmin } from "@/server/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const GET = handle(async (req: Request) => {
  const profile = await requireAdmin(req);
  return ok({ profile });
});
