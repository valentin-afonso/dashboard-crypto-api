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
    origin: [
      "http://localhost:5173",
      "https://coinboard-by.valafso.com",
      "https://valafso.com",
    ],
    credentials: true,
  })
);
app.use("/api/*", authMiddleware);

// Better Auth routes (must be defined before other /api routes)
app.all("/api/auth/*", async (c) => {
  return auth(c.env).handler(c.req.raw);
});

// Routes handling
app.route("/api", routes);

// Error handling
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal server error", message: err.message }, 500);
});

// 404 handling
app.notFound((c) => {
  return c.json("404 Message", 404);
});

export default app;
