import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  intro?: string;
  children: ReactNode;
  className?: string;
  index?: string;
}

/** Standard section shell with an editorial header. */
export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
  index,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-24 pt-8 pb-16 md:py-36", className)}
    >
      <div className="container-lux">
        {(eyebrow || title) && (
          <header className="mb-8 border-t border-base-600 pt-6 md:mb-14">
            {eyebrow && (
              <Reveal>
                <div className="flex items-center justify-between gap-4">
                  <span className="eyebrow">
                    <span className="h-px w-6 bg-accent-500" />
                    {eyebrow}
                  </span>
                  {index && (
                    <span className="font-mono text-xs tracking-widest text-ink-600">
                      {index}
                    </span>
                  )}
                </div>
              </Reveal>
            )}
            {title && (
              <Reveal delay={0.05}>
                <h2 className="mt-6 max-w-4xl text-3xl font-medium leading-[1.02] tracking-tight text-ink-50 md:text-4xl">
                  {title}
                </h2>
              </Reveal>
            )}
            {intro && (
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-prose text-ink-400 md:text-lg">
                  {intro}
                </p>
              </Reveal>
            )}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
