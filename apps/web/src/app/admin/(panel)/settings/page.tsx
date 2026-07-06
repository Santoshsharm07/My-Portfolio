"use client";

import { SingletonEditor } from "@/components/admin/SingletonEditor";
import { settingsConfig } from "@/components/admin/configs";

export default function SettingsAdmin() {
  return (
    <SingletonEditor
      path={settingsConfig.path}
      title={settingsConfig.title}
      description={settingsConfig.description}
      fields={settingsConfig.fields}
      defaults={settingsConfig.defaults}
    />
  );
}
