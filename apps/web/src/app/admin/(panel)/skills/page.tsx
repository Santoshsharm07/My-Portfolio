"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { skillConfig } from "@/components/admin/configs";

export default function SkillsAdmin() {
  return <ResourceManager config={skillConfig} />;
}
