import "server-only";
import { supabase } from "./supabase";
import { notFound } from "./http";

/**
 * Public read logic (published content only). Shared by the public route
 * handlers and, indirectly, the cached RSC data layer.
 */

export async function getHomeContent() {
  const [
    settings,
    hero,
    about,
    experience,
    projects,
    skills,
    certifications,
    testimonials,
    freelance,
    resume,
  ] = await Promise.all([
    supabase.from("site_settings").select("*").limit(1).maybeSingle(),
    supabase.from("hero").select("*").limit(1).maybeSingle(),
    supabase.from("about").select("*").limit(1).maybeSingle(),
    supabase.from("experience").select("*").order("sort_order"),
    supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order"),
    supabase.from("skills").select("*").order("sort_order"),
    supabase.from("certifications").select("*").order("sort_order"),
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order"),
    supabase
      .from("freelance_services")
      .select("*")
      .eq("is_published", true)
      .order("sort_order"),
    supabase.from("resume").select("*").eq("is_active", true).maybeSingle(),
  ]);

  return {
    settings: settings.data,
    hero: hero.data,
    about: about.data,
    experience: experience.data ?? [],
    projects: projects.data ?? [],
    skills: skills.data ?? [],
    certifications: certifications.data ?? [],
    testimonials: testimonials.data ?? [],
    freelance: freelance.data ?? [],
    resume: resume.data,
  };
}

export async function getPublicProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");
  if (error) throw error;
  return data;
}

export async function getPublicProject(slug: string) {
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (!project) throw notFound("Project");

  const { data: caseStudy } = await supabase
    .from("case_studies")
    .select("*")
    .eq("project_id", project.id)
    .maybeSingle();

  return { project, caseStudy };
}

export async function getActiveResume() {
  const { data: resume } = await supabase
    .from("resume")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();
  let file_url: string | null = null;
  if (resume?.file_media_id) {
    const { data: media } = await supabase
      .from("media")
      .select("public_url")
      .eq("id", resume.file_media_id)
      .maybeSingle();
    file_url = media?.public_url ?? null;
  }
  return { resume, file_url };
}

export async function getSeo(pageKey: string) {
  const { data } = await supabase
    .from("seo_meta")
    .select("*")
    .eq("page_key", pageKey)
    .maybeSingle();
  return data;
}
