"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@portfolio/types";
import { Section } from "@/components/ui/Section";

const ease = [0.16, 1, 0.3, 1] as const;

type Tab = "work" | "personal";

const TABS: { id: Tab; label: string }[] = [
  { id: "work", label: "Real Work Projects" },
  { id: "personal", label: "Personal Projects" },
];

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17L17 7M17 7H8M17 7v9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.05.78 2.12v3.15c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.5, ease, delay: index * 0.05 }}
      className="group flex flex-col justify-between border border-base-700 bg-base-900/40 p-6 transition-colors hover:border-accent-500 hover:shadow-brutal md:p-7"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <span className="font-mono text-xs text-ink-600">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            {project.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-none border border-base-700 px-2 py-0.5 text-[10px] uppercase tracking-wider text-ink-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <h3 className="mt-4 text-xl font-semibold leading-tight text-ink-100 transition-colors group-hover:text-accent-300">
          {project.title}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500">
          {project.role && <span>{project.role}</span>}
          {project.role && project.year && <span className="text-ink-700">·</span>}
          {project.year && <span>{project.year}</span>}
        </div>

        <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-ink-400">
          {project.summary}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-base-700/60 pt-5">
        <Link
          href={`/projects/${project.slug}`}
          data-cursor="hover"
          className="inline-flex items-center gap-1.5 border border-accent-500 bg-accent-500/10 px-3 py-1.5 text-xs font-medium text-accent-300 transition-colors hover:bg-accent-500 hover:text-base-950"
        >
          About project →
        </Link>

        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="inline-flex items-center gap-1.5 border border-base-700 px-3 py-1.5 text-xs text-ink-300 transition-colors hover:border-ink-300 hover:text-ink-50"
          >
            Live <ExternalIcon />
          </a>
        )}

        {project.repo_url && (
          <a
            href={project.repo_url}
            target="_blank"
            rel="noreferrer"
            data-cursor="hover"
            className="inline-flex items-center gap-1.5 border border-base-700 px-3 py-1.5 text-xs text-ink-300 transition-colors hover:border-ink-300 hover:text-ink-50"
          >
            <GithubIcon /> Code
          </a>
        )}
      </div>
    </motion.article>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  const [tab, setTab] = useState<Tab>("work");

  const groups = useMemo(
    () => ({
      work: projects.filter((p) => p.kind === "work"),
      personal: projects.filter((p) => p.kind === "personal"),
    }),
    [projects],
  );

  if (!projects.length) return null;

  // Default to whichever tab actually has content.
  const activeTab: Tab =
    groups[tab].length > 0
      ? tab
      : groups.work.length > 0
        ? "work"
        : "personal";
  const visible = groups[activeTab];

  return (
    <Section
      id="projects"
      eyebrow="Selected Work"
      index="03 / "
      title="From Ideas to Intelligent Products."
      intro="Real client work and personal experiments — switch between them below."
    >
      {/* Tabs */}
      <div className="mb-10 inline-flex flex-wrap gap-2 border border-base-700 p-1.5">
        {TABS.map((t) => {
          const count = groups[t.id].length;
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              data-cursor="hover"
              className={`relative rounded-none px-4 py-2 text-sm font-medium transition-colors ${
                active
                  ? "text-base-950"
                  : "text-ink-400 hover:text-ink-100"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="project-tab"
                  className="absolute inset-0 bg-accent-500"
                  transition={{ duration: 0.35, ease }}
                />
              )}
              <span className="relative z-10">
                {t.label}
                <span className={active ? "text-base-950/70" : "text-ink-600"}>
                  {" "}
                  ({count})
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          layout
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visible.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {visible.length === 0 && (
        <p className="border border-dashed border-base-700 px-6 py-16 text-center text-sm text-ink-500">
          Nothing here yet.
        </p>
      )}
    </Section>
  );
}
