import type { About as AboutType } from "@portfolio/types";
import { Section } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function About({ about }: { about: AboutType | null }) {
  if (!about) return null;
  const paragraphs = about.body.split("\n\n");

  return (
    <Section id="about" eyebrow="About" index="01 / " title={about.heading}>
      <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6 text-lg leading-relaxed text-ink-300">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <p dangerouslySetInnerHTML={{ __html: inlineMd(p) }} />
            </Reveal>
          ))}
        </div>

        {about.stats.length > 0 && (
          <RevealGroup className="grid grid-cols-2 gap-px self-start overflow-hidden border border-base-600 bg-base-600">
            {about.stats.map((s) => (
              <RevealItem
                key={s.label}
                className="group flex flex-col items-center justify-center bg-base-900 px-5 py-4 transition-colors hover:bg-base-850"
              >
                <div className="whitespace-nowrap font-display text-2xl font-medium text-accent-500">
                  {s.value}
                </div>
                <div className="mt-1.5 font-mono text-[9px] uppercase tracking-widest text-ink-500">
                  {s.label}
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        )}
      </div>
    </Section>
  );
}

/** Minimal inline markdown: **bold** only (body is trusted admin content). */
function inlineMd(s: string): string {
  return s.replace(/\*\*(.+?)\*\*/g, "<strong class='text-ink-100'>$1</strong>");
}
