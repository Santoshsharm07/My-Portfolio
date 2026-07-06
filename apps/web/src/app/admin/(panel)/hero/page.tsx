"use client";

import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { heroConfig } from "@/components/admin/configs";

export default function HeroAdmin() {
  return (
    <SingletonEditor
      path={heroConfig.path}
      title={heroConfig.title}
      description={heroConfig.description}
      fields={heroConfig.fields}
      defaults={heroConfig.defaults}
    />
  );
}
