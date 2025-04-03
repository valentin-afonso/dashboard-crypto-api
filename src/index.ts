import { Hono } from "hono";
import { logger } from "hono/logger";
import { routes } from "./routes";
import { authMiddleware } from "./middleware/auth";

type Bindings = {
  AUTH_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Middleware
app.use("/api/*", logger());
app.use("/api/*", authMiddleware);

// Routes handling
app.route("/api", routes);

// 404 handling
app.notFound((c) => {
  return c.json("404 Message", 404);
});

export default app;
