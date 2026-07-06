import postgres from "postgres";
import { DB_URL } from "./env.js";

/**
 * Direct Postgres client for migrations/seed (Node scripts).
 * The API uses the Supabase JS client instead.
 */
export function createSql() {
  return postgres(DB_URL(), {
    ssl: "require",
    max: 4,
    onnotice: () => {},
  });
}
