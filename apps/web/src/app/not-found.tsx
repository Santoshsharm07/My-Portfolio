import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <span className="font-display text-[22vw] leading-none text-base-800 md:text-[12rem]">
        404
      </span>
      <h1 className="mt-4 text-2xl text-ink-50">This page drifted away.</h1>
      <p className="mt-3 text-ink-400">
        The link may be broken or the page may have moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-accent-500 px-7 py-3 text-sm font-medium text-base-950 transition-colors hover:bg-accent-400"
      >
        Back home
      </Link>
    </main>
  );
}
