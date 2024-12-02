import { Server as Server, Socket } from "socket.io";
import type { Server as HTTPServer } from "node:http";
import {
  getChatHistory,
  sendMessage, getLastChatMessage,
  getAllConnections
} from "../repositories/chat.repository.js";
import { HttpError, HttpStatus } from "../lib/errors.js";
import { notifyUser } from "./notification.service.js";
import { jwt, verify } from "hono/jwt";


export const initSocketServer = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
    transports: ["websocket"],
  });

  io.use(async (socket: Socket, next) => {

    const cookies = socket.handshake.headers.cookie;
    if(!cookies) {
      return next(new Error("Authentication error"));
    }

    const token = cookies.split("=")[1];
    const payload = await verify(token, process.env.JWT_SECRET as string);
    const userIdToken = payload.userId;

    const userId = socket.handshake.auth.userId;
    
    if (!userId) {
      return next(new Error("User ID is required"));
    }
    if(userIdToken !== userId) {
      return next(new Error("User ID is not valid"));
    }
    socket.data.userId = userId;
    return next();
  }
  );

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);
    const userId = socket.handshake.auth.userId;

    const userRoom = `room-${userId}`;
    socket.join(userRoom);
    console.log(`${socket.id} joined room: ${userRoom}`);

    socket.on("sendMessage",async ({ from_id, to_id, message }: { from_id: string; to_id: string; message: string }) => {
        try {
            const newMessage = await sendMessage(from_id, to_id, message);
          console.log("New message:", newMessage);
          const room = `room-${to_id}`;
          socket.to(room).emit("receiveMessage", newMessage); 
          await notifyUser(from_id, to_id, message);
        } catch (error: any) {
          console.error("Error sending message:", error);
          socket.emit("error", error.message); 
        }
      }
    );
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};


export const getConnectionsWithLastMessage = async (userId: string) => {
    const connections = await getAllConnections(userId);
  
    if (!connections.length) {
      throw new HttpError(HttpStatus.NOT_FOUND, {
        message: 'No connections found for this user.',
      });
    }
  
    const uniqueConnections = new Map();
  
    connections.forEach((connection) => {
      const otherUser =
        connection.from_id.toString() === userId
          ? connection.to_user
          : connection.from_user;
  
      if (!uniqueConnections.has(otherUser.id)) {
        uniqueConnections.set(otherUser.id, connection);
      }
    });
  
    const connectionsWithLastMessages = await Promise.all(
      Array.from(uniqueConnections.values()).map(async (connection) => {
        const otherUser =
          connection.from_id.toString() === userId
            ? connection.to_user
            : connection.from_user;
  
        const lastChat = await getLastChatMessage(userId, otherUser.id.toString());
  
        return {
          userId: otherUser.id,
          name: otherUser.name,
          profile_photo: otherUser.profile_photo,
          lastMessage: lastChat?.message || null,
          lastMessageTime: lastChat?.timestamp?.toISOString() || null,
          lastMessageSenderId: lastChat?.from_id || null,
        };
      })
    );
  
    return connectionsWithLastMessages;
  };

  export const getChatHistoryForUsers  = async (userId1: string, userId2: string) => {
    const chatHistory = await getChatHistory(userId1, userId2);
    if (!chatHistory.length) {
        return [];
      }

    return chatHistory;
  };