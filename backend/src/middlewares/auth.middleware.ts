import { create } from "domain";
import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";
import { HttpError, HttpStatus } from "../lib/errors.js";

export const authMiddleware = createMiddleware(async (c, next) => {
  try {
    const jwtMiddleware = jwt({
      secret: process.env.JWT_SECRET as string,
    });

    await jwtMiddleware(c, next);
  } catch (error) {
    throw new HttpError(HttpStatus.UNAUTHORIZED, { message: 'Invalid JWT token' });
  }
})