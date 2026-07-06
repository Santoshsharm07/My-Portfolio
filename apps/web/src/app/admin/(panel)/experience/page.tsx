"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { experienceConfig } from "@/components/admin/configs";

export default function ExperienceAdmin() {
  return <ResourceManager config={experienceConfig} />;
}
