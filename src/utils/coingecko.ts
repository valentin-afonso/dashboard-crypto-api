import { Context } from "hono";
import { EnvBindings } from "../types/env";

const BASE_URL = "https://api.coingecko.com/api/v3/";

export const getCoingeckoUrl = (
  c: Context<{ Bindings: EnvBindings }>,
  endpoint: string,
  params?: Record<string, string>
) => {
  const queryParams = new URLSearchParams(params);
  queryParams.set("x_cg_demo_api_key", c.env.API_KEY_COINGECKO);

  return `${BASE_URL}${endpoint}?${queryParams.toString()}`;
};
