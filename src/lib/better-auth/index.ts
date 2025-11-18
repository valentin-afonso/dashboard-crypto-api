import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { betterAuthOptions } from "./options";
import * as schema from "../../db/schema";

/**
 * Better Auth Instance
 */
export const auth = (
  env: CloudflareBindings
): ReturnType<typeof betterAuth> => {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  if (!env.BETTER_AUTH_SECRET) {
    throw new Error("BETTER_AUTH_SECRET environment variable is required");
  }
  if (!env.BETTER_AUTH_URL) {
    throw new Error("BETTER_AUTH_URL environment variable is required");
  }

  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql, { schema });

  return betterAuth({
    ...betterAuthOptions,
    database: drizzleAdapter(db, {
      provider: "pg",
      schema: {
        user: schema.user,
        session: schema.session,
        account: schema.account,
        verification: schema.verification,
      },
    }),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,

    // Additional options that depend on env ...
    trustedOrigins: [
      "http://localhost:5173",
      "https://dashboard-crypto-app.pages.dev",
    ],
  });
};
