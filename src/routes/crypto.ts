import { Hono } from "hono";

const cryptoRoutes = new Hono();

cryptoRoutes.get("/", async (c) => {
  return c.json({ message: "Crypto market data retrieved" });
});

export { cryptoRoutes };
