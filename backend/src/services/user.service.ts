import { verify } from "hono/jwt";
import { findUsers } from "../repositories/user.repository.js";
import { getMutualCount, isUserConnected } from "../repositories/connection.repository.js";
import { get } from "http";

export const searchUsers = async (
  token: string | undefined,
  searchQuery?: string,
) => {
  const users = await findUsers(searchQuery);
  if (!token) {

    return {
      users : users.map(user => {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          profile_photo: user.profile_photo,
        };
      }),
      authenticated : false,
    }
  }
  else {
    const decoded = await verify(token, process.env.JWT_SECRET as string);
    const userId = decoded.userId as string;

    const usersWithConnectionStatus = await Promise.all(users.map(async user => {
      const isConnected = await isUserConnected(userId, user.id.toString());
      const connectionCount = await getMutualCount( user.id.toString(), userId);
      return {
        id: user.id,
        name: user.name,
        profile_photo: user.profile_photo,
        isConnected: !!isConnected,
        mutual : connectionCount.toString(), 
      };
    }));

    return {
      users : usersWithConnectionStatus,
      authenticated : true,
    }

  }

  
};
