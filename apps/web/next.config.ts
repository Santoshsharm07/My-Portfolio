import { loadEnvConfig } from "@next/env";
import path from "node:path";
import type { NextConfig } from "next";

// Load monorepo root .env
loadEnvConfig(path.resolve(process.cwd(), "../../"));

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
