import { OpenAPIHono } from "@hono/zod-openapi";
import { ZodError } from "zod";
import type { JwtVariables } from "hono/jwt";

type Variables = JwtVariables;


(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

function createHono() {
  return new OpenAPIHono<{ Variables: Variables }>({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            success: false,
            message: formatZodError(result.error),
            error: result.error,
          },
          400
        );
      }
    },
  });
}

function formatZodError(error: ZodError) {
  return error.issues.map((issue) => issue.message).join(", ");
}

export { createHono };
