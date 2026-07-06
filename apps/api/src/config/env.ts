import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
// monorepo root .env
config({ path: resolve(here, "../../../../.env") });

function req(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.API_PORT ?? 4000),
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:3000",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  supabaseUrl: req("SUPABASE_URL"),
  supabaseServiceKey: req("SUPABASE_SERVICE_ROLE_KEY"),
  storageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? "media",

  adminUsername: req("ADMIN_USERNAME"),
  adminPasswordHash: req("ADMIN_PASSWORD_HASH"),
  jwtSecret: req("JWT_SECRET"),
  revalidateSecret: process.env.REVALIDATE_SECRET ?? "",

  get isProd() {
    return this.nodeEnv === "production";
  },

  /**
   * Demo mode: no real Supabase configured (placeholder creds). Public read
   * endpoints serve built-in demo content so the site renders fully populated
   * with zero external setup.
   */
  get isDemo() {
    const url = process.env.SUPABASE_URL ?? "";
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
    return (
      !url ||
      url.includes("placeholder") ||
      key.includes("placeholder") ||
      url.includes("your-project")
    );
  },
};
