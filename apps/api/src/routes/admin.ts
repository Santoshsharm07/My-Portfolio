import { Router } from "express";
import { requireAdmin } from "../middleware/auth.js";
import { crudRouter } from "../services/crud-router.js";
import {
  projectCreate,
  projectUpdate,
  skillCreate,
  skillUpdate,
  experienceCreate,
  experienceUpdate,
  certificationCreate,
  certificationUpdate,
  testimonialCreate,
  testimonialUpdate,
  seoMetaUpsert,
} from "@portfolio/types";
import { heroRouter, aboutRouter, siteSettingsRouter } from "./singletons.js";
import { caseStudiesRouter } from "./case-studies.js";
import { mediaRouter } from "./media.js";
import { resumeRouter } from "./resume.js";
import { messagesRouter } from "./messages.js";

/** All admin routes — guarded as a whole. */
export const adminRouter: import("express").Router = Router();
adminRouter.use(requireAdmin);

// Singletons
adminRouter.use("/site-settings", siteSettingsRouter);
adminRouter.use("/hero", heroRouter);
adminRouter.use("/about", aboutRouter);

// Collections (generic CRUD)
adminRouter.use(
  "/projects",
  crudRouter({
    table: "projects",
    createSchema: projectCreate,
    updateSchema: projectUpdate,
    revalidateTags: ["projects", "home"],
    reorderable: true,
  }),
);
adminRouter.use(
  "/skills",
  crudRouter({
    table: "skills",
    createSchema: skillCreate,
    updateSchema: skillUpdate,
    revalidateTags: ["skills", "home"],
    reorderable: true,
  }),
);
adminRouter.use(
  "/experience",
  crudRouter({
    table: "experience",
    createSchema: experienceCreate,
    updateSchema: experienceUpdate,
    revalidateTags: ["experience", "home"],
    reorderable: true,
  }),
);
adminRouter.use(
  "/certifications",
  crudRouter({
    table: "certifications",
    createSchema: certificationCreate,
    updateSchema: certificationUpdate,
    revalidateTags: ["certifications", "home"],
    reorderable: true,
  }),
);
adminRouter.use(
  "/testimonials",
  crudRouter({
    table: "testimonials",
    createSchema: testimonialCreate,
    updateSchema: testimonialUpdate,
    revalidateTags: ["testimonials", "home"],
    reorderable: true,
  }),
);
adminRouter.use(
  "/seo",
  crudRouter({
    table: "seo_meta",
    createSchema: seoMetaUpsert,
    updateSchema: seoMetaUpsert.partial(),
    orderBy: { column: "page_key", ascending: true },
    revalidateTags: ["seo"],
  }),
);

// Bespoke routers
adminRouter.use("/case-studies", caseStudiesRouter);
adminRouter.use("/media", mediaRouter);
adminRouter.use("/resume", resumeRouter);
adminRouter.use("/messages", messagesRouter);
