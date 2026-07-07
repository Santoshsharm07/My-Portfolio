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

/**
 * Built-in demo content served by the public API when Supabase is not
 * configured (see `env.isDemo`). Mirrors `packages/db/src/seed.ts` so the
 * site looks alive out-of-the-box with no database or external setup.
 */

const TS = "2026-01-01T00:00:00.000Z";
// Deterministic UUIDs so keys/links stay stable across restarts.
const id = (n: string) => `00000000-0000-4000-8000-${n.padStart(12, "0")}`;

const base = (n: string) => ({
  id: id(n),
  created_at: TS,
  updated_at: TS,
});

export const demoSettings: SiteSettings = {
  ...base("s1"),
  brand_name: "Santosh Sharma",
  tagline: "Software Engineer",
  email: "07santoshdevlopersharma@gmail.com",
  location: "India",
  availability: "Available for freelance projects",
  socials: [
    { label: "GitHub", url: "https://github.com/Santoshsharm07" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/santosh-sharma-a57026220/" },
    { label: "LeetCode", url: "https://leetcode.com/u/santosh_07sharma/" },
  ],
  theme: "acid-brutalist",
};

export const demoHero: Hero = {
  ...base("h1"),
  headline: "I build worlds that respond to you.",
  subheadline:
    "Design engineer blending 3D, motion, and systems thinking into interfaces people remember.",
  roles: [
    "Design Engineer",
    "Creative Technologist",
    "3D & Motion",
    "Front-of-the-front-end",
  ],
  cta_label: "Explore work",
  cta_href: "#projects",
  secondary_cta_label: "Read my story",
  secondary_cta_href: "#about",
  background_media_id: null,
};

export const demoAbout: About = {
  ...base("a1"),
  heading: "Obsessed with the space between design and engineering.",
  body: "I spend my days turning ambitious ideas into interfaces that feel inevitable — where a scroll becomes a story and a hover becomes a moment. Ten years across startups and studios, shipping work that has been featured on Awwwards and used by millions.\n\nMy toolkit lives at the intersection of **React**, **WebGL/Three.js**, and a deep respect for craft.",
  portrait_media_id: null,
  stats: [
    { label: "Years", value: "10+" },
    { label: "Projects shipped", value: "120+" },
    { label: "Awwwards", value: "7" },
    { label: "Coffee/day", value: "∞" },
  ],
};

export const demoExperience: Experience[] = [
  {
    ...base("e1"),
    company: "Lumen Studio",
    role: "Lead Design Engineer",
    location: "Berlin",
    start_date: "2022-01",
    end_date: null,
    is_current: true,
    description:
      "Lead the design-engineering practice; ship award-winning marketing sites and product interfaces for global brands.",
    logo_media_id: null,
    sort_order: 0,
  },
  {
    ...base("e2"),
    company: "Northwind",
    role: "Senior Frontend Engineer",
    location: "Remote",
    start_date: "2019-03",
    end_date: "2021-12",
    is_current: false,
    description:
      "Owned the design system and interactive storytelling for a fintech super-app used by 4M+ people.",
    logo_media_id: null,
    sort_order: 1,
  },
  {
    ...base("e3"),
    company: "Pixel & Co.",
    role: "Creative Developer",
    location: "Amsterdam",
    start_date: "2016-06",
    end_date: "2019-02",
    is_current: false,
    description:
      "Built immersive WebGL campaigns and experimental prototypes for agencies and artists.",
    logo_media_id: null,
    sort_order: 2,
  },
];

export const demoProjects: Project[] = [
  {
    ...base("p1"),
    title: "Aurora — Generative Brand System",
    slug: "aurora",
    kind: "work",
    summary:
      "A living identity that renders itself in real time with WebGL shaders.",
    about:
      "Built for a client rebrand: a shader-driven system that generates infinite on-brand visuals in the browser, cutting design turnaround from days to seconds.",
    cover_media_id: null,
    tags: ["WebGL", "Three.js", "GSAP", "Design System"],
    role: "Design Engineer",
    year: 2025,
    live_url: "https://example.com/aurora",
    repo_url: null,
    is_featured: true,
    is_published: true,
    sort_order: 0,
  },
  {
    ...base("p2"),
    title: "Monolith — Product Launch",
    slug: "monolith",
    kind: "work",
    summary:
      "Scroll-driven cinematic launch experience with a physics-based hero.",
    about:
      "A launch microsite delivered end-to-end for a startup: staged reveal, pinned scroll scenes, and a physics hero that tripled launch-day traffic.",
    cover_media_id: null,
    tags: ["Next.js", "R3F", "Lenis", "Framer Motion"],
    role: "Lead Engineer",
    year: 2024,
    live_url: "https://example.com/monolith",
    repo_url: null,
    is_featured: true,
    is_published: true,
    sort_order: 1,
  },
  {
    ...base("p3"),
    title: "Cadence — Music Visualizer",
    slug: "cadence",
    kind: "personal",
    summary: "Audio-reactive 3D visuals that turn any track into a landscape.",
    about:
      "A weekend passion project exploring the Web Audio API and GLSL — every track becomes a living, reactive 3D landscape you can fly through.",
    cover_media_id: null,
    tags: ["Web Audio", "GLSL", "Three.js"],
    role: "Creative Developer",
    year: 2024,
    live_url: null,
    repo_url: "https://github.com/",
    is_featured: false,
    is_published: true,
    sort_order: 2,
  },
  {
    ...base("p4"),
    title: "Atlas — Data Storytelling",
    slug: "atlas",
    kind: "personal",
    summary: "An interactive report that makes complex data feel human.",
    about:
      "A self-initiated experiment in data storytelling — turning a dry dataset into an interactive, scroll-driven narrative built with D3 and SVG.",
    cover_media_id: null,
    tags: ["D3", "SVG", "Motion"],
    role: "Engineer",
    year: 2023,
    live_url: "https://example.com/atlas",
    repo_url: null,
    is_featured: false,
    is_published: true,
    sort_order: 3,
  },
];

const demoCaseStudies: Record<string, CaseStudy> = {
  aurora: {
    ...base("c1"),
    project_id: id("p1"),
    overview:
      "A deep-dive into how we approached the problem, the constraints we embraced, and the craft that made it sing.",
    problem:
      "The brand needed to feel alive across every touchpoint without a rigid, static identity.",
    solution:
      "We built a generative system: a set of shader-driven primitives that compose into infinite, on-brand compositions.",
    results:
      "40% lift in engagement, featured on Awwwards, and a design language the team can extend forever.",
    gallery: [],
    sections: [
      { type: "text", heading: "The brief", body: "Make it unforgettable." },
      { type: "metric", heading: "Engagement", value: "+40%" },
    ],
  },
  monolith: {
    ...base("c2"),
    project_id: id("p2"),
    overview:
      "A scroll-native launch where every section is a beat in a larger story, choreographed frame by frame.",
    problem:
      "A crowded launch window meant the product had three seconds to earn attention.",
    solution:
      "We staged the reveal as a cinematic sequence — a physics hero, pinned scenes, and type that performs.",
    results:
      "Launch-day traffic tripled and average session time more than doubled.",
    gallery: [],
    sections: [
      { type: "metric", heading: "Traffic", value: "3×" },
      { type: "metric", heading: "Session time", value: "+118%" },
    ],
  },
};

export const demoSkills: Skill[] = (
  [
    ["React / Next.js", "frontend", 98],
    ["TypeScript", "frontend", 95],
    ["Three.js / R3F", "frontend", 90],
    ["GSAP / Motion", "frontend", 92],
    ["GLSL / Shaders", "frontend", 80],
    ["Node.js / Express", "backend", 85],
    ["PostgreSQL / Supabase", "backend", 82],
    ["Design Systems", "design", 90],
    ["Figma", "design", 88],
    ["Docker / CI", "devops", 75],
  ] as const
).map(([name, category, proficiency], i) => ({
  ...base(`sk${i}`),
  name,
  category,
  proficiency,
  icon_media_id: null,
  sort_order: i,
}));

export const demoCertifications: Certification[] = [
  {
    ...base("cert1"),
    title: "Awwwards Site of the Day",
    issuer: "Awwwards",
    issue_date: "2025-02",
    credential_id: null,
    credential_url: "https://awwwards.com/",
    file_media_id: null,
    sort_order: 0,
  },
  {
    ...base("cert2"),
    title: "Three.js Journey — Certified",
    issuer: "Bruno Simon",
    issue_date: "2023-09",
    credential_id: null,
    credential_url: "https://threejs-journey.com/",
    file_media_id: null,
    sort_order: 1,
  },
];

export const demoTestimonials: Testimonial[] = [
  {
    ...base("t1"),
    author_name: "Mara Lindqvist",
    author_role: "VP Design",
    author_company: "Northwind",
    avatar_media_id: null,
    quote:
      "Aria turns 'impossible' briefs into experiences that make stakeholders gasp. A rare blend of taste and technical depth.",
    rating: 5,
    sort_order: 0,
    is_published: true,
  },
  {
    ...base("t2"),
    author_name: "Tomás Rivera",
    author_role: "Founder",
    author_company: "Monolith",
    avatar_media_id: null,
    quote:
      "Our launch traffic tripled. The site didn't just look premium — it felt alive. Worth every second.",
    rating: 5,
    sort_order: 1,
    is_published: true,
  },
];

export const demoFreelance: FreelanceService[] = [
  {
    ...base("f1"),
    title: "Landing Page / Portfolio",
    description:
      "A fast, polished one-page site to launch your idea, product, or personal brand — responsive and SEO-ready.",
    price: "From ₹4,999",
    timeline: "3–5 days",
    features: ["Responsive design", "SEO basics", "Contact form", "1 revision round"],
    icon: "🚀",
    cta_label: "Build my page",
    contact_url: "#contact",
    is_published: true,
    sort_order: 0,
  },
  {
    ...base("f2"),
    title: "Full-Stack Web App",
    description:
      "End-to-end web application with authentication, database, and an admin dashboard — built to scale with your business.",
    price: "From ₹19,999",
    timeline: "2–4 weeks",
    features: ["Custom features", "Database + API", "Admin panel", "Deployment"],
    icon: "⚙️",
    cta_label: "Discuss my project",
    contact_url: "#contact",
    is_published: true,
    sort_order: 1,
  },
  {
    ...base("f3"),
    title: "Bug Fixes & Improvements",
    description:
      "Have an existing site or app that needs fixing, speeding up, or new features? I'll jump in at minimal cost.",
    price: "From ₹999",
    timeline: "1–2 days",
    features: ["Bug fixes", "Performance tuning", "Small features", "Code review"],
    icon: "🔧",
    cta_label: "Get help now",
    contact_url: "#contact",
    is_published: true,
    sort_order: 2,
  },
];

export const demoResume: Resume = {
  ...base("r1"),
  label: "Aria Vale — Résumé 2026",
  file_media_id: null,
  version: "2026.1",
  is_active: true,
};

const demoSeoMap: Record<string, SeoMeta> = {
  home: {
    ...base("seo1"),
    page_key: "home",
    title: "Santosh - Portfolio",
    description:
      "Award-winning design engineer crafting cinematic, interactive web experiences with React, Three.js, and motion.",
    keywords: ["design engineer", "creative developer", "webgl", "three.js"],
    og_image_media_id: null,
    canonical: null,
    json_ld: null,
  },
};

export interface DemoHome {
  settings: SiteSettings;
  hero: Hero;
  about: About;
  experience: Experience[];
  projects: Project[];
  skills: Skill[];
  certifications: Certification[];
  testimonials: Testimonial[];
  freelance: FreelanceService[];
  resume: Resume;
}

export const demoHome: DemoHome = {
  settings: demoSettings,
  hero: demoHero,
  about: demoAbout,
  experience: demoExperience,
  projects: demoProjects,
  skills: demoSkills,
  certifications: demoCertifications,
  testimonials: demoTestimonials,
  freelance: demoFreelance,
  resume: demoResume,
};

export function demoProjectBySlug(
  slug: string,
): { project: Project; caseStudy: CaseStudy | null } | null {
  const project = demoProjects.find((p) => p.slug === slug);
  if (!project) return null;
  return { project, caseStudy: demoCaseStudies[slug] ?? null };
}

export function demoSeoByKey(pageKey: string): SeoMeta | null {
  return demoSeoMap[pageKey] ?? null;
}
