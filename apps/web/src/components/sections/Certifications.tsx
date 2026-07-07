import Link from "next/link";
import type { Certification } from "@portfolio/types";
import { Section } from "@/components/ui/Section";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function Certifications({ items }: { items: Certification[] }) {
  if (!items.length) return null;
  return (
    <Section
      id="certifications"
      eyebrow="Recognition"
      index="05 / "
      title="Certifications & accolades."
    >
      <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((c, i) => {
          const card =
            "card-lux group flex h-full flex-col justify-between p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent-500 hover:shadow-brutal-sm";
          return (
            <RevealItem key={c.id}>
              {c.credential_url ? (
                <Link
                  href={c.credential_url}
                  target="_blank"
                  rel="noreferrer"
                  data-cursor="hover"
                  className={card}
                >
                  <CertificationContent c={c} index={i} />
                </Link>
              ) : (
                <div className={card}>
                  <CertificationContent c={c} index={i} />
                </div>
              )}
            </RevealItem>
          );
        })}
      </RevealGroup>
    </Section>
  );
}

function CertificationContent({
  c,
  index,
}: {
  c: Certification;
  index: number;
}) {
  return (
    <>
      <div>
        <span className="font-mono text-xs text-ink-600">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="mt-3 text-lg text-ink-50">{c.title}</h3>
        <p className="mt-1 text-sm text-ink-400">{c.issuer}</p>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-base-700 pt-4 font-mono text-xs text-ink-500">
        <span>{c.issue_date ?? ""}</span>
        {c.credential_url && (
          <span className="text-accent-500 transition-transform group-hover:translate-x-1">
            View →
          </span>
        )}
      </div>
    </>
  );
}
