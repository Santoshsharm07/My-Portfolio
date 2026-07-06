"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const links = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export function Nav({ brand }: { brand: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-base-700/50 bg-base-950/70 backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="container-lux flex h-16 items-center justify-between md:h-20">
        <Link
          href="#top"
          data-cursor="hover"
          className="flex items-center gap-2.5 font-display text-lg font-medium tracking-tight text-ink-50"
        >
          <span className="h-2.5 w-2.5 bg-accent-500" />
          {brand}
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l, i) => (
            <li key={l.href}>
              <Link
                href={l.href}
                data-cursor="hover"
                className="group flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-ink-400 transition-colors hover:text-ink-50"
              >
                <span className="text-accent-500/50 transition-colors group-hover:text-accent-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setOpen((v) => !v)}
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={cn(
              "h-px w-6 bg-ink-100 transition-transform",
              open && "translate-y-[3px] rotate-45",
            )}
          />
          <span
            className={cn(
              "h-px w-6 bg-ink-100 transition-transform",
              open && "-translate-y-[3px] -rotate-45",
            )}
          />
        </button>
      </nav>

      {open && (
        <div className="border-t border-base-700/50 bg-base-950/95 backdrop-blur-xl md:hidden">
          <ul className="container-lux flex flex-col py-6">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-lg text-ink-200"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
