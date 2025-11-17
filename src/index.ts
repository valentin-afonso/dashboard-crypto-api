import { Hono } from "hono";
import { logger } from "hono/logger";
import { routes } from "./routes";
import { authMiddleware } from "./middleware/auth";
import { cors } from "hono/cors";
import { auth } from "./lib/better-auth";

const app = new Hono<{ Bindings: CloudflareBindings }>();

// Middleware
app.use("/api/*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:5173", "https://dashboard-crypto-app.pages.dev"],
  })
);
app.use("/api/*", authMiddleware);

// const app = new Hono<{ Bindings: CloudflareBindings }>();

app.on(["GET", "POST"], "/api/auth/*", (c) => {
  return auth(c.env).handler(c.req.raw);
});

// Routes handling
app.route("/api", routes);

// 404 handling
app.notFound((c) => {
  return c.json("404 Message", 404);
});

export default app;
