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
      testimonials, freelance_services, seo_meta, hero, about,
      site_settings, resume
      restart identity cascade`;

    await sql`insert into site_settings ${sql({
      brand_name: "Santosh Sharma",
      tagline: "Software Engineer",
      email: "07santoshdevlopersharma@gmail.com",
      location: "India",
      availability: "AI Engineer \u2022 Software Engineer \u2022 Open to Opportunities",
      socials: sql.json([
        { label: "GitHub", url: "https://github.com/Santoshsharm07" },
        { label: "LinkedIn", url: "https://www.linkedin.com/in/santosh-sharma-a57026220/" },
        { label: "LeetCode", url: "https://leetcode.com/u/santosh_07sharma/" },
      ]),
    })}`;

    await sql`insert into hero ${sql({
      headline: "I build worlds that respond to you.",
      subheadline:
        "Design engineer blending 3D, motion, and systems thinking into interfaces people remember.",
      roles: sql.json([
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
      heading: "Where Software Engineering Meets Artificial Intelligence",
      body: "I'm Santosh Sharma, a **Computer Science & Engineering** graduate from **VIT Bhopal (2025)** with a CGPA of **8.60**. As an **AI Engineer** and **Software Engineer**, I am passionate about building intelligent applications and scalable software that solve real-world problems through technology and innovation.\n\nMy expertise spans **Python**, **Machine Learning**, **Generative AI**, **Agentic AI**, **Large Language Models (LLMs)**, **Data Science**, **SQL**, and **Full Stack Development**. I enjoy designing and developing end-to-end solutions, from AI-powered systems and autonomous agents to modern web applications and data-driven platforms.\n\nWith experience building **RAG applications**, **AI assistants**, **computer vision systems**, **analytics dashboards**, and **intelligent automation tools**, I focus on creating impactful products that combine cutting-edge AI with robust software engineering. I continuously explore emerging technologies to deliver solutions that are scalable, efficient, and aligned with business goals.",
      stats: sql.json([
        { label: "Years", value: "0-2" },
        { label: "Projects", value: "8+" },
        { label: "CGPA", value: "8.60" },
        { label: "B.Tech", value: "CSE" },
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
        title: "IB Gram",
        slug: "ibgram",
        kind: "work",
        summary:
          "An end-to-end platform connecting IB and IGCSE students with home tutors.",
        about:
          "IB Gram is a premier tutoring platform connecting IB and IGCSE students with elite home tutors. I designed and developed the entire web application from scratch, creating a seamless matching experience.",
        tags: ["Full stack Application"],
        role: "Full Stack Developer",
        year: 2025,
        live_url: "https://www.ibgram.com/",
        repo_url: null,
        is_featured: true,
        is_published: true,
        sort_order: 0,
      },
      {
        title: "BoardPeFocus",
        slug: "boardpefocus",
        kind: "work",
        summary:
          "A premium tutor discovery engine for Class 10/12 boards in Gurgaon.",
        about:
          "BoardPeFocus connects Class 10 and 12 students with top-rated home tutors across CBSE, ICSE, IB, and IGCSE boards in Gurgaon. I built the tutor directory, lead generation system, and full admin dashboard.",
        tags: ["Full stack Application"],
        role: "Full Stack Developer",
        year: 2024,
        live_url: "https://www.boardpefocus.in/",
        repo_url: null,
        is_featured: true,
        is_published: true,
        sort_order: 1,
      },
      {
        title: "Road Accident Detection Alert System",
        slug: "road-accident-detection",
        kind: "personal",
        summary:
          "Designed a real-time Python video processing pipeline using OpenCV for efficient and reliable road accident detection. Implemented an event-driven alert system with Twilio API for instant SMS notifications.",
        about:
          "A real-time road accident detection and alert system built with Python and OpenCV. The system processes live video feeds to detect accidents using machine learning models and instantly sends SMS alerts via the Twilio API to notify emergency contacts and authorities.",
        tags: ["Python", "OpenCV", "Machine Learning", "Twilio API"],
        role: "Developer",
        year: 2024,
        live_url: null,
        repo_url: "https://github.com/Santoshsharm07/Road-Accident-Detection-Alert-System",
        is_featured: false,
        is_published: true,
        sort_order: 2,
      },
      {
        title: "Imagify — AI Image Generator",
        slug: "imagify",
        kind: "personal",
        summary:
          "Developed a full-stack MERN application with scalable RESTful APIs for secure AI-based image generation. Executed JWT authentication, structured API routing, and integrated Gemini API for intelligent image creation.",
        about:
          "Imagify is a full-stack AI image generation platform built with the MERN stack. It features secure user authentication via JWT, scalable RESTful APIs with Express.js, and integrates Google's Gemini API for intelligent AI-powered image generation. Styled with TailwindCSS for a modern, responsive UI.",
        tags: ["React.js", "Node.js", "Express.js", "MongoDB", "TailwindCSS", "Gemini API", "JWT"],
        role: "Full Stack Developer",
        year: 2024,
        live_url: "https://imagify-nn52-git-main-santosh-sharmas-projects-81e4a1b5.vercel.app/",
        repo_url: "https://github.com/Santoshsharm07/Imagify",
        is_featured: false,
        is_published: true,
        sort_order: 3,
      },
      {
        title: "Open Library with AI Book Suggestion",
        slug: "open-library-ai",
        kind: "personal",
        summary:
          "Built a full-stack library management platform with secure Firebase authentication and a complete book borrowing workflow. Established RESTful APIs with Node.js and Express.js, integrated Gemini API for AI-powered book suggestions, and containerized with Docker.",
        about:
          "A full-stack library management platform featuring secure Firebase authentication, a complete book borrowing workflow, and AI-powered book recommendations via Google's Gemini API. Built with React, Node.js, Express.js, and MongoDB, with Docker containerization for easy deployment.",
        tags: ["React", "Node.js", "Express.js", "MongoDB", "Firebase", "Gemini API", "Docker", "JWT", "TailwindCSS"],
        role: "Full Stack Developer",
        year: 2024,
        live_url: "https://open-library-with-ai-book-suggestio-blue.vercel.app/",
        repo_url: "https://github.com/Santoshsharm07/Open-Library-with-Ai-Book-Suggestion",
        is_featured: false,
        is_published: true,
        sort_order: 4,
      },
      {
        title: "Legal Document Analyzer",
        slug: "legal-document-analyzer",
        kind: "personal",
        summary:
          "Designed an NLP pipeline using transformer-based models to summarize legal documents and extract named entities. Integrated OCR with text preprocessing for scanned document analysis.",
        about:
          "An NLP-powered legal document analyzer that uses transformer-based models from Hugging Face to summarize legal documents and extract named entities. Features OCR integration for processing scanned documents with automated text preprocessing.",
        tags: ["Python", "NLP", "Hugging Face", "OCR"],
        role: "Developer",
        year: 2024,
        live_url: null,
        repo_url: "https://github.com/Santoshsharm07/Legal_Document_Analyzer",
        is_featured: false,
        is_published: true,
        sort_order: 5,
      },
      {
        title: "AI-Powered Chatbot",
        slug: "ai-chatbot",
        kind: "personal",
        summary:
          "Developed a conversational AI application using Gemini API to handle natural language user queries. Deployed the chatbot on Streamlit Cloud with prompt engineering for accurate responses.",
        about:
          "A conversational AI chatbot built with Python and Google's Gemini API. Features natural language understanding, prompt engineering for accurate responses, and is deployed on Streamlit Cloud for easy access.",
        tags: ["Python", "Streamlit", "Google Gemini API"],
        role: "Developer",
        year: 2024,
        live_url: null,
        repo_url: "https://github.com/Santoshsharm07/Ai-Chatbot",
        is_featured: false,
        is_published: true,
        sort_order: 6,
      },
      {
        title: "Power BI Olympic Dashboard",
        slug: "olympic-dashboard",
        kind: "personal",
        summary:
          "Analyzed 120+ years of Olympic datasets using Power BI, DAX, and data modeling techniques. Delivered insights on athlete performance, medal trends, and country-wise statistics.",
        about:
          "A comprehensive Power BI dashboard analyzing 120+ years of Olympic data. Uses DAX formulas and advanced data modeling to deliver insights on athlete performance, medal trends, and country-wise statistics with interactive visualizations.",
        tags: ["Power BI", "DAX", "Data Analysis"],
        role: "Data Analyst",
        year: 2024,
        live_url: null,
        repo_url: "https://github.com/Santoshsharm07/Olympic-Dashboard",
        is_featured: false,
        is_published: true,
        sort_order: 7,
      },
    ];
    const projectRows: { id: string; slug: string }[] = [];
    for (const p of projects) {
      const [row] = await sql`insert into projects ${sql(p)} returning id, slug`;
      projectRows.push(row as { id: string; slug: string });
    }

    // Case studies for the two featured projects
    // Case studies for the two featured projects
    for (const pr of projectRows.slice(0, 2)) {
      const isIbGram = pr.slug === "ibgram";
      await sql`insert into case_studies ${sql({
        project_id: pr.id,
        overview: isIbGram
          ? "IB Gram connects students with verified local tutors specializing in IB and IGCSE curricula."
          : "BoardPeFocus serves as a specialized directory matching Board Exam candidates with elite home instructors.",
        problem: isIbGram
          ? "Finding hyper-specific IB and IGCSE tutors in local regions is traditionally highly fragmented and offline."
          : "Board year students (10th/12th) need high-quality offline tutor matching to succeed in critical exams.",
        solution: isIbGram
          ? "A custom directory website built with Next.js, featuring search by subject, radius-based tutor discovery, and booking management."
          : "A highly-optimized directory platform highlighting tutor ratings, curriculum expertise, and verified location matching.",
        results: isIbGram
          ? "Streamlined search, enabling hundreds of successful connections between students and qualified tutors."
          : "Hundreds of active student-tutor pairings in Gurgaon and highly improved lead conversion rate.",
        gallery: sql.json([]),
        sections: sql.json([
          {
            type: "text",
            heading: isIbGram ? "The Challenge" : "The Strategy",
            body: isIbGram
              ? "Building a trustable and fast marketplace for niche tutoring curriculums (IB and IGCSE) while maintaining clean discovery filters."
              : "Creating a high-performance directory with clear conversion paths and search options tailored to board exams requirements."
          }
        ]),
      })}`;
    }

    const skills = [
      ["Python", "programming", 95],
      ["Java", "programming", 85],
      ["SQL", "programming", 90],
      
      ["Generative AI", "ai_genai", 98],
      ["Agentic AI", "ai_genai", 98],
      ["LLMs", "ai_genai", 95],
      ["RAG", "ai_genai", 95],
      ["AI Agents", "ai_genai", 98],
      ["Multi-Agent Systems", "ai_genai", 95],
      ["Prompt Engineering", "ai_genai", 95],
      ["Machine Learning", "ai_genai", 90],
      ["NLP", "ai_genai", 92],
      ["Computer Vision", "ai_genai", 85],

      ["LangChain", "frameworks", 95],
      ["LangGraph", "frameworks", 95],
      ["AutoGen", "frameworks", 90],
      ["FastAPI", "frameworks", 92],
      ["React.js", "frameworks", 90],
      ["Next.js", "frameworks", 92],
      ["Node.js", "frameworks", 90],
      ["Express.js", "frameworks", 88],

      ["Pandas", "data_analytics", 92],
      ["NumPy", "data_analytics", 90],
      ["Power BI", "data_analytics", 95],
      ["Excel", "data_analytics", 90],
      ["Data Visualization", "data_analytics", 92],
      ["Predictive Analytics", "data_analytics", 88],
      ["Statistical Analysis", "data_analytics", 85],
      ["Data Engineering", "data_analytics", 88],

      ["PostgreSQL", "databases", 90],
      ["MySQL", "databases", 88],
      ["MongoDB", "databases", 90],
      ["Supabase", "databases", 92],

      ["AWS Lambda", "cloud_mlops", 90],
      ["Amazon ECS", "cloud_mlops", 85],
      ["Amazon RDS", "cloud_mlops", 88],
      ["Amazon Aurora", "cloud_mlops", 85],
      ["Amazon S3", "cloud_mlops", 90],
      ["Amazon CloudWatch", "cloud_mlops", 85],
      ["Docker", "cloud_mlops", 90],
      ["Git", "cloud_mlops", 95],
      ["GitHub Actions", "cloud_mlops", 92],
      ["CI/CD", "cloud_mlops", 90],

      ["OpenAI API", "ai_apis", 98],
      ["Google Gemini API", "ai_apis", 98],
      ["Hugging Face", "ai_apis", 92],
      ["Meta Graph API", "ai_apis", 90],
      ["WhatsApp Business API", "ai_apis", 92],
      ["REST APIs", "ai_apis", 95],
      ["Webhooks", "ai_apis", 92],
      ["OAuth", "ai_apis", 88],

      ["AI Engineering", "domain_expertise", 98],
      ["Agentic AI Development", "domain_expertise", 98],
      ["Generative AI", "domain_expertise", 98],
      ["Data Science", "domain_expertise", 90],
      ["Software Engineering", "domain_expertise", 95],
      ["Intelligent Automation", "domain_expertise", 95],
      ["Backend Development", "domain_expertise", 95],
      ["Full Stack Development", "domain_expertise", 92],
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
        title: "SQL (Intermediate)",
        issuer: "HackerRank",
        issue_date: "2023-02",
        credential_url: "https://www.hackerrank.com/certificates/b6a08d5543d3",
        sort_order: 0,
      },
      {
        title: "Applied Machine Learning in Python",
        issuer: "University of Michigan",
        issue_date: "2023-01",
        credential_url: "https://www.coursera.org/account/accomplishments/verify/XFFWQHWJ3A3B?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course",
        sort_order: 1,
      },
      {
        title: "The Bits and Bytes of Computer Networking",
        issuer: "Google",
        issue_date: "2023-12",
        credential_url: "https://www.coursera.org/account/accomplishments/verify/V9DW2TG34N8J?utm_source=link&utm_medium=certificate&utm_content=cert_image&utm_campaign=sharing_cta&utm_product=course",
        sort_order: 2,
      },
      {
        title: "AWS Certified Cloud Practitioner",
        issuer: "Amazon",
        issue_date: "2024-03",
        credential_id: "ac2ef33b8f434561ab59d7f4dc7a2b2b",
        credential_url: "https://www.credly.com/badges/244e38d9-3549-4a74-a5e1-a84934816980/public_url",
        sort_order: 3,
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

    const freelance = [
      {
        title: "Landing Page / Portfolio",
        description:
          "A fast, polished one-page site to launch your idea, product, or personal brand — responsive and SEO-ready.",
        price: "From ₹4,999",
        timeline: "3–5 days",
        features: ["Responsive design", "SEO basics", "Contact form", "1 revision round"],
        icon: "🚀",
        cta_label: "Build my page",
        contact_url: "#contact",
        sort_order: 0,
      },
      {
        title: "Full-Stack Web App",
        description:
          "End-to-end web application with authentication, database, and an admin dashboard — built to scale with your business.",
        price: "From ₹19,999",
        timeline: "2–4 weeks",
        features: ["Custom features", "Database + API", "Admin panel", "Deployment"],
        icon: "⚙️",
        cta_label: "Discuss my project",
        contact_url: "#contact",
        sort_order: 1,
      },
      {
        title: "Bug Fixes & Improvements",
        description:
          "Have an existing site or app that needs fixing, speeding up, or new features? I'll jump in at minimal cost.",
        price: "From ₹999",
        timeline: "1–2 days",
        features: ["Bug fixes", "Performance tuning", "Small features", "Code review"],
        icon: "🔧",
        cta_label: "Get help now",
        contact_url: "#contact",
        sort_order: 2,
      },
    ];
    for (const f of freelance) await sql`insert into freelance_services ${sql(f)}`;

    const seo = [
      {
        page_key: "home",
        title: "Santosh - Portfolio",
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
