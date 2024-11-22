import { OpenAPIHono } from "@hono/zod-openapi";
import { ZodError } from "zod";

function createHono() {
  return new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json({
          success: false,
          message: formatZodError(result.error),
          error: result.error,
        }, 400);
      }
    }
  });
}

function formatZodError(error: ZodError) {
  return error.issues.map(issue => ( issue.message )).join(", ");
}

export { createHono };