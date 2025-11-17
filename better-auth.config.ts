/**
 * Better Auth CLI configuration file
 *
 * Docs: https://www.better-auth.com/docs/concepts/cli
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { betterAuthOptions } from "./src/lib/better-auth/options";
import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .dev.vars
config({ path: resolve(process.cwd(), ".dev.vars") });

const { DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET } = process.env;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is required. Make sure it's set in your .dev.vars file or environment."
  );
}

if (!BETTER_AUTH_SECRET) {
  throw new Error(
    "BETTER_AUTH_SECRET environment variable is required. Make sure it's set in your .dev.vars file or environment."
  );
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  ...betterAuthOptions,
  database: drizzleAdapter(db, { provider: "pg" }),
  baseURL: BETTER_AUTH_URL || "http://localhost:8787",
  secret: BETTER_AUTH_SECRET,
});
