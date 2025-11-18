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
    credentials: true,
  })
);
app.use("/api/*", authMiddleware);

// Better Auth routes (must be defined before other /api routes)
app.use(
  "/api/auth/*",
  cors({
    origin: ["http://localhost:5173", "https://dashboard-crypto-app.pages.dev"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
app.on(["GET", "POST"], "/api/auth/*", async (c) => {
  const response = await auth(c.env).handler(c.req.raw);
  return response;
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
