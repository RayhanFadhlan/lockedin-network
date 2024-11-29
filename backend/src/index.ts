import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { HttpError } from "./lib/errors.js";
import authRouter from "./routes/auth.route.js";
import { Hono } from "hono";
import { logger } from "hono/logger";
import profileRouter from "./routes/profile.route.js";
import { HTTPException } from "hono/http-exception";
import { apiReference } from "@scalar/hono-api-reference";
import userRouter from "./routes/user.route.js";
import { cors } from "hono/cors";
import { connectionRouter } from "./routes/connection.route.js";
import { serveStatic } from "@hono/node-server/serve-static";
import feedRouter from "./routes/feed.route.js";

const main = new OpenAPIHono();

const app = main.basePath("/api");

main.use(
  "/uploads/*",
  serveStatic({root: "./"})
);

app.use(logger());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposeHeaders: ["Location"],
  })
);
app.route("/", authRouter);
app.route("/", profileRouter);
app.route("/", userRouter);
app.route("/", connectionRouter);
app.route("/", feedRouter);

app.openAPIRegistry.registerComponent("securitySchemes", "auth", {
  type: "http",
  scheme: "bearer",
});

app.openAPIRegistry;

app.onError((err, c) => {
  if (err instanceof HttpError || err instanceof HTTPException) {
    return c.json(
      {
        success: false,
        message: err.message,
        error: err.message,
      },
      err.status
    );
  } else {
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: err.message,
      },
      500
    );
  }
});

app.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "LockedIn",
  },
  security: [
    {
      auth: [],
    },
  ],
});

app.get("/docs", swaggerUI({ url: "/api/openapi" }));

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
