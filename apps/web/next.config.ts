import type { NextConfig } from "next";
import { config as loadEnv } from "dotenv";
import { resolve } from "node:path";

// Load the monorepo root .env so server routes and NEXT_PUBLIC_* vars resolve
// during local dev and build. No-op on Vercel (vars come from the dashboard and
// the file is absent); dotenv never overrides already-set variables.
loadEnv({ path: resolve(process.cwd(), "../../.env") });
loadEnv({ path: resolve(process.cwd(), ".env") });

const supabaseHost = (() => {
  try {
    return process.env.SUPABASE_URL
      ? new URL(process.env.SUPABASE_URL).hostname
      : undefined;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@portfolio/ui-tokens", "@portfolio/types"],
  // The workspace packages use NodeNext-style ".js" import specifiers that point
  // at ".ts" source. Teach webpack to resolve those to the TypeScript files so
  // runtime imports (e.g. Zod schemas from @portfolio/types) resolve correctly.
  webpack: (config) => {
    config.resolve.extensionAlias = {
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return config;
  },
  images: {
    remotePatterns: [
      ...(supabaseHost
        ? [{ protocol: "https" as const, hostname: supabaseHost }]
        : []),
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
