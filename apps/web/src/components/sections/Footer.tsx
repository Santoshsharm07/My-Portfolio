import type { SiteSettings } from "@portfolio/types";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  const year = 2026;
  const brand = settings?.brand_name ?? "Portfolio";
  return (
    <footer className="border-t border-base-600 py-12">
      <div className="container-lux flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-2 font-display text-lg font-medium text-ink-100">
          <span className="h-2 w-2 bg-accent-500" />
          Santosh Sharma
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-ink-500">
          © {year} Santosh Sharma — Portfolio
        </p>
        <div className="flex gap-5 font-mono text-xs uppercase tracking-widest text-ink-500">
          {(settings?.socials ?? []).map((s) => (
            <a
              key={s.url}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="transition-colors hover:text-accent-500"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
