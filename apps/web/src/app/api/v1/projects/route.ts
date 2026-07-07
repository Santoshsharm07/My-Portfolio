import { handle, ok } from "@/server/http";
import { getPublicProjects } from "@/server/content";

export const runtime = "nodejs";

export const GET = handle(async () => ok(await getPublicProjects()));
