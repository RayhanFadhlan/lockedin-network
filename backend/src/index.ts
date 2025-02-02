import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono } from "@hono/zod-openapi";
import { HttpError } from "./lib/errors.js";
import authRouter from "./routes/auth.route.js";
import { logger } from "hono/logger";
import profileRouter from "./routes/profile.route.js";
import { HTTPException } from "hono/http-exception";
import userRouter from "./routes/user.route.js";
import { cors } from "hono/cors";
import { connectionRouter } from "./routes/connection.route.js";
import { serveStatic } from "@hono/node-server/serve-static";
import feedRouter from "./routes/feed.route.js";
import notificationRouter from "./routes/notification.route.js";
import { initSocketServer } from "./services/chat.service.js";
import { Server as HttpServer } from "node:http";
import { createServer } from 'node:http2'
import chatRouter from "./routes/chat.route.js";
import { timeout } from "hono/timeout";
import { compress } from 'hono/compress'

const main = new OpenAPIHono();

const app = main.basePath("/api");




main.use("/uploads/*", serveStatic({ root: "./" }));

// app.use(logger());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    exposeHeaders: ["Location"],
  })
);
app.use(compress());
// app.use(timeout(10000));

app.get("/tes", (c) => {
  return c.json({ message: BigInt(12345678901234567890) });
});

main.get("/health", (c) => {
  return c.json({
    success: true,
    message: "health ok!"
  })
})
app.get("/health", async (c) => {
  await new Promise((resolve) => setTimeout(resolve, 10000)); 
  return c.json({
    success: true,
    message: "health ok!"
  })
})

app.route("/", authRouter);
app.route("/", profileRouter);
app.route("/", userRouter);
app.route("/", connectionRouter);
app.route("/", feedRouter);
app.route("/", chatRouter);
app.route("/", notificationRouter);

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
    console.log(err);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        error: null,
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


export const httpServer = serve({
  fetch: app.fetch,
  port,
  // createServer
});


initSocketServer(httpServer as HttpServer);

