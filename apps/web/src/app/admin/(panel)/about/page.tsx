"use client";

import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { aboutConfig } from "@/components/admin/configs";

export default function AboutAdmin() {
  return (
    <SingletonEditor
      path={aboutConfig.path}
      title={aboutConfig.title}
      description={aboutConfig.description}
      fields={aboutConfig.fields}
      defaults={aboutConfig.defaults}
    />
  );
}
