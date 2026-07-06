"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@portfolio/types";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

const ease = [0.16, 1, 0.3, 1] as const;

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={index * 0.04}>
      <Link
        href={`/projects/${project.slug}`}
        data-cursor="hover"
        className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-6 border-t border-base-700/50 py-8 transition-colors md:py-10"
      >
        <span className="font-mono text-xs text-ink-600">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0">
          <h3 className="truncate text-2xl font-light text-ink-100 transition-transform duration-500 group-hover:translate-x-2 group-hover:text-accent-300 md:text-3xl">
            {project.title}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-500">
            {project.role && <span>{project.role}</span>}
            {project.year && (
              <>
                <span className="text-ink-700">·</span>
                <span>{project.year}</span>
              </>
            )}
            {project.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full border border-base-700 px-2.5 py-0.5 text-xs text-ink-400"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <motion.span
          className="hidden text-accent-500 md:inline"
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1 }}
          transition={{ ease }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="1.4"
              className="transition-transform duration-500 group-hover:translate-x-1"
            />
          </svg>
        </motion.span>

        {/* hover glow */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-accent-500 to-transparent transition-transform duration-500 group-hover:scale-x-100" />
      </Link>
    </Reveal>
  );
}

export function Projects({ projects }: { projects: Project[] }) {
  if (!projects.length) return null;
  return (
    <Section
      id="projects"
      eyebrow="Selected Work"
      index="03 / "
      title="Projects built to be felt, not just seen."
      intro="A selection of recent work spanning brand systems, product launches, and experimental interfaces."
    >
      <div>
        {projects.map((p, i) => (
          <ProjectRow key={p.id} project={p} index={i} />
        ))}
        <div className="border-t border-base-700/50" />
      </div>
    </Section>
  );
}
