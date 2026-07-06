import type { Resume } from "@portfolio/types";
import { Reveal } from "@/components/motion/Reveal";

/**
 * CTA band linking to the résumé. `/resume` resolves the active file server-side
 * and redirects to its public URL (falls back to the contact section).
 */
export function ResumeBand({ resume }: { resume: Resume | null }) {
  const href = resume?.file_media_id ? "/resume" : "#contact";

  return (
    <section className="relative py-24">
      <div className="container-lux">
        <Reveal>
          <div className="relative flex flex-col items-start justify-between gap-8 overflow-hidden bg-accent-500 p-10 text-base-950 md:flex-row md:items-center md:p-14">
            {/* faint gridlines over the lime */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] [background-size:40px_40px]" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-base-950/70">
                <span className="h-px w-6 bg-base-950/70" />
                Résumé
              </span>
              <h2 className="mt-4 max-w-xl text-2xl font-medium leading-[1.05] text-base-950 md:text-4xl">
                {resume?.label ?? "Want the full story on paper?"}
              </h2>
            </div>
            <a
              href={href}
              data-cursor="hover"
              className="group relative inline-flex items-center gap-2 rounded-none bg-base-950 px-7 py-4 font-mono text-xs font-medium uppercase tracking-widest text-ink-50 transition-transform hover:-translate-y-0.5"
            >
              Download résumé
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform group-hover:translate-y-0.5"
              >
                <path
                  d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
