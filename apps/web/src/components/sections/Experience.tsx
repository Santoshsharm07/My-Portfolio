import type { Experience as ExperienceType } from "@portfolio/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { formatDateRange } from "@/lib/utils";

export function Experience({ items }: { items: ExperienceType[] }) {
  if (!items.length) return null;
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      index="02 / "
      title="Engineering Intelligence Through AI & Software."
    >
      <div className="relative">
        {/* timeline spine */}
        <div className="absolute left-0 top-0 hidden h-full w-px bg-base-700 md:block" />

        <ul>
          {items.map((job, i) => (
            <Reveal key={job.id} delay={i * 0.05}>
              <li className="group relative grid gap-4 border-t border-base-700 py-8 md:grid-cols-[220px_1fr] md:gap-10 md:pl-10">
                {/* node on the spine */}
                <span className="absolute left-[-3px] top-9 hidden h-1.5 w-1.5 bg-base-500 transition-colors group-hover:bg-accent-500 md:block" />
                <div>
                  <div className="font-mono text-xs uppercase tracking-widest text-ink-500">
                    {formatDateRange(job.start_date, job.end_date)}
                  </div>
                  {job.is_current && (
                    <span className="mt-3 inline-flex items-center gap-2 bg-accent-500 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-base-950">
                      <span className="h-1.5 w-1.5 animate-pulse bg-base-950" />
                      Current
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl text-ink-50 transition-colors group-hover:text-accent-300">
                    {job.role}
                    <span className="text-ink-500"> · {job.company}</span>
                  </h3>
                  {job.location && (
                    <div className="mt-1 text-sm text-ink-500">{job.location}</div>
                  )}
                  <p className="mt-3 max-w-prose text-ink-400">
                    {job.description}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
