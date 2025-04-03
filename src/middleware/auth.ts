import { bearerAuth } from "hono/bearer-auth";
import { Context, Next } from "hono";

type Bindings = {
  AUTH_TOKEN: string;
};

export async function authMiddleware(
  c: Context<{ Bindings: Bindings }>,
  next: Next
) {
  const token = c.env.AUTH_TOKEN;
  if (!token) {
    return c.json({ error: "Missing AUTH_TOKEN" }, 500);
  }
  return bearerAuth({ token })(c, next);
}
