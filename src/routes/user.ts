import { Hono } from "hono";

const userRoutes = new Hono();

userRoutes.get("/", async (c) => {
  return c.json({ message: "User data retrieved" });
});

export { userRoutes };
