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
  programming: "Programming",
  ai_genai: "AI & GenAI",
  frameworks: "Frameworks",
  data_analytics: "Data & Analytics",
  databases: "Databases",
  cloud_mlops: "Cloud & MLOps",
  ai_apis: "AI APIs & Integrations",
  domain_expertise: "Domain Expertise",
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
      title="Technologies Powering My AI Journey."
    >
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(grouped).map(([cat, list], gi) => (
          <div key={cat}>
            <h3 className="mb-5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">
              <span className="text-accent-500">
                {String(gi + 1).padStart(2, "0")}
              </span>
              <span className="h-px flex-1 bg-base-700/60" />
              <span>{categoryLabels[cat] ?? cat}</span>
            </h3>
            <RevealGroup className="mt-3">
              <RevealItem>
                <div className="flex flex-wrap gap-x-2 gap-y-1.5 text-xs md:text-[13px] leading-relaxed">
                  {list.map((s, i) => (
                    <span key={s.id} className="inline-flex items-center">
                      <span className="text-ink-100 font-medium">{s.name}</span>
                      {i < list.length - 1 && (
                        <span className="ml-2 select-none text-ink-600/70 font-light">•</span>
                      )}
                    </span>
                  ))}
                </div>
              </RevealItem>
            </RevealGroup>
          </div>
        ))}
      </div>
    </Section>
  );
}
