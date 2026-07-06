import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

// Geometric grotesk for oversized, brutalist display headlines.
export const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Clean grotesk body.
export const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Monospace — used heavily for labels, indices, and metadata.
export const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});
