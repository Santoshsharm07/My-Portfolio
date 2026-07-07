import "server-only";
import { config } from "dotenv";
import { resolve } from "node:path";

/**
 * Load environment variables for the Next.js server runtime.
 *
 * Locally we keep a single source of truth in the monorepo root `.env`.
 * Next.js does not auto-load env files outside its own app directory, so we
 * load the root `.env` here. `dotenv` never overrides variables that are
 * already set, so on Vercel (where vars come from the dashboard and the file
 * is absent) these calls are harmless no-ops.
 */
const cwd = process.cwd();
config({ path: resolve(cwd, ".env.local") });
config({ path: resolve(cwd, ".env") });
config({ path: resolve(cwd, "../../.env") }); // monorepo root

function req(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(
      `Missing required env var: ${name}. Set it in the root .env (local) or the Vercel dashboard (production).`,
    );
  }
  return v;
}

export const serverEnv = {
  supabaseUrl: req("SUPABASE_URL"),
  supabaseServiceKey: req("SUPABASE_SERVICE_ROLE_KEY"),
  storageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? "media",

  adminUsername: req("ADMIN_USERNAME"),
  adminPasswordHash: req("ADMIN_PASSWORD_HASH"),
  jwtSecret: req("JWT_SECRET"),

  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  isProd: process.env.NODE_ENV === "production",
};
