import { Hono } from "hono";
import { logger } from "hono/logger";
import { routes } from "./routes";
import { authMiddleware } from "./middleware/auth";
import { EnvBindings } from "./types/env";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: EnvBindings }>();

// Middleware
app.use("/api/*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "https://dashboard-crypto-app.pages.dev"],
  })
);
app.use("/api/*", authMiddleware);

// Routes handling
app.route("/api", routes);

// 404 handling
app.notFound((c) => {
  return c.json("404 Message", 404);
});

export default app;
