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


const app = new OpenAPIHono().basePath("/api");

app.use(logger())

app.route("/", authRouter);
app.route("/", profileRouter);
app.route("/", userRouter);

app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
  type: 'http',
  scheme: 'bearer',
});


app.onError((err, c) => {
  if(err instanceof HttpError || err instanceof HTTPException) {
    return c.json({
      success : false,
      message : err.message,
      error : err.message
    }, err.status)
  }
  else {
    return c.json({
      success: false,
      message: "Internal server error",
      error: err.message
    }, 500)
  }
});

app.doc("/openapi", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
});

app.get(
  '/docs',
  apiReference({
    theme: 'purple',
    spec: {
      url: '/api/openapi',
    },
  }),
)



const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
