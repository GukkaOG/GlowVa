// `drizzle-kit push` diffs the local schema against the live DB and offers to
// drop anything missing. Since the Neon DB is shared by SkinRenew, AiNovaSkin,
// LumeaAi and GlowVa, push would propose to drop the other sites' tables and
// destroy their data. We disable the npm script and force a manual workflow.

console.error("");
console.error("  db:push is DISABLED for this project.");
console.error("");
console.error("  The Neon database is shared with SkinRenew (aihaloskin),");
console.error("  AiNovaSkin, LumeaAi and GlowVa. Running drizzle-kit push");
console.error("  would offer to DROP tables owned by the other sites.");
console.error("");
console.error("  Workflow for schema changes:");
console.error("    1. Edit db/schema.ts");
console.error("    2. Run `npm run db:generate` to produce SQL");
console.error("    3. Open the generated file in db/migrations/");
console.error("    4. Keep ONLY the statements for tables owned by this site");
console.error("       (users / password_resets are shared - coordinate first)");
console.error("    5. Apply the trimmed SQL in the Neon console SQL editor");
console.error("");
process.exit(1);
