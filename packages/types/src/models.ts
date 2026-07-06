import { z } from "zod";
import { baseEntity, uuid, skillCategory } from "./common.js";

/* ─────────────────────────── Media ─────────────────────────── */
export const media = baseEntity.extend({
  file_name: z.string(),
  storage_path: z.string(),
  public_url: z.string().url(),
  mime_type: z.string(),
  width: z.number().int().nullable(),
  height: z.number().int().nullable(),
  size_bytes: z.number().int(),
  alt: z.string().default(""),
});
export type Media = z.infer<typeof media>;

/* ────────────────────────── Site settings ──────────────────── */
export const socialLink = z.object({
  label: z.string(),
  url: z.string().url(),
  icon: z.string().optional(),
});
export const siteSettings = baseEntity.extend({
  brand_name: z.string().min(1),
  tagline: z.string().default(""),
  email: z.string().email().nullable(),
  location: z.string().default(""),
  availability: z.string().default(""),
  socials: z.array(socialLink).default([]),
  theme: z.string().default("dark-lux"),
});
export const siteSettingsUpdate = siteSettings
  .omit({ id: true, created_at: true, updated_at: true })
  .partial();
export type SiteSettings = z.infer<typeof siteSettings>;

/* ─────────────────────────── Hero ──────────────────────────── */
export const hero = baseEntity.extend({
  headline: z.string().min(1),
  subheadline: z.string().default(""),
  roles: z.array(z.string()).default([]), // typewriter rotation
  cta_label: z.string().default("View work"),
  cta_href: z.string().default("#projects"),
  secondary_cta_label: z.string().nullable(),
  secondary_cta_href: z.string().nullable(),
  background_media_id: uuid.nullable(),
});
export const heroUpdate = hero
  .omit({ id: true, created_at: true, updated_at: true })
  .partial();
export type Hero = z.infer<typeof hero>;

/* ─────────────────────────── About ─────────────────────────── */
export const aboutStat = z.object({ label: z.string(), value: z.string() });
export const about = baseEntity.extend({
  heading: z.string().min(1),
  body: z.string().default(""), // markdown
  portrait_media_id: uuid.nullable(),
  stats: z.array(aboutStat).default([]),
});
export const aboutUpdate = about
  .omit({ id: true, created_at: true, updated_at: true })
  .partial();
export type About = z.infer<typeof about>;

/* ──────────────────────── Experience ───────────────────────── */
export const experience = baseEntity.extend({
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().default(""),
  start_date: z.string(), // YYYY-MM
  end_date: z.string().nullable(),
  is_current: z.boolean().default(false),
  description: z.string().default(""),
  logo_media_id: uuid.nullable(),
  sort_order: z.number().int().default(0),
});
export const experienceCreate = experience.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export const experienceUpdate = experienceCreate.partial();
export type Experience = z.infer<typeof experience>;

/* ───────────────────────── Projects ────────────────────────── */
export const project = baseEntity.extend({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a url-safe slug"),
  summary: z.string().default(""),
  about: z.string().default(""), // longer "short about" shown on the detail page
  kind: z.enum(["personal", "work"]).default("personal"),
  cover_media_id: uuid.nullable(),
  tags: z.array(z.string()).default([]),
  role: z.string().default(""),
  year: z.number().int().nullable(),
  live_url: z.string().url().nullable(),
  repo_url: z.string().url().nullable(),
  is_featured: z.boolean().default(false),
  is_published: z.boolean().default(false),
  sort_order: z.number().int().default(0),
});
export const projectCreate = project.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export const projectUpdate = projectCreate.partial();
export type Project = z.infer<typeof project>;

/* ─────────────────────── Case studies ──────────────────────── */
export const caseStudyBlock = z.object({
  type: z.enum(["text", "image", "quote", "metric", "video"]),
  heading: z.string().optional(),
  body: z.string().optional(),
  media_id: uuid.optional(),
  value: z.string().optional(),
});
export const caseStudy = baseEntity.extend({
  project_id: uuid,
  overview: z.string().default(""),
  problem: z.string().default(""),
  solution: z.string().default(""),
  results: z.string().default(""),
  gallery: z.array(uuid).default([]),
  sections: z.array(caseStudyBlock).default([]),
});
export const caseStudyUpsert = caseStudy.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type CaseStudy = z.infer<typeof caseStudy>;

/* ───────────────────────── Skills ──────────────────────────── */
export const skill = baseEntity.extend({
  name: z.string().min(1),
  category: skillCategory,
  proficiency: z.number().int().min(0).max(100).default(80),
  icon_media_id: uuid.nullable(),
  sort_order: z.number().int().default(0),
});
export const skillCreate = skill.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export const skillUpdate = skillCreate.partial();
export type Skill = z.infer<typeof skill>;

/* ─────────────────────── Certifications ────────────────────── */
export const certification = baseEntity.extend({
  title: z.string().min(1),
  issuer: z.string().min(1),
  issue_date: z.string().nullable(), // YYYY-MM
  credential_id: z.string().nullable(),
  credential_url: z.string().url().nullable(),
  file_media_id: uuid.nullable(),
  sort_order: z.number().int().default(0),
});
export const certificationCreate = certification.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export const certificationUpdate = certificationCreate.partial();
export type Certification = z.infer<typeof certification>;

/* ───────────────────────── Resume ──────────────────────────── */
export const resume = baseEntity.extend({
  label: z.string().default("Resume"),
  file_media_id: uuid.nullable(),
  version: z.string().default("1"),
  is_active: z.boolean().default(false),
});
export const resumeCreate = resume.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export const resumeUpdate = resumeCreate.partial();
export type Resume = z.infer<typeof resume>;

/* ──────────────────────── Testimonials ─────────────────────── */
export const testimonial = baseEntity.extend({
  author_name: z.string().min(1),
  author_role: z.string().default(""),
  author_company: z.string().default(""),
  avatar_media_id: uuid.nullable(),
  quote: z.string().min(1),
  rating: z.number().int().min(1).max(5).default(5),
  sort_order: z.number().int().default(0),
  is_published: z.boolean().default(true),
});
export const testimonialCreate = testimonial.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export const testimonialUpdate = testimonialCreate.partial();
export type Testimonial = z.infer<typeof testimonial>;

/* ─────────────────────── Freelance services ────────────────── */
export const freelanceService = baseEntity.extend({
  title: z.string().min(1),
  description: z.string().default(""), // purpose / what it's for
  price: z.string().default(""), // e.g. "From ₹4,999" — the minimal-cost angle
  timeline: z.string().default(""), // e.g. "3–5 days"
  features: z.array(z.string()).default([]),
  icon: z.string().default(""), // emoji or short glyph
  cta_label: z.string().default("Start this project"),
  contact_url: z.string().nullable(), // mailto:, wa.me, tel:, or #contact
  is_published: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});
export const freelanceServiceCreate = freelanceService.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export const freelanceServiceUpdate = freelanceServiceCreate.partial();
export type FreelanceService = z.infer<typeof freelanceService>;

/* ──────────────────── Contact messages ─────────────────────── */
export const contactMessage = baseEntity.extend({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().default(""),
  message: z.string().min(1),
  is_read: z.boolean().default(false),
  ip: z.string().nullable(),
  user_agent: z.string().nullable(),
});
/** Public submission payload (honeypot `company` must stay empty). */
export const contactMessageCreate = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  subject: z.string().max(160).default(""),
  message: z.string().min(1).max(4000),
  company: z.string().max(0).optional(), // honeypot
});
export type ContactMessage = z.infer<typeof contactMessage>;

/* ────────────────────────── SEO ────────────────────────────── */
export const seoMeta = baseEntity.extend({
  page_key: z.string().min(1),
  title: z.string().default(""),
  description: z.string().default(""),
  keywords: z.array(z.string()).default([]),
  og_image_media_id: uuid.nullable(),
  canonical: z.string().url().nullable(),
  json_ld: z.record(z.unknown()).nullable(),
});
export const seoMetaUpsert = seoMeta.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
export type SeoMeta = z.infer<typeof seoMeta>;

/* ─────────────────────────── Auth ──────────────────────────── */
export const loginInput = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
export const adminProfile = z.object({
  username: z.string(),
  role: z.literal("admin"),
});
export type AdminProfile = z.infer<typeof adminProfile>;

/** Batch reorder payload used by list drag-and-drop. */
export const reorderInput = z.object({
  items: z.array(z.object({ id: uuid, sort_order: z.number().int() })),
});
export type ReorderInput = z.infer<typeof reorderInput>;
