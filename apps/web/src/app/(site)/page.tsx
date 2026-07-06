import type { HomeContent } from "@/lib/data";
import { getHomeContent } from "@/lib/data";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Certifications } from "@/components/sections/Certifications";
import { Testimonials } from "@/components/sections/Testimonials";
import { ResumeBand } from "@/components/sections/ResumeBand";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export const revalidate = 3600;

const EMPTY: HomeContent = {
  settings: null,
  hero: null,
  about: null,
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  testimonials: [],
  resume: null,
};

export default async function HomePage() {
  // Resilient to the API/DB being unreachable (e.g. during a cold build).
  const content = await getHomeContent().catch(() => EMPTY);

  return (
    <>
      <Nav brand={content.settings?.brand_name ?? "Portfolio"} />
      <Hero hero={content.hero} settings={content.settings} />
      <About about={content.about} />
      <Experience items={content.experience} />
      <Projects projects={content.projects} />
      <Skills skills={content.skills} />
      <Certifications items={content.certifications} />
      <Testimonials items={content.testimonials} />
      <ResumeBand resume={content.resume} />
      <Contact settings={content.settings} />
      <Footer settings={content.settings} />
    </>
  );
}
