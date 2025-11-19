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
const allowedOrigins = [
  "http://localhost:5173",
  "https://dashboard-crypto-app.pages.dev",
];

app.options("/api/auth/*", async (c) => {
  const origin = c.req.header("Origin");
  if (origin && allowedOrigins.includes(origin)) {
    return c.newResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "600",
      },
    });
  }
  return c.newResponse(null, 204);
});

app.all("/api/auth/*", async (c) => {
  const response = await auth(c.env).handler(c.req.raw);
  const origin = c.req.header("Origin");

  // Clone the response to add CORS headers
  const newResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

  // Add CORS headers if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    newResponse.headers.set("Access-Control-Allow-Origin", origin);
    newResponse.headers.set("Access-Control-Allow-Credentials", "true");
    newResponse.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    newResponse.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  return newResponse;
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
