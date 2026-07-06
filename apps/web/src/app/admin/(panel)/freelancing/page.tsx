"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { freelanceConfig } from "@/components/admin/configs";

export default function FreelancingAdmin() {
  return <ResourceManager config={freelanceConfig} />;
}
