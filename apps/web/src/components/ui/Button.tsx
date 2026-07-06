import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

const variants = {
  primary:
    "bg-accent-500 text-base-950 hover:-translate-y-0.5 hover:shadow-brutal-ink",
  ghost:
    "border border-base-600 text-ink-100 hover:border-accent-500 hover:text-accent-500",
  solid: "bg-ink-50 text-base-950 hover:bg-ink-100 hover:-translate-y-0.5",
} as const;

interface BaseProps {
  variant?: keyof typeof variants;
  className?: string;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: BaseProps & ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-none px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest transition-all duration-300",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  className,
  children,
  href,
  ...rest
}: BaseProps & ComponentProps<typeof Link>) {
  return (
    <Link
      href={href}
      data-cursor="hover"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-none px-6 py-3 font-mono text-xs font-medium uppercase tracking-widest transition-all duration-300",
        variants[variant],
        className,
      )}
      {...rest}
    >
      {children}
    </Link>
  );
}
