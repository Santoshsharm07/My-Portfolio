import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDateRange(start: string, end: string | null): string {
  const fmt = (v: string) => {
    const [y, m] = v.split("-");
    if (!m) return y ?? v;
    const date = new Date(Number(y), Number(m) - 1, 1);
    return date.toLocaleString("en", { month: "short", year: "numeric" });
  };
  return `${fmt(start)} — ${end ? fmt(end) : "Present"}`;
}
