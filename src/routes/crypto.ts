import { Hono } from "hono";
import { proxy } from "hono/proxy";
import { EnvBindings } from "../types/env";
import { getCoingeckoUrl } from "../utils/coingecko";

const cryptoRoutes = new Hono<{ Bindings: EnvBindings }>();

cryptoRoutes.get(`/coins/supported_vs_currencies`, async (c) => {
  return proxy(getCoingeckoUrl(c, "simple/supported_vs_currencies"));
});

// Get all coins markets for table view
cryptoRoutes.get(`/coins/markets`, async (c) => {
  const { vs_currency, sparkline } = c.req.query();
  return proxy(getCoingeckoUrl(c, "coins/markets", { vs_currency, sparkline }));
});

// Get all markets for a specific coin for teaser view
cryptoRoutes.get(`/coins/:symbol/markets`, async (c) => {
  const symbol = c.req.param("symbol");
  const { vs_currency, days } = c.req.query();
  return proxy(
    getCoingeckoUrl(c, `coins/${symbol}/market_chart`, { vs_currency, days })
  );
});

// Get a specific coin for detail page
cryptoRoutes.get(`/coins/:id`, async (c) => {
  const id = c.req.param("id");
  const { vs_currency } = c.req.query();
  return proxy(getCoingeckoUrl(c, `coins/${id}`, { vs_currency }));
});

export { cryptoRoutes };
