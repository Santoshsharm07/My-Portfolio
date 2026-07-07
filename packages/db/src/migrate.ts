import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { createSql } from "./client.js";

const here = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = resolve(here, "../migrations");
const reset = process.argv.includes("--reset");

async function main() {
  const sql = createSql();
  try {
    if (reset) {
      console.log("⚠️  --reset: dropping public schema…");
      await sql.unsafe(`drop schema public cascade; create schema public;`);
    }

    try {
      await sql.unsafe(`
        ALTER TYPE skill_category ADD VALUE IF NOT EXISTS 'programming';
        ALTER TYPE skill_category ADD VALUE IF NOT EXISTS 'ai_genai';
        ALTER TYPE skill_category ADD VALUE IF NOT EXISTS 'frameworks';
        ALTER TYPE skill_category ADD VALUE IF NOT EXISTS 'data_analytics';
        ALTER TYPE skill_category ADD VALUE IF NOT EXISTS 'databases';
        ALTER TYPE skill_category ADD VALUE IF NOT EXISTS 'cloud_mlops';
        ALTER TYPE skill_category ADD VALUE IF NOT EXISTS 'ai_apis';
        ALTER TYPE skill_category ADD VALUE IF NOT EXISTS 'domain_expertise';
      `);
    } catch (e) {
      // Ignored if type doesn't exist yet (will be created in init migration)
    }

    await sql`
      create table if not exists _migrations (
        name text primary key,
        applied_at timestamptz not null default now()
      )`;

    const applied = new Set(
      (await sql`select name from _migrations`).map((r) => r.name as string),
    );

    const files = (await readdir(MIGRATIONS_DIR))
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      if (applied.has(file)) {
        console.log(`• skip   ${file}`);
        continue;
      }
      const content = await readFile(join(MIGRATIONS_DIR, file), "utf8");
      process.stdout.write(`→ apply  ${file} … `);
      await sql.begin(async (tx) => {
        await tx.unsafe(content);
        await tx`insert into _migrations ${sql({ name: file })}`;
      });
      console.log("done");
    }
    console.log("✅ Migrations complete");
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
