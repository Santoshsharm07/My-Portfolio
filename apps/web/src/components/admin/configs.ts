import type { ResourceConfig } from "./ResourceManager";
import type { FieldConfig } from "./fields";
import type {
  Project,
  Skill,
  Experience,
  Certification,
  Testimonial,
  FreelanceService,
  SeoMeta,
} from "@portfolio/types";

export const projectConfig: ResourceConfig<Project & { id: string }> = {
  path: "projects",
  title: "Projects",
  singular: "Project",
  description: "Case studies and selected work shown on the site.",
  columns: [
    { key: "title", label: "Title" },
    { key: "kind", label: "Kind" },
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
    {
      name: "kind",
      label: "Kind",
      type: "select",
      options: [
        { label: "Real Work Project", value: "work" },
        { label: "Personal Project", value: "personal" },
      ],
      help: "Which tab it appears under on the site",
    },
    { name: "year", label: "Year", type: "number" },
    {
      name: "summary",
      label: "Summary (card)",
      type: "textarea",
      colSpan: 2,
      help: "Short line shown on the project card",
    },
    {
      name: "about",
      label: "About (detail page)",
      type: "textarea",
      colSpan: 2,
      help: "Longer description shown when the project is opened",
    },
    { name: "cover_media_id", label: "Cover image", type: "media", colSpan: 2 },
    { name: "tags", label: "Tags", type: "tags", colSpan: 2 },
    { name: "role", label: "Role", type: "text" },
    { name: "live_url", label: "Live URL", type: "url" },
    { name: "repo_url", label: "GitHub / Repo URL", type: "url" },
    { name: "is_featured", label: "Featured", type: "boolean" },
    { name: "is_published", label: "Published", type: "boolean" },
    { name: "sort_order", label: "Sort order", type: "number" },
  ],
  defaults: {
    title: "",
    slug: "",
    kind: "work",
    summary: "",
    about: "",
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

export const freelanceConfig: ResourceConfig<FreelanceService & { id: string }> =
  {
    path: "freelance",
    title: "Freelancing",
    singular: "Service",
    description:
      "Freelance offerings shown in the public Freelancing section.",
    columns: [
      { key: "title", label: "Service" },
      { key: "price", label: "Price" },
      { key: "timeline", label: "Timeline" },
      { key: "is_published", label: "Published" },
    ],
    fields: [
      { name: "title", label: "Service title", type: "text", required: true, colSpan: 2 },
      { name: "icon", label: "Icon (emoji)", type: "text", help: "e.g. 🚀" },
      { name: "price", label: "Price", type: "text", help: "e.g. From ₹4,999" },
      { name: "timeline", label: "Timeline", type: "text", help: "e.g. 3–5 days" },
      { name: "description", label: "Description / purpose", type: "textarea", colSpan: 2 },
      { name: "features", label: "Features", type: "tags", colSpan: 2, help: "comma separated" },
      { name: "cta_label", label: "Button label", type: "text" },
      {
        name: "contact_url",
        label: "Button link",
        type: "text",
        help: "#contact, mailto:you@mail.com, or https://wa.me/…",
      },
      { name: "is_published", label: "Published", type: "boolean" },
      { name: "sort_order", label: "Sort order", type: "number" },
    ],
    defaults: {
      title: "",
      icon: "",
      price: "",
      timeline: "",
      description: "",
      features: [],
      cta_label: "Start this project",
      contact_url: "#contact",
      is_published: true,
      sort_order: 0,
    } as Partial<FreelanceService & { id: string }>,
  };

/* ── Singleton editors (hero / about / site settings) ───────────────────── */
export interface SingletonConfig {
  path: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
  defaults: Record<string, unknown>;
}

export const heroConfig: SingletonConfig = {
  path: "hero",
  title: "Hero",
  description: "The headline area at the top of your site.",
  fields: [
    { name: "headline", label: "Headline", type: "textarea", required: true, colSpan: 2 },
    { name: "subheadline", label: "Subheadline", type: "textarea", colSpan: 2 },
    { name: "roles", label: "Rotating roles", type: "tags", colSpan: 2, help: "comma separated" },
    { name: "cta_label", label: "Primary button label", type: "text" },
    { name: "cta_href", label: "Primary button link", type: "text" },
    { name: "secondary_cta_label", label: "Secondary button label", type: "text" },
    { name: "secondary_cta_href", label: "Secondary button link", type: "text" },
    { name: "background_media_id", label: "Background media", type: "media", colSpan: 2 },
  ],
  defaults: {
    headline: "",
    subheadline: "",
    roles: [],
    cta_label: "View work",
    cta_href: "#projects",
    secondary_cta_label: "",
    secondary_cta_href: "",
    background_media_id: null,
  },
};

export const aboutConfig: SingletonConfig = {
  path: "about",
  title: "About",
  description: "Your about section.",
  fields: [
    { name: "heading", label: "Heading", type: "textarea", required: true, colSpan: 2 },
    { name: "body", label: "Body (markdown)", type: "richtext", colSpan: 2 },
    { name: "portrait_media_id", label: "Portrait", type: "media", colSpan: 2 },
    { name: "stats", label: "Stats", type: "json", colSpan: 2, help: '[{"label":"Years","value":"5+"}]' },
  ],
  defaults: {
    heading: "",
    body: "",
    portrait_media_id: null,
    stats: [],
  },
};

export const settingsConfig: SingletonConfig = {
  path: "site-settings",
  title: "Site Settings",
  description: "Brand, contact, and social links.",
  fields: [
    { name: "brand_name", label: "Brand name", type: "text", required: true },
    { name: "tagline", label: "Tagline", type: "text" },
    { name: "email", label: "Contact email", type: "text" },
    { name: "location", label: "Location", type: "text" },
    { name: "availability", label: "Availability", type: "text", colSpan: 2 },
    { name: "socials", label: "Social links", type: "json", colSpan: 2, help: '[{"label":"GitHub","url":"https://…"}]' },
  ],
  defaults: {
    brand_name: "",
    tagline: "",
    email: "",
    location: "",
    availability: "",
    socials: [],
  },
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
