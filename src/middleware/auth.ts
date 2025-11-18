import { bearerAuth } from "hono/bearer-auth";
import { Context, Next } from "hono";
import { EnvBindings } from "../types/env";

export async function authMiddleware(
  c: Context<{ Bindings: EnvBindings }>,
  next: Next
) {
  // Skip authentication for Better Auth routes

  if (c.req.path.startsWith("/api/auth/")) {
    return next();
  }

  const token = c.env.AUTH_TOKEN;
  if (!token) {
    return c.json({ error: "Missing AUTH_TOKEN" }, 500);
  }
  return bearerAuth({ token })(c, next);
}
