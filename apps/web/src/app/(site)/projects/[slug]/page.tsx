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
          <div className="flex flex-wrap gap-2">
            {project.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-base-700 px-3 py-1 text-xs text-ink-400"
              >
                {t}
              </span>
            ))}
          </div>
          <SplitText
            as="h1"
            text={project.title}
            className="mt-6 text-4xl font-light leading-[0.98] text-ink-50 md:text-5xl"
          />
          <p className="mt-6 max-w-2xl text-lg text-ink-400">
            {caseStudy?.overview || project.summary}
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

        {/* hero visual placeholder */}
        <Reveal>
          <div className="mt-16 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-base-700/50 bg-gradient-to-br from-base-800 via-base-850 to-base-900">
            <div className="flex h-full items-center justify-center">
              <div className="h-40 w-40 rounded-full bg-gradient-to-br from-accent-500/30 to-glow-500/20 blur-2xl" />
            </div>
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
            className="inline-flex rounded-full bg-accent-500 px-8 py-3.5 text-sm font-medium text-base-950 transition-colors hover:bg-accent-400"
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
