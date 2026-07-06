"use client";

import { useState } from "react";
import { useAuth } from "@/components/admin/AuthProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base-950 px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-display text-2xl text-ink-50">
            Portfolio<span className="text-accent-500">.</span>cms
          </div>
          <p className="mt-2 text-sm text-ink-500">Sign in to manage content</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-2xl border border-base-800 bg-base-900/60 p-7"
        >
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-ink-500">
              Username
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              className="w-full rounded-lg border border-base-700 bg-base-950 px-3 py-2.5 text-ink-100 outline-none focus:border-accent-500/60"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-widest text-ink-500">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-base-700 bg-base-950 px-3 py-2.5 text-ink-100 outline-none focus:border-accent-500/60"
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-accent-500 py-2.5 text-sm font-medium text-base-950 transition-colors hover:bg-accent-400 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
