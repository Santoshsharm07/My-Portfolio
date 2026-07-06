"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useAuth } from "./AuthProvider";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/admin" },
  { label: "Hero", href: "/admin/hero" },
  { label: "About", href: "/admin/about" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Experience", href: "/admin/experience" },
  { label: "Skills", href: "/admin/skills" },
  { label: "Certifications", href: "/admin/certifications" },
  { label: "Testimonials", href: "/admin/testimonials" },
  { label: "Résumé", href: "/admin/resume" },
  { label: "Media", href: "/admin/media" },
  { label: "SEO", href: "/admin/seo" },
  { label: "Messages", href: "/admin/messages" },
  { label: "Settings", href: "/admin/settings" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { profile, loading, logout } = useAuth();
  const pathname = usePathname();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base-950 text-ink-500">
        Loading…
      </div>
    );
  }
  if (!profile) return null; // AuthProvider redirects

  return (
    <div className="min-h-screen bg-base-950 text-ink-100">
      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-base-800 bg-base-900/60 p-5 md:flex">
          <Link href="/admin" className="mb-8 font-display text-lg text-ink-50">
            Portfolio<span className="text-accent-500">.</span>cms
          </Link>
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {nav.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-accent-500/10 text-accent-300"
                      : "text-ink-400 hover:bg-base-800 hover:text-ink-100",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-4 border-t border-base-800 pt-4">
            <div className="mb-3 px-3 text-xs text-ink-500">
              @{profile.username}
            </div>
            <button
              onClick={logout}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-ink-400 hover:bg-base-800 hover:text-danger"
            >
              Sign out
            </button>
            <Link
              href="/"
              target="_blank"
              className="mt-1 block rounded-lg px-3 py-2 text-sm text-ink-500 hover:text-accent-300"
            >
              View site ↗
            </Link>
          </div>
        </aside>

        {/* Content */}
        <main className="min-w-0 flex-1 px-6 py-8 md:px-10">
          {/* Mobile nav */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2 md:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-full border border-base-700 px-3 py-1.5 text-xs text-ink-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl text-ink-50">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-ink-500">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
