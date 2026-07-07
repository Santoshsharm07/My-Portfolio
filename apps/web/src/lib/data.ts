import { unstable_cache } from "next/cache";
import {
  getHomeContent as readHomeContent,
  getPublicProjects,
  getPublicProject,
  getSeo as readSeo,
} from "@/server/content";
import type {
  SiteSettings,
  Hero,
  About,
  Experience,
  Project,
  Skill,
  Certification,
  Testimonial,
  FreelanceService,
  Resume,
  CaseStudy,
  SeoMeta,
} from "@portfolio/types";

export interface HomeContent {
  settings: SiteSettings | null;
  hero: Hero | null;
  about: About | null;
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
  testimonials: Testimonial[];
  freelance: FreelanceService[];
  resume: Resume | null;
}

/**
 * Public reads talk to Supabase directly from the server and are wrapped in
 * `unstable_cache` for ISR + tag-based revalidation. Reading the DB directly
 * (instead of the app fetching its own HTTP route) means static generation
 * works at build time with no running server — the previous self-fetch is what
 * caused Vercel build timeouts.
 */
const isDev = process.env.NODE_ENV === "development";

export const getHomeContent = isDev
  ? async (): Promise<HomeContent> => (await readHomeContent()) as HomeContent
  : unstable_cache(
      async (): Promise<HomeContent> => (await readHomeContent()) as HomeContent,
      ["home-content"],
      {
        tags: [
          "home",
          "projects",
          "skills",
          "experience",
          "testimonials",
          "freelance",
        ],
        revalidate: 60,
      },
    );

export const getProjects = isDev
  ? async (): Promise<Project[]> => (await getPublicProjects()) as Project[]
  : unstable_cache(
      async (): Promise<Project[]> => (await getPublicProjects()) as Project[],
      ["projects-list"],
      { tags: ["projects"], revalidate: 60 },
    );

export function getProject(
  slug: string,
): Promise<{ project: Project; caseStudy: CaseStudy | null }> {
  const fetchFn = () =>
    getPublicProject(slug) as Promise<{
      project: Project;
      caseStudy: CaseStudy | null;
    }>;

  if (isDev) return fetchFn();

  return unstable_cache(
    fetchFn,
    ["project", slug],
    { tags: ["projects", `project:${slug}`], revalidate: 60 },
  )();
}

export function getSeo(pageKey: string): Promise<SeoMeta | null> {
  const fetchFn = () => readSeo(pageKey) as Promise<SeoMeta | null>;

  if (isDev) return fetchFn().catch(() => null);

  return unstable_cache(
    fetchFn,
    ["seo", pageKey],
    { tags: ["seo"], revalidate: 60 },
  )().catch(() => null);
}
