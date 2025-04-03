import { Hono } from "hono";

const favoritesRoutes = new Hono();

favoritesRoutes.post("/", async (c) => {
  return c.json({ message: "Crypto added to favorites" });
});

favoritesRoutes.get("/", async (c) => {
  return c.json({ message: "List of favorite cryptos" });
});

export { favoritesRoutes };
