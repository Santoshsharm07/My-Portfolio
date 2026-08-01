"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Hero as HeroType, SiteSettings } from "@portfolio/types";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

const AvatarHero = dynamic(
  () => import("@/components/three/AvatarHero").then((m) => m.AvatarHero),
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
  const headline = "Building Intelligent Systems That Think, Learn & Scale.";
  const subheadline = hero?.subheadline ?? "Architecting high-performance machine learning models, autonomous agents, and production-ready distributed systems.";
  const roles = hero?.roles ?? [];

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const rolesRef = useRef<HTMLDivElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // 1. Entry Animation Timeline
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Initial states to prevent flash of unstyled content
    gsap.set([eyebrowRef.current, titleRef.current, subtitleRef.current, rolesRef.current, ctasRef.current, scrollIndicatorRef.current], {
      opacity: 0,
      y: 30,
    });
    
    if (canvasContainerRef.current) {
      gsap.set(canvasContainerRef.current, { opacity: 0, scale: 0.85 });
      tl.to(canvasContainerRef.current, {
        opacity: 1,
        scale: 1,
        duration: 1.8,
        ease: "power3.out",
      }, 0.1);
    }

    tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 1.0 }, 0.4)
      .to(titleRef.current, { opacity: 1, y: 0, duration: 1.2 }, 0.55)
      .to(subtitleRef.current, { opacity: 1, y: 0, duration: 1.0 }, 0.7)
      .to(rolesRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.8)
      .to(ctasRef.current, { opacity: 1, y: 0, duration: 1.0 }, 0.9)
      .to(scrollIndicatorRef.current, { opacity: 1, y: 0, duration: 1.0 }, 1.15);

    // 2. Scroll-Triggered Parallax and Scale Down (Apple/Tesla Landing Page Feel)
    if (containerRef.current) {
      // Scrubbed tweens use explicit from-values + immediateRender: false so
      // scrolling back to the top always restores full visibility (a plain
      // gsap.to captures its start value mid-entry-animation, leaving the
      // canvas stuck faded after a scroll down/up round trip).

      // 3D Canvas Scroll Fade (opacity only: scaling/shifting the canvas made
      // the avatar look displaced and cut off when re-entering from below)
      if (canvasContainerRef.current) {
        gsap.fromTo(
          canvasContainerRef.current,
          { opacity: 1 },
          {
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
            opacity: 0.05,
            ease: "none",
            immediateRender: false,
          },
        );
      }

      // Text Fade-out Scroll Parallax
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          { opacity: 1, yPercent: 0 },
          {
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "50% top",
              scrub: true,
            },
            opacity: 0.1,
            yPercent: -8,
            ease: "none",
            immediateRender: false,
          },
        );
      }

      // Scroll Indicator Fade-out
      if (scrollIndicatorRef.current) {
        gsap.fromTo(
          scrollIndicatorRef.current,
          { opacity: 1 },
          {
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top top",
              end: "20% top",
              scrub: true,
            },
            opacity: 0,
            ease: "none",
            immediateRender: false,
          },
        );
      }
    }
  }, []);

  return (
    <section
      ref={containerRef}
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-16 bg-[#08080a]"
    >
      {/* Interactive 3D Model background centerpiece (clickable avatar) */}
      <div ref={canvasContainerRef} className="absolute inset-0 z-0 w-full h-full">
        <AvatarHero />
      </div>

      {/* Dark Cyberpunk Vignette & Gradient Overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(8,8,10,0.92)_100%)] bg-gradient-to-t from-[#08080a] via-transparent to-transparent" />

      <div ref={contentRef} className="container-lux relative z-20 w-full">
        <div className="max-w-4xl">
          {/* Eyebrow status */}
          <p
            ref={eyebrowRef}
            className="eyebrow mb-6 flex items-center gap-3 text-accent-500 font-mono text-sm tracking-wider uppercase"
          >
            <span className="h-px w-8 bg-accent-500/50" />
            {settings?.availability ?? "AI Architect \u2022 Systems Engineer \u2022 Open for Contracts"}
          </p>

          {/* Premium Headline */}
          <h1
            ref={titleRef}
            className="max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-50 sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {headline}
          </h1>

          {/* Subheadline */}
          <p
            ref={subtitleRef}
            className="mt-8 max-w-xl text-lg md:text-xl text-ink-300 font-normal leading-relaxed"
          >
            {subheadline}
          </p>

          {/* Rotating Roles */}
          {roles.length > 0 && (
            <div
              ref={rolesRef}
              className="mt-4 font-mono text-sm uppercase tracking-[0.2em] text-ink-500"
            >
              <RotatingRoles roles={roles} />
            </div>
          )}

          {/* CTA Buttons */}
          <div
            ref={ctasRef}
            className="mt-12 flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              as="a"
              href={hero?.cta_href ?? "#projects"}
              className="bg-accent-500 text-base-950 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:bg-accent-400 hover:scale-105"
            >
              {hero?.cta_label ?? "Explore Systems"}
            </MagneticButton>
            {hero?.secondary_cta_label && (
              <MagneticButton
                as="a"
                href={hero.secondary_cta_href ?? "#about"}
                className="border border-base-600/80 text-ink-100 font-semibold px-8 py-4 rounded-full hover:border-accent-500/70 hover:bg-accent-500/5 transition-all duration-300"
              >
                {hero.secondary_cta_label}
              </MagneticButton>
            )}
          </div>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute inset-x-0 bottom-8 flex justify-center z-20 pointer-events-none"
      >
        <span className="flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-500">
          Scroll Down
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-accent-500 to-transparent" />
        </span>
      </div>
    </section>
  );
}
