import { Context, Next } from "hono";
import { EnvBindings } from "../types/env";

export const coingeckoAuth = () => {
  return async (c: Context<{ Bindings: EnvBindings }>, next: Next) => {
    const apiKey = c.env.API_KEY_COINGECKO;
    if (!apiKey) {
      return c.json({ error: "COINGECKO_API_KEY is not configured" }, 500);
    }
    c.header("x-cg-demo-api-key", apiKey);

    await next();
  };
};
