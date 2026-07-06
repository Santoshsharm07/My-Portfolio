import type { Skill } from "@portfolio/types";
import { Section } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const categoryLabels: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  design: "Design",
  devops: "DevOps",
  mobile: "Mobile",
  tools: "Tools",
  other: "Other",
};

export function Skills({ skills }: { skills: Skill[] }) {
  if (!skills.length) return null;

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    (acc[s.category] ??= []).push(s);
    return acc;
  }, {});

  return (
    <Section
      id="skills"
      eyebrow="Capabilities"
      index="04 / "
      title="Tools I reach for, and the craft behind them."
    >
      <div className="grid gap-x-14 gap-y-16 md:grid-cols-2">
        {Object.entries(grouped).map(([cat, list], gi) => (
          <div key={cat}>
            <h3 className="mb-7 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-ink-400">
              <span className="text-accent-500">
                {String(gi + 1).padStart(2, "0")}
              </span>
              <span className="h-px flex-1 bg-base-700" />
              {categoryLabels[cat] ?? cat}
            </h3>
            <RevealGroup className="space-y-6">
              {list.map((s) => (
                <RevealItem key={s.id}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-ink-100">{s.name}</span>
                    <span className="font-mono text-xs text-ink-500">
                      {s.proficiency}
                      <span className="text-ink-600">%</span>
                    </span>
                  </div>
                  <div className="mt-2.5 h-1.5 w-full bg-base-800">
                    <div
                      className="h-1.5 bg-accent-500"
                      style={{ width: `${s.proficiency}%` }}
                    />
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>
        ))}
      </div>
    </Section>
  );
}
