import { createSql } from "./client.js";

/**
 * Seeds realistic demo content so the site looks alive on first run.
 * Idempotent-ish: clears content tables then re-inserts. Safe for dev.
 */
async function main() {
  const sql = createSql();
  try {
    console.log("🌱 Seeding demo content…");

    await sql`truncate
      case_studies, projects, experience, skills, certifications,
      testimonials, seo_meta, hero, about, site_settings, resume
      restart identity cascade`;

    await sql`insert into site_settings ${sql({
      brand_name: "Aria Vale",
      tagline: "Design engineer crafting cinematic web experiences",
      email: "hello@ariavale.dev",
      location: "Berlin, DE",
      availability: "Available for select projects — Q3 2026",
      socials: JSON.stringify([
        { label: "GitHub", url: "https://github.com/" },
        { label: "LinkedIn", url: "https://linkedin.com/" },
        { label: "Dribbble", url: "https://dribbble.com/" },
        { label: "X", url: "https://x.com/" },
      ]),
    })}`;

    await sql`insert into hero ${sql({
      headline: "I build worlds that respond to you.",
      subheadline:
        "Design engineer blending 3D, motion, and systems thinking into interfaces people remember.",
      roles: JSON.stringify([
        "Design Engineer",
        "Creative Technologist",
        "3D & Motion",
        "Front-of-the-front-end",
      ]),
      cta_label: "Explore work",
      cta_href: "#projects",
      secondary_cta_label: "Read my story",
      secondary_cta_href: "#about",
    })}`;

    await sql`insert into about ${sql({
      heading: "Obsessed with the space between design and engineering.",
      body: "I spend my days turning ambitious ideas into interfaces that feel inevitable — where a scroll becomes a story and a hover becomes a moment. Ten years across startups and studios, shipping work that has been featured on Awwwards and used by millions.\n\nMy toolkit lives at the intersection of **React**, **WebGL/Three.js**, and a deep respect for craft.",
      stats: JSON.stringify([
        { label: "Years", value: "10+" },
        { label: "Projects shipped", value: "120+" },
        { label: "Awwwards", value: "7" },
        { label: "Coffee/day", value: "∞" },
      ]),
    })}`;

    const experiences = [
      {
        company: "Lumen Studio",
        role: "Lead Design Engineer",
        location: "Berlin",
        start_date: "2022-01",
        end_date: null,
        is_current: true,
        description:
          "Lead the design-engineering practice; ship award-winning marketing sites and product interfaces for global brands.",
        sort_order: 0,
      },
      {
        company: "Northwind",
        role: "Senior Frontend Engineer",
        location: "Remote",
        start_date: "2019-03",
        end_date: "2021-12",
        is_current: false,
        description:
          "Owned the design system and interactive storytelling for a fintech super-app used by 4M+ people.",
        sort_order: 1,
      },
      {
        company: "Pixel & Co.",
        role: "Creative Developer",
        location: "Amsterdam",
        start_date: "2016-06",
        end_date: "2019-02",
        is_current: false,
        description:
          "Built immersive WebGL campaigns and experimental prototypes for agencies and artists.",
        sort_order: 2,
      },
    ];
    for (const e of experiences) await sql`insert into experience ${sql(e)}`;

    const projects = [
      {
        title: "Aurora — Generative Brand System",
        slug: "aurora",
        summary:
          "A living identity that renders itself in real time with WebGL shaders.",
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
        title: "Monolith — Product Launch",
        slug: "monolith",
        summary:
          "Scroll-driven cinematic launch experience with a physics-based hero.",
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
        title: "Cadence — Music Visualizer",
        slug: "cadence",
        summary:
          "Audio-reactive 3D visuals that turn any track into a landscape.",
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
        title: "Atlas — Data Storytelling",
        slug: "atlas",
        summary: "An interactive report that makes complex data feel human.",
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
    const projectRows: { id: string; slug: string }[] = [];
    for (const p of projects) {
      const [row] = await sql`insert into projects ${sql(p)} returning id, slug`;
      projectRows.push(row as { id: string; slug: string });
    }

    // Case studies for the two featured projects
    for (const pr of projectRows.slice(0, 2)) {
      await sql`insert into case_studies ${sql({
        project_id: pr.id,
        overview:
          "A deep-dive into how we approached the problem, the constraints we embraced, and the craft that made it sing.",
        problem:
          "The brand needed to feel alive across every touchpoint without a rigid, static identity.",
        solution:
          "We built a generative system: a set of shader-driven primitives that compose into infinite, on-brand compositions.",
        results:
          "40% lift in engagement, featured on Awwwards, and a design language the team can extend forever.",
        gallery: JSON.stringify([]),
        sections: JSON.stringify([
          { type: "text", heading: "The brief", body: "Make it unforgettable." },
          { type: "metric", heading: "Engagement", value: "+40%" },
        ]),
      })}`;
    }

    const skills = [
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
    ] as const;
    let si = 0;
    for (const [name, category, proficiency] of skills) {
      await sql`insert into skills ${sql({
        name,
        category,
        proficiency,
        sort_order: si++,
      })}`;
    }

    const certs = [
      {
        title: "Awwwards Site of the Day",
        issuer: "Awwwards",
        issue_date: "2025-02",
        credential_url: "https://awwwards.com/",
        sort_order: 0,
      },
      {
        title: "Three.js Journey — Certified",
        issuer: "Bruno Simon",
        issue_date: "2023-09",
        credential_url: "https://threejs-journey.com/",
        sort_order: 1,
      },
    ];
    for (const c of certs) await sql`insert into certifications ${sql(c)}`;

    await sql`insert into resume ${sql({
      label: "Aria Vale — Résumé 2026",
      version: "2026.1",
      is_active: true,
    })}`;

    const testimonials = [
      {
        author_name: "Mara Lindqvist",
        author_role: "VP Design",
        author_company: "Northwind",
        quote:
          "Aria turns 'impossible' briefs into experiences that make stakeholders gasp. A rare blend of taste and technical depth.",
        rating: 5,
        sort_order: 0,
      },
      {
        author_name: "Tomás Rivera",
        author_role: "Founder",
        author_company: "Monolith",
        quote:
          "Our launch traffic tripled. The site didn't just look premium — it felt alive. Worth every second.",
        rating: 5,
        sort_order: 1,
      },
    ];
    for (const t of testimonials) await sql`insert into testimonials ${sql(t)}`;

    const seo = [
      {
        page_key: "home",
        title: "Aria Vale — Design Engineer & Creative Technologist",
        description:
          "Award-winning design engineer crafting cinematic, interactive web experiences with React, Three.js, and motion.",
        keywords: ["design engineer", "creative developer", "webgl", "three.js"],
      },
    ];
    for (const s of seo) await sql`insert into seo_meta ${sql(s)}`;

    console.log("✅ Seed complete");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
