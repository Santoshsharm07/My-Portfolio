import { Router } from "express";
import { supabase } from "../lib/supabase.js";
import { asyncHandler } from "../middleware/error.js";
import { validateBody } from "../middleware/validate.js";
import { contactMessageCreate } from "@portfolio/types";
import { badRequest, notFound } from "../lib/http-error.js";
import { env } from "../config/env.js";
import { logger } from "../lib/logger.js";
import {
  demoHome,
  demoProjectBySlug,
  demoSeoByKey,
} from "../lib/demo-content.js";

/**
 * Public read endpoints (consumed by Next RSC or the browser). Only published
 * content is returned. Also hosts the public contact form submission.
 */
export const publicRouter: import("express").Router = Router();

publicRouter.get(
  "/content/home",
  asyncHandler(async (_req, res) => {
    if (env.isDemo) {
      res.json({ data: demoHome });
      return;
    }
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

    res.json({
      data: {
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
      },
    });
  }),
);

publicRouter.get(
  "/projects",
  asyncHandler(async (_req, res) => {
    if (env.isDemo) {
      res.json({ data: demoHome.projects });
      return;
    }
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_published", true)
      .order("sort_order");
    if (error) throw error;
    res.json({ data });
  }),
);

publicRouter.get(
  "/projects/:slug",
  asyncHandler(async (req, res) => {
    if (env.isDemo) {
      const demo = demoProjectBySlug(req.params.slug ?? "");
      if (!demo) throw notFound("Project");
      res.json({ data: demo });
      return;
    }
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", req.params.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (!project) throw notFound("Project");

    const { data: caseStudy } = await supabase
      .from("case_studies")
      .select("*")
      .eq("project_id", project.id)
      .maybeSingle();

    res.json({ data: { project, caseStudy } });
  }),
);

publicRouter.get(
  "/resume/active",
  asyncHandler(async (_req, res) => {
    if (env.isDemo) {
      res.json({ data: { resume: demoHome.resume, file_url: null } });
      return;
    }
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
    res.json({ data: { resume, file_url } });
  }),
);

publicRouter.get(
  "/seo/:pageKey",
  asyncHandler(async (req, res) => {
    if (env.isDemo) {
      res.json({ data: demoSeoByKey(req.params.pageKey ?? "") });
      return;
    }
    const { data } = await supabase
      .from("seo_meta")
      .select("*")
      .eq("page_key", req.params.pageKey)
      .maybeSingle();
    res.json({ data });
  }),
);

publicRouter.post(
  "/messages",
  validateBody(contactMessageCreate),
  asyncHandler(async (req, res) => {
    const { name, email, subject, message, company } = req.body as {
      name: string;
      email: string;
      subject: string;
      message: string;
      company?: string;
    };
    // Honeypot: bots fill hidden `company` field.
    if (company) throw badRequest("Spam detected");

    if (env.isDemo) {
      logger.info({ name, email, subject }, "Demo contact submission (not persisted)");
      res.status(201).json({ data: { ok: true, demo: true } });
      return;
    }

    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
      ip: req.ip ?? null,
      user_agent: req.headers["user-agent"] ?? null,
    });
    if (error) throw error;
    res.status(201).json({ data: { ok: true } });
  }),
);
