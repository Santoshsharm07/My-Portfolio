"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { seoConfig } from "@/components/admin/configs";

export default function SeoAdmin() {
  return <ResourceManager config={seoConfig} />;
}
