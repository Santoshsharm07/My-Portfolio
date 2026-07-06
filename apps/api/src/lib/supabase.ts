import { createClient } from "@supabase/supabase-js";
import { env } from "../config/env.js";
import ws from "ws";

// Polyfill WebSocket globally for Node.js 20 and below
if (!globalThis.WebSocket) {
  globalThis.WebSocket = ws as any;
}

/**
 * Service-role client — bypasses RLS. Server-only; never expose this key.
 */
export const supabase = createClient(env.supabaseUrl, env.supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});


