"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { adminApi, tokenStore } from "@/lib/admin-api";
import type { AdminProfile } from "@portfolio/types";

interface AuthCtx {
  profile: AdminProfile | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let active = true;
    (async () => {
      if (!tokenStore.get()) {
        setLoading(false);
        return;
      }
      try {
        const data = await adminApi<{ profile: AdminProfile }>("/auth/me");
        if (active) setProfile(data.profile);
      } catch {
        tokenStore.clear();
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Route guard: bounce unauthenticated users to login (except the login page).
  useEffect(() => {
    if (loading) return;
    const onLogin = pathname === "/admin/login";
    if (!profile && !onLogin) router.replace("/admin/login");
    if (profile && onLogin) router.replace("/admin");
  }, [loading, profile, pathname, router]);

  async function login(username: string, password: string) {
    const data = await adminApi<{ profile: AdminProfile; token: string }>(
      "/auth/login",
      { method: "POST", body: { username, password } },
    );
    tokenStore.set(data.token);
    setProfile(data.profile);
    router.replace("/admin");
  }

  async function logout() {
    await adminApi("/auth/logout", { method: "POST" }).catch(() => {});
    tokenStore.clear();
    setProfile(null);
    router.replace("/admin/login");
  }

  return (
    <Ctx.Provider value={{ profile, loading, login, logout }}>
      {children}
    </Ctx.Provider>
  );
}
