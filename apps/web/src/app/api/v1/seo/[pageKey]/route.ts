import { handle, ok } from "@/server/http";
import { getSeo } from "@/server/content";

export const runtime = "nodejs";

export const GET = handle(
  async (_req: Request, ctx: { params: Promise<{ pageKey: string }> }) => {
    const { pageKey } = await ctx.params;
    return ok(await getSeo(pageKey));
  },
);
