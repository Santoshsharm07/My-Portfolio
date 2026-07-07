import { handle, ok } from "@/server/http";
import { getPublicProject } from "@/server/content";

export const runtime = "nodejs";

export const GET = handle(
  async (_req: Request, ctx: { params: Promise<{ slug: string }> }) => {
    const { slug } = await ctx.params;
    return ok(await getPublicProject(slug));
  },
);
