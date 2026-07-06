import type { Config } from "tailwindcss";
import {
  colors,
  fonts,
  fontSize,
  radius,
  shadows,
} from "@portfolio/ui-tokens";

/**
 * Shared Tailwind preset so the public site and admin CMS share one visual
 * language. Apps extend this in their own tailwind.config.ts with `content`.
 */
const preset: Partial<Config> = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: colors.base,
        ink: colors.ink,
        accent: colors.accent,
        glow: colors.glow,
        success: colors.success,
        danger: colors.danger,
        warning: colors.warning,
      },
      fontFamily: {
        display: [fonts.display, "system-ui", "sans-serif"],
        sans: [fonts.sans, "system-ui", "sans-serif"],
        mono: [fonts.mono, "ui-monospace", "monospace"],
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fontSize: fontSize as any,
      borderRadius: radius,
      boxShadow: shadows,
      maxWidth: {
        content: "80rem",
        prose: "44rem",
      },
      transitionTimingFunction: {
        lux: "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-expo": "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both",
        marquee: "marquee 28s linear infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
    },
  },
};

export default preset;
