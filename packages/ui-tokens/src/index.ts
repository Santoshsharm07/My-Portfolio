/**
 * Design tokens — single source of truth for the Acid Brutalist system.
 * Consumed by the Tailwind preset and available at runtime for JS/canvas/3D.
 */

export const colors = {
  // Base — raw near-black, neutral charcoals (Acid Brutalist)
  base: {
    950: "#050505",
    900: "#0A0A0A",
    850: "#0F0F0F",
    800: "#141414",
    700: "#1F1F1F",
    600: "#2C2C2C",
    500: "#3D3D3D",
  },
  // Cold white → grey text ramp
  ink: {
    50: "#FFFFFF",
    100: "#F2F2F2",
    200: "#D8D8D8",
    400: "#9A9A9A",
    500: "#7C7C7C",
    600: "#565656",
  },
  // Acid-lime accent — loud, confident
  accent: {
    50: "#F6FFDD",
    100: "#ECFFB8",
    300: "#E8FF8A",
    400: "#DCFA6E",
    500: "#CDF25A", // primary accent
    600: "#A8CE33",
    700: "#7E9C1E",
  },
  // Secondary electric-lime glow (used sparingly for depth)
  glow: {
    400: "#B4FF3D",
    500: "#8FE01F",
  },
  success: "#7CE96B",
  danger: "#FF5C5C",
  warning: "#F5C542",
} as const;

export const fonts = {
  display: "var(--font-display)", // geometric grotesk for oversized headlines
  sans: "var(--font-sans)", // clean grotesk body
  mono: "var(--font-mono)",
} as const;

/** Fluid type scale using clamp() — editorial, oversized headings. */
export const fontSize = {
  xs: ["0.78rem", { lineHeight: "1.5" }],
  sm: ["0.9rem", { lineHeight: "1.55" }],
  base: ["clamp(1rem, 0.96rem + 0.2vw, 1.075rem)", { lineHeight: "1.65" }],
  lg: ["clamp(1.15rem, 1.05rem + 0.5vw, 1.35rem)", { lineHeight: "1.55" }],
  xl: ["clamp(1.4rem, 1.2rem + 1vw, 1.85rem)", { lineHeight: "1.35" }],
  "2xl": ["clamp(1.9rem, 1.4rem + 2.4vw, 2.9rem)", { lineHeight: "1.15" }],
  "3xl": ["clamp(2.6rem, 1.8rem + 4vw, 4.4rem)", { lineHeight: "1.05" }],
  "4xl": ["clamp(3.4rem, 2rem + 7vw, 7rem)", { lineHeight: "0.98" }],
  "5xl": ["clamp(4.2rem, 2rem + 11vw, 10rem)", { lineHeight: "0.92" }],
} as const;

export const radius = {
  sm: "0.375rem",
  md: "0.625rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  full: "9999px",
} as const;

/** Motion tokens — cinematic easing curves and durations. */
export const motion = {
  ease: {
    // signature "antigravity" ease — heavy, expensive glide
    lux: [0.16, 1, 0.3, 1] as [number, number, number, number],
    out: [0.22, 1, 0.36, 1] as [number, number, number, number],
    inOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  },
  duration: {
    fast: 0.35,
    base: 0.6,
    slow: 0.9,
    cinematic: 1.4,
  },
} as const;

export const shadows = {
  glow: "0 0 60px -12px rgba(205,242,90,0.45)",
  card: "0 20px 60px -20px rgba(0,0,0,0.9)",
  ring: "0 0 0 1px rgba(255,255,255,0.06)",
  // Hard-offset brutalist shadows (no blur)
  brutal: "6px 6px 0 0 #CDF25A",
  "brutal-sm": "4px 4px 0 0 #CDF25A",
  "brutal-ink": "6px 6px 0 0 #FFFFFF",
} as const;

export type Colors = typeof colors;
