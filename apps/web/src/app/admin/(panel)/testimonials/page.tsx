"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { testimonialConfig } from "@/components/admin/configs";

export default function TestimonialsAdmin() {
  return <ResourceManager config={testimonialConfig} />;
}
