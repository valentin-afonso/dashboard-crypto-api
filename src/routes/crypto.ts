import { Hono } from "hono";
import { proxy } from "hono/proxy";
import { coingeckoAuth } from "../middleware/coingecko-auth";

const cryptoRoutes = new Hono();
const base_url = "https://api.coingecko.com/api/v3/";

// Apply middleware
cryptoRoutes.use("*", coingeckoAuth());

cryptoRoutes.get(`/coins/markets`, async (c) => {
  const { vs_currency } = c.req.query();
  const { sparkline } = c.req.query();
  return proxy(
    `${base_url}coins/markets?vs_currency=${vs_currency}&sparkline=${sparkline}`
  );
});

export { cryptoRoutes };
