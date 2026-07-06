import { apiFetch } from "./api";
import type {
  SiteSettings,
  Hero,
  About,
  Experience,
  Project,
  Skill,
  Certification,
  Testimonial,
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
  resume: Resume | null;
}

/** All content for the one-page site, cached and tag-revalidated. */
export function getHomeContent(): Promise<HomeContent> {
  return apiFetch<HomeContent>("/content/home", {
    tags: ["home", "projects", "skills", "experience", "testimonials"],
    revalidate: 3600,
  });
}

export function getProjects(): Promise<Project[]> {
  return apiFetch<Project[]>("/projects", { tags: ["projects"], revalidate: 3600 });
}

export function getProject(
  slug: string,
): Promise<{ project: Project; caseStudy: CaseStudy | null }> {
  return apiFetch(`/projects/${slug}`, {
    tags: ["projects", `project:${slug}`],
    revalidate: 3600,
  });
}

export function getSeo(pageKey: string): Promise<SeoMeta | null> {
  return apiFetch<SeoMeta | null>(`/seo/${pageKey}`, {
    tags: ["seo"],
    revalidate: 3600,
  }).catch(() => null);
}
