import { findUsers } from "../repositories/user.repository.js";

export const searchUsers = async (searchQuery?: string) => {
  const users = await findUsers(searchQuery);

  return users;
};