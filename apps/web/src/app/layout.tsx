import type { Metadata } from "next";
import "@/styles/globals.css";
import { display, sans, mono } from "@/lib/fonts";
import { SITE_URL } from "@/lib/env";
import { getSeo } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeo("home").catch(() => null);
  const title = seo?.title ?? "Portfolio — Design Engineer";
  const description =
    seo?.description ??
    "A world-class portfolio crafted with React, Three.js, and motion.";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: "%s — Portfolio" },
    description,
    keywords: seo?.keywords,
    openGraph: {
      title,
      description,
      url: SITE_URL,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="grain">{children}</body>
    </html>
  );
}
