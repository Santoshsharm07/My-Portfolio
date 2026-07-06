"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/admin-api";
import { PageHeader } from "@/components/admin/AdminShell";
import type { ContactMessage } from "@portfolio/types";

const cards = [
  { path: "projects", label: "Projects", href: "/admin/projects" },
  { path: "skills", label: "Skills", href: "/admin/skills" },
  { path: "experience", label: "Experience", href: "/admin/experience" },
  { path: "certifications", label: "Certifications", href: "/admin/certifications" },
  { path: "testimonials", label: "Testimonials", href: "/admin/testimonials" },
];

export default function Dashboard() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    (async () => {
      const results = await Promise.all(
        cards.map((c) =>
          adminApi<unknown[]>(`/${c.path}`)
            .then((r) => [c.path, r.length] as const)
            .catch(() => [c.path, 0] as const),
        ),
      );
      setCounts(Object.fromEntries(results));
      await adminApi<ContactMessage[]>("/messages")
        .then(setMessages)
        .catch(() => {});
    })();
  }, []);

  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Overview of your portfolio content."
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <Link
            key={c.path}
            href={c.href}
            className="rounded-xl border border-base-800 bg-base-900/50 p-5 transition-colors hover:border-accent-500/40"
          >
            <div className="font-display text-3xl text-ink-50">
              {counts[c.path] ?? "—"}
            </div>
            <div className="mt-1 text-sm text-ink-500">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg text-ink-50">
            Recent messages{" "}
            {unread > 0 && (
              <span className="ml-2 rounded-full bg-accent-500/20 px-2 py-0.5 text-xs text-accent-300">
                {unread} unread
              </span>
            )}
          </h2>
          <Link
            href="/admin/messages"
            className="text-sm text-ink-500 hover:text-accent-300"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-2">
          {messages.slice(0, 5).map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-lg border border-base-800 bg-base-900/40 px-4 py-3"
            >
              <div className="min-w-0">
                <span className="text-sm text-ink-100">{m.name}</span>
                <span className="ml-2 truncate text-sm text-ink-500">
                  {m.subject || m.message.slice(0, 60)}
                </span>
              </div>
              {!m.is_read && (
                <span className="h-2 w-2 shrink-0 rounded-full bg-accent-400" />
              )}
            </div>
          ))}
          {messages.length === 0 && (
            <p className="rounded-lg border border-base-800 px-4 py-8 text-center text-sm text-ink-500">
              No messages yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
