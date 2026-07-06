"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Hero as HeroType, SiteSettings } from "@portfolio/types";
import { SplitText } from "@/components/motion/SplitText";
import { MagneticButton } from "@/components/motion/MagneticButton";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene").then((m) => m.HeroScene),
  { ssr: false },
);

const ease = [0.16, 1, 0.3, 1] as const;

function RotatingRoles({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (roles.length < 2) return;
    const id = setInterval(() => setI((v) => (v + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, [roles.length]);
  if (!roles.length) return null;
  return (
    <span className="relative inline-block h-[1.2em] overflow-hidden align-bottom">
      <motion.span
        key={i}
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "-100%", opacity: 0 }}
        transition={{ duration: 0.6, ease }}
        className="inline-block text-accent-500"
      >
        {roles[i]}
      </motion.span>
    </span>
  );
}

export function Hero({
  hero,
  settings,
}: {
  hero: HeroType | null;
  settings: SiteSettings | null;
}) {
  const headline = hero?.headline ?? "I build worlds that respond to you.";
  const roles = hero?.roles ?? [];

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16"
    >
      <HeroScene />

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(8,8,10,0.85)_100%)]" />

      <div className="container-lux relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
          className="eyebrow mb-6"
        >
          <span className="h-px w-8 bg-accent-500" />
          {settings?.availability ?? "Available for select projects"}
        </motion.p>

        <SplitText
          as="h1"
          text={headline}
          className="max-w-5xl text-4xl font-bold leading-[0.95] text-ink-50 md:text-5xl"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.5 }}
          className="mt-8 max-w-xl text-lg text-ink-400"
        >
          {hero?.subheadline}
        </motion.p>

        {roles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-4 font-mono text-sm uppercase tracking-[0.2em] text-ink-500"
          >
            <RotatingRoles roles={roles} />
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.85 }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <MagneticButton
            as="a"
            href={hero?.cta_href ?? "#projects"}
            className="bg-accent-500 text-base-950 hover:bg-accent-400"
          >
            {hero?.cta_label ?? "View work"}
          </MagneticButton>
          {hero?.secondary_cta_label && (
            <MagneticButton
              as="a"
              href={hero.secondary_cta_href ?? "#about"}
              className="border border-base-600 text-ink-100 hover:border-accent-500/70"
            >
              {hero.secondary_cta_label}
            </MagneticButton>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute inset-x-0 bottom-8 flex justify-center"
      >
        <span className="flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-500">
          Scroll
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-accent-500 to-transparent" />
        </span>
      </motion.div>
    </section>
  );
}
