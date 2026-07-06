import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProject, getProjects } from "@/lib/data";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const projects = await getProjects();
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { project } = await getProject(slug);
    return { title: project.title, description: project.summary };
  } catch {
    return { title: "Project" };
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getProject(slug).catch(() => null);
  if (!data) notFound();
  const { project, caseStudy } = data;

  const blocks: { label: string; value: string }[] = [
    // Show the "short about" as its own block when a case study also exists.
    project.about && caseStudy?.overview
      ? { label: "About this project", value: project.about }
      : null,
    caseStudy?.problem ? { label: "Problem", value: caseStudy.problem } : null,
    caseStudy?.solution
      ? { label: "Solution", value: caseStudy.solution }
      : null,
    caseStudy?.results ? { label: "Results", value: caseStudy.results } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <article className="pb-32 pt-32">
      <div className="container-lux">
        <Link
          href="/#projects"
          data-cursor="hover"
          className="inline-flex items-center gap-2 text-sm text-ink-500 transition-colors hover:text-accent-400"
        >
          ← Back to work
        </Link>

        <header className="mt-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="border border-accent-500 bg-accent-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-300">
              {project.kind === "work" ? "Real Work" : "Personal Project"}
            </span>
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-none border border-base-700 px-3 py-1 text-xs text-ink-400"
              >
                {t}
              </span>
            ))}
          </div>
          <SplitText
            as="h1"
            text={project.title}
            className="mt-6 text-4xl font-bold leading-[0.98] text-ink-50 md:text-5xl"
          />
          <p className="mt-6 max-w-2xl text-lg text-ink-400">
            {caseStudy?.overview || project.about || project.summary}
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-base-700/50 pt-8 md:grid-cols-4">
            <Meta label="Role" value={project.role || "—"} />
            <Meta label="Year" value={project.year?.toString() || "—"} />
            {project.live_url && (
              <Meta label="Live" value="Visit ↗" href={project.live_url} />
            )}
            {project.repo_url && (
              <Meta label="Code" value="GitHub ↗" href={project.repo_url} />
            )}
          </dl>
        </header>

        {/* hero visual — exposed-grid slab with an outline title */}
        <Reveal>
          <div className="grid-lines mt-16 flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-none border border-base-600 bg-base-850 px-6">
            <span className="text-outline-accent text-center font-display text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-8xl">
              {project.title}
            </span>
          </div>
        </Reveal>

        {blocks.length > 0 && (
          <div className="mx-auto mt-24 max-w-prose space-y-16">
            {blocks.map((b) => (
              <Reveal key={b.label}>
                <section>
                  <span className="eyebrow">{b.label}</span>
                  <p className="mt-4 text-lg leading-relaxed text-ink-300">
                    {b.value}
                  </p>
                </section>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-28 text-center">
          <Link
            href="/#contact"
            data-cursor="hover"
            className="inline-flex rounded-none bg-accent-500 px-8 py-3.5 text-sm font-medium text-base-950 transition-all hover:-translate-y-0.5 hover:shadow-brutal-ink"
          >
            Start a project like this
          </Link>
        </div>
      </div>
    </article>
  );
}

function Meta({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-widest text-ink-500">
        {label}
      </dt>
      <dd className="mt-2 text-ink-100">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="text-accent-400 hover:underline"
          >
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
