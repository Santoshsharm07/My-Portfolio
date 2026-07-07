import "server-only";
import { createClient } from "@supabase/supabase-js";
import ws from "ws";
import { serverEnv } from "./env";

// Polyfill WebSocket for Node.js 20 and below (used by @supabase/supabase-js).
if (!globalThis.WebSocket) {
  globalThis.WebSocket = ws as unknown as typeof WebSocket;
}

/**
 * Service-role client — bypasses RLS. Server-only; never expose this key to the
 * browser. Lives only inside route handlers / RSC.
 */
export const supabase = createClient(
  serverEnv.supabaseUrl,
  serverEnv.supabaseServiceKey,
  { auth: { autoRefreshToken: false, persistSession: false } },
);
