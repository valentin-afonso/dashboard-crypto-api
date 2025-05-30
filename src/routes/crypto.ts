import { Hono } from "hono";
import { proxy } from "hono/proxy";
import { EnvBindings } from "../types/env";
import { getCoingeckoUrl } from "../utils/coingecko";

const cryptoRoutes = new Hono<{ Bindings: EnvBindings }>();

cryptoRoutes.get(`/coins/supported_vs_currencies`, async (c) => {
  return proxy(getCoingeckoUrl(c, "simple/supported_vs_currencies"));
});
cryptoRoutes.get(`/coins/markets`, async (c) => {
  const { vs_currency, sparkline } = c.req.query();
  return proxy(getCoingeckoUrl(c, "coins/markets", { vs_currency, sparkline }));
});

cryptoRoutes.get(`/coins/:symbol/markets`, async (c) => {
  const symbol = c.req.param("symbol");
  const { vs_currency, days } = c.req.query();
  return proxy(
    getCoingeckoUrl(c, `coins/${symbol}/market_chart`, { vs_currency, days })
  );
});
export { cryptoRoutes };
