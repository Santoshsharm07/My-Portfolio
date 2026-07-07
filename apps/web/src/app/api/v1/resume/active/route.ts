import { handle, ok } from "@/server/http";
import { getActiveResume } from "@/server/content";

export const runtime = "nodejs";

export const GET = handle(async () => ok(await getActiveResume()));
