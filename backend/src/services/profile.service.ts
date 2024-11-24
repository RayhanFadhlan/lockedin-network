import { decode } from "hono/jwt";
import {
  findUserbyId,
  updateUserDetail,
} from "../repositories/user.repository.js";
import { HttpError, HttpStatus } from "../lib/errors.js";
import { isUserConnected } from "../repositories/connection.repository.js";
import { getFeedsByUserId } from "../repositories/feed.repository.js";
import { createFile, deleteFile } from "../lib/storage.js";

export const getProfile = async (
  userId: string,
  token: string | undefined
) => {
  const user = await findUserbyId(userId);
  if (!user) {
    throw new HttpError(HttpStatus.BAD_REQUEST, { message: "User not found" });
  }
  if (!token) {
    return {
      success: true,
      body: {
        name: user.name,
        profile_photo: user.profilePhoto,
        relation: "unauthorized",
      },
    };
  } else {
    // const token = authHeader.split(" ")[1];
    const { header, payload } = await decode(token);
    const userId2 = payload.userId as string;

    const connection = await isUserConnected(userId, userId2);

    // Pemilik Profil (Terautentikasi)
    if (userId === userId2) {
      const feeds = await getFeedsByUserId(userId);
      return {
        success: true,
        body: {
          name: user.name,
          email: user.email,
          profile_photo: user.profilePhoto,
     
          job_history: user.workHistory,
          skills: user.skills,
          relation: "owner",
          relevant_posts: feeds,
        },
      };
    }
    // Pengguna Lain Tidak Terkoneksi (Terautentikasi)
    else if (!connection) {
      return {
        success: true,
        body: {
          name: user.name,
          profile_photo: user.profilePhoto,
        
          job_history: user.workHistory,
          relation: "unconnected",
        },
      };
    }
    // Pengguna Terkoneksi (Terautentikasi)
    else {
      const feeds = await getFeedsByUserId(userId);
      return {
        success: true,
        body: {
          name: user.name,
          profile_photo: user.profilePhoto,
     
          job_history: user.workHistory,
          skills: user.skills,
          relation: "connected",
          relevant_posts: feeds,
        },
      };
    }
  }
};

export const updateProfile = async (
  userId: string,
  name: string,
  profilePhoto: File,
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
  if (user.profilePhoto) {
    console.log("delete file");
    const oldPhoto = user.profilePhoto;
    console.log("delete file", oldPhoto); 
    await deleteFile(oldPhoto);
  }

  const filePath = await createFile(profilePhoto);
  
  const userDetail = await updateUserDetail(
    userId,
    name,
    filePath,
    workHistory,
    skills
  );

  return {
    success: true,
    body: userDetail,
  };
};