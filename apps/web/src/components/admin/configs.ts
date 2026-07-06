import type { ResourceConfig } from "./ResourceManager";
import type {
  Project,
  Skill,
  Experience,
  Certification,
  Testimonial,
  SeoMeta,
} from "@portfolio/types";

export const projectConfig: ResourceConfig<Project & { id: string }> = {
  path: "projects",
  title: "Projects",
  singular: "Project",
  description: "Case studies and selected work shown on the site.",
  columns: [
    { key: "title", label: "Title" },
    { key: "year", label: "Year" },
    { key: "is_published", label: "Published" },
    { key: "is_featured", label: "Featured" },
  ],
  fields: [
    { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
    {
      name: "slug",
      label: "Slug",
      type: "text",
      required: true,
      help: "url-safe, e.g. aurora",
    },
    { name: "year", label: "Year", type: "number" },
    { name: "summary", label: "Summary", type: "textarea", colSpan: 2 },
    { name: "cover_media_id", label: "Cover image", type: "media", colSpan: 2 },
    { name: "tags", label: "Tags", type: "tags", colSpan: 2 },
    { name: "role", label: "Role", type: "text" },
    { name: "live_url", label: "Live URL", type: "url" },
    { name: "repo_url", label: "Repo URL", type: "url" },
    { name: "is_featured", label: "Featured", type: "boolean" },
    { name: "is_published", label: "Published", type: "boolean" },
    { name: "sort_order", label: "Sort order", type: "number" },
  ],
  defaults: {
    title: "",
    slug: "",
    summary: "",
    tags: [],
    role: "",
    is_featured: false,
    is_published: false,
    sort_order: 0,
  } as Partial<Project & { id: string }>,
};

export const skillConfig: ResourceConfig<Skill & { id: string }> = {
  path: "skills",
  title: "Skills",
  singular: "Skill",
  columns: [
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "proficiency", label: "Level" },
  ],
  fields: [
    { name: "name", label: "Name", type: "text", required: true },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: [
        { label: "Frontend", value: "frontend" },
        { label: "Backend", value: "backend" },
        { label: "Design", value: "design" },
        { label: "DevOps", value: "devops" },
        { label: "Mobile", value: "mobile" },
        { label: "Tools", value: "tools" },
        { label: "Other", value: "other" },
      ],
    },
    { name: "proficiency", label: "Proficiency (0–100)", type: "number" },
    { name: "sort_order", label: "Sort order", type: "number" },
  ],
  defaults: {
    name: "",
    category: "frontend",
    proficiency: 80,
    sort_order: 0,
  } as Partial<Skill & { id: string }>,
};

export const experienceConfig: ResourceConfig<Experience & { id: string }> = {
  path: "experience",
  title: "Experience",
  singular: "Role",
  columns: [
    { key: "role", label: "Role" },
    { key: "company", label: "Company" },
    { key: "start_date", label: "Start" },
    { key: "is_current", label: "Current" },
  ],
  fields: [
    { name: "role", label: "Role", type: "text", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "location", label: "Location", type: "text" },
    { name: "start_date", label: "Start (YYYY-MM)", type: "text", required: true },
    { name: "end_date", label: "End (YYYY-MM)", type: "text" },
    { name: "is_current", label: "Current role", type: "boolean" },
    { name: "description", label: "Description", type: "textarea", colSpan: 2 },
    { name: "sort_order", label: "Sort order", type: "number" },
  ],
  defaults: {
    role: "",
    company: "",
    location: "",
    start_date: "",
    is_current: false,
    description: "",
    sort_order: 0,
  } as Partial<Experience & { id: string }>,
};

export const certificationConfig: ResourceConfig<
  Certification & { id: string }
> = {
  path: "certifications",
  title: "Certifications",
  singular: "Certification",
  columns: [
    { key: "title", label: "Title" },
    { key: "issuer", label: "Issuer" },
    { key: "issue_date", label: "Date" },
  ],
  fields: [
    { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
    { name: "issuer", label: "Issuer", type: "text", required: true },
    { name: "issue_date", label: "Issue date (YYYY-MM)", type: "text" },
    { name: "credential_id", label: "Credential ID", type: "text" },
    { name: "credential_url", label: "Credential URL", type: "url", colSpan: 2 },
    { name: "file_media_id", label: "Certificate file", type: "media", colSpan: 2 },
    { name: "sort_order", label: "Sort order", type: "number" },
  ],
  defaults: {
    title: "",
    issuer: "",
    sort_order: 0,
  } as Partial<Certification & { id: string }>,
};

export const testimonialConfig: ResourceConfig<Testimonial & { id: string }> = {
  path: "testimonials",
  title: "Testimonials",
  singular: "Testimonial",
  columns: [
    { key: "author_name", label: "Author" },
    { key: "author_company", label: "Company" },
    { key: "rating", label: "Rating" },
    { key: "is_published", label: "Published" },
  ],
  fields: [
    { name: "author_name", label: "Author name", type: "text", required: true },
    { name: "author_role", label: "Author role", type: "text" },
    { name: "author_company", label: "Company", type: "text" },
    { name: "avatar_media_id", label: "Avatar", type: "media", colSpan: 2 },
    { name: "quote", label: "Quote", type: "textarea", required: true, colSpan: 2 },
    { name: "rating", label: "Rating (1–5)", type: "number" },
    { name: "is_published", label: "Published", type: "boolean" },
    { name: "sort_order", label: "Sort order", type: "number" },
  ],
  defaults: {
    author_name: "",
    author_role: "",
    author_company: "",
    quote: "",
    rating: 5,
    is_published: true,
    sort_order: 0,
  } as Partial<Testimonial & { id: string }>,
};

export const seoConfig: ResourceConfig<SeoMeta & { id: string }> = {
  path: "seo",
  title: "SEO",
  singular: "SEO entry",
  description: "Per-page meta tags and structured data.",
  columns: [
    { key: "page_key", label: "Page" },
    { key: "title", label: "Title" },
  ],
  fields: [
    {
      name: "page_key",
      label: "Page key",
      type: "text",
      required: true,
      help: "e.g. home",
    },
    { name: "title", label: "Meta title", type: "text", colSpan: 2 },
    { name: "description", label: "Meta description", type: "textarea", colSpan: 2 },
    { name: "keywords", label: "Keywords", type: "tags", colSpan: 2 },
    { name: "og_image_media_id", label: "OG image", type: "media", colSpan: 2 },
    { name: "canonical", label: "Canonical URL", type: "url", colSpan: 2 },
  ],
  defaults: {
    page_key: "",
    title: "",
    description: "",
    keywords: [],
  } as Partial<SeoMeta & { id: string }>,
};
