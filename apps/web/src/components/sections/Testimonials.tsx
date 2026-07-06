import type { Testimonial } from "@portfolio/types";
import { Section } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-1 text-accent-500">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  return (
    <Section
      id="testimonials"
      eyebrow="Kind Words"
      index="06 / "
      title="What collaborators say."
    >
      <RevealGroup className="grid gap-6 md:grid-cols-2">
        {items.map((t) => (
          <RevealItem key={t.id}>
            <figure className="card-lux flex h-full flex-col justify-between p-8 transition-colors hover:border-base-500">
              <div>
                <div className="flex items-center justify-between">
                  <Stars n={t.rating} />
                  <span className="font-display text-5xl leading-none text-base-600">
                    ”
                  </span>
                </div>
                <blockquote className="mt-5 text-lg leading-relaxed text-ink-200">
                  {t.quote}
                </blockquote>
              </div>
              <figcaption className="mt-8 flex items-center gap-3 border-t border-base-700 pt-6">
                <div className="flex h-11 w-11 items-center justify-center border border-accent-500 bg-accent-500/10 font-display text-sm font-medium text-accent-500">
                  {t.author_name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm text-ink-50">{t.author_name}</div>
                  <div className="text-xs text-ink-500">
                    {[t.author_role, t.author_company]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                </div>
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
