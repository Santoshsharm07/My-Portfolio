"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { projectConfig } from "@/components/admin/configs";

export default function ProjectsAdmin() {
  return <ResourceManager config={projectConfig} />;
}
