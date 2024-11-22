import { HttpError, HttpStatus } from "../lib/errors.js";
import { createUser, findUserByEmail, findUserByUsername } from "../repositories/user.repository.js";


export const register = async (username: string, email: string, password: string) => {
 
    const usernameExists = await findUserByUsername(username);
    if (usernameExists) {
     throw new HttpError(400 , { message: 'Username already exists' });
    }

    const emailExists = await findUserByEmail(email);
    if (emailExists) {
      throw new HttpError(400 , { message: 'Email already exists' });
    }

    await createUser(username, email, password);

    const token = "123456"
    return token

};