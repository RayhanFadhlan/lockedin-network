import { decode, verify } from "hono/jwt";
import {
  findUserbyId,
  updateUserDetail,
} from "../repositories/user.repository.js";
import { HttpError, HttpStatus } from "../lib/errors.js";
import {
  getConnectionCount,
  getRelationStatus,
  isUserConnected,
} from "../repositories/connection.repository.js";
import { getFeedsByUserId } from "../repositories/feed.repository.js";
import { createFile, deleteFile } from "../lib/storage.js";

export const getProfile = async (userId: string, token: string | undefined) => {
  const user = await findUserbyId(userId);
  if (!user) {
    throw new HttpError(HttpStatus.BAD_REQUEST, { message: "User not found" });
  }
  const connectionCount = await getConnectionCount(userId);
  if (!token) {
    return {
      success: true,
      body: {
        id: Number(user.id),
        username: user.username,
        name: user.name,
        profile_photo: user.profile_photo,
        connection_count: connectionCount,
        work_history: user.work_history,
        skills: user.skills,
        relation: "unauthorized",
        relation_to : "unauthorized",
      },
    };
  } else {
    // const token = authHeader.split(" ")[1];
    const payload = await verify(token, process.env.JWT_SECRET as string);
    const userId2 = payload.userId as string;

    const connection = await isUserConnected(userId, userId2);
    const relation = await getRelationStatus(userId2, userId);

    // Pemilik Profil (Terautentikasi)
    const feeds = await getFeedsByUserId(userId);
    if (userId === userId2) {
      return {
        success: true,
        body: {
          id: Number(user.id),
          username: user.username,
          name: user.name,
          email: user.email,
          profile_photo: user.profile_photo,
          work_history: user.work_history,
          skills: user.skills,
          connection_count: connectionCount,
          relevant_posts: feeds,
          relation: "owner",
          relation_to : "owner",
        },
      };
    }
    // Pengguna Lain Tidak Terkoneksi (Terautentikasi)
    else if (!connection) {
      return {
        success: true,
        body: {
          id: Number(user.id),
          username: user.username,
          name: user.name,
          profile_photo: user.profile_photo,
          connection_count: connectionCount,
          work_history: user.work_history,
          
          skills: user.skills,
          relevant_posts: feeds,
          relation: "unconnected",
          relation_to : relation,
        },
      };
    }
    // Pengguna Terkoneksi (Terautentikasi)
    else {
      const feeds = await getFeedsByUserId(userId);
      return {
        success: true,
        body: {
          id: Number(user.id),
          username: user.username,
          name: user.name,
          profile_photo: user.profile_photo,
          connection_count: connectionCount,
          work_history: user.work_history,
          skills: user.skills,
          relevant_posts: feeds,
          relation: "connected",
          relation_to : relation,
        },
      };
    }
  }
};

export const updateProfile = async (
  userId: string,
  username: string,
  profilePhoto: File,
  name: string,
  workHistory: string,
  skills: string,
  userIdToken: string
) => {
  const user = await findUserbyId(userId);
  if (!user) {
    throw new HttpError(HttpStatus.BAD_REQUEST, { message: "User not found" });
  }

  if (userId !== userIdToken) {
    throw new HttpError(HttpStatus.UNAUTHORIZED, { message: "Unauthorized" });
  }
  if (user.profile_photo) {
    console.log("delete file");
    const oldPhoto = user.profile_photo;
    console.log("delete file", oldPhoto);
    await deleteFile(oldPhoto);
  }

  const filePath = await createFile(profilePhoto);

  const userDetail = await updateUserDetail(
    userId,
    username,
    filePath,
    name,
    workHistory,
    skills
  );

  return {
    success: true,
    body: userDetail,
  };
};
