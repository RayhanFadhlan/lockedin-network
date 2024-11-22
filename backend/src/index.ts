import { serve } from "@hono/node-server";
import { swaggerUI } from "@hono/swagger-ui";
import { OpenAPIHono, createRoute } from "@hono/zod-openapi";
import { HttpError } from "./lib/errors.js";
import authRouter from "./routes/auth.route.js";

const app = new OpenAPIHono({ strict: false });


app.route("api", authRouter);



app.onError((err, c) => {
  if(err instanceof HttpError) {
    return err.getResponse();
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

app.get("/docs", swaggerUI({ url: "/openapi" }));

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
