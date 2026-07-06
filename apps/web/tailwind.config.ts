import type { Config } from "tailwindcss";
import preset from "@portfolio/config/tailwind-preset";

const config: Config = {
  presets: [preset as Config],
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "../../packages/ui-tokens/src/**/*.{ts,tsx}",
  ],
};

export default config;
