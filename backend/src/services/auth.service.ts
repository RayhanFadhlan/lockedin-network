import { HttpError, HttpStatus } from "../lib/errors.js";
import { createUser, findUserByEmail, findUserByUsername } from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import { sign } from 'hono/jwt';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const register = async (username: string, email: string, password: string, name : string) => {
  const usernameExists = await findUserByUsername(username);
  if (usernameExists) {
    throw new HttpError(HttpStatus.CONFLICT, { message: 'Username already exists' });
  }

  const emailExists = await findUserByEmail(email);
  if (emailExists) {
    throw new HttpError(HttpStatus.CONFLICT, { message: 'Email already exists' });
  }

  const hashedPassword = await hashPassword(password);
  const user = await createUser(username, email, name, hashedPassword);

  const payload = {
    userId: user.id.toString(), 
    email: user.email,
    iat: Math.floor(Date.now() / 1000), 
    exp: Math.floor(Date.now() / 1000) + 3600, 
  };

  const token = await sign(payload, JWT_SECRET);
  return token;
};

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};