import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { REVALIDATE_SECRET } from "@/lib/env";

/**
 * Called by the Express API after an admin write to refresh cached content.
 * Body: { tags: string[] }. Auth via x-revalidate-secret header.
 */
export async function POST(req: Request) {
  const secret = req.headers.get("x-revalidate-secret");
  if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { tags } = (await req.json().catch(() => ({}))) as { tags?: string[] };
  const list = Array.isArray(tags) ? tags : [];
  for (const tag of list) revalidateTag(tag);

  return NextResponse.json({ revalidated: true, tags: list });
}
