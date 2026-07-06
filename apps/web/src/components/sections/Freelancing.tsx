import type { FreelanceService, SiteSettings } from "@portfolio/types";
import { Section } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function Freelancing({
  settings,
}: {
  services?: FreelanceService[];
  settings: SiteSettings | null;
}) {
  const email = settings?.email ?? null;

  return (
    <Section
      id="freelancing"
      eyebrow="Freelancing"
      index="06 / "
      title="Available for Freelance Projects."
      intro="I specialize in building end-to-end, SEO-rich websites, integrating AI solutions, and developing robust IT projects tailored to your specific needs."
    >
      <RevealGroup className="mt-10">
        <RevealItem>
          <div className="flex flex-col items-start justify-between gap-6 border border-base-700 bg-base-900/40 p-8 md:flex-row md:items-center">
            <div>
              <h3 className="text-xl font-semibold text-ink-100">
                Have a project in mind? Let's collaborate.
              </h3>
              <p className="mt-2 text-sm text-ink-400 max-w-2xl leading-relaxed">
                Whether you need a high-performance web application, an intelligent AI-driven platform, or an SEO-optimized landing page, I can bring your vision to life. Let's discuss your requirements and build something exceptional together.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <a
                href="#contact"
                data-cursor="hover"
                className="inline-flex items-center justify-center border border-accent-500 bg-accent-500 px-8 py-3.5 text-sm font-medium text-base-950 transition-all hover:-translate-y-0.5 hover:shadow-brutal-ink"
              >
                Discuss my project
              </a>
              {email && (
                <a
                  href={`mailto:${email}?subject=Freelance%20Project%20Enquiry`}
                  data-cursor="hover"
                  className="inline-flex items-center justify-center border border-base-600 px-8 py-3.5 text-sm text-ink-200 transition-colors hover:border-ink-300 hover:text-ink-50"
                >
                  {email}
                </a>
              )}
            </div>
          </div>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
