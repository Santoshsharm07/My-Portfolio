"use client";

import { ResourceManager } from "@/components/admin/ResourceManager";
import { certificationConfig } from "@/components/admin/configs";

export default function CertificationsAdmin() {
  return <ResourceManager config={certificationConfig} />;
}
