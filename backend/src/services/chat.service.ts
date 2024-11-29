import { Server as Server, Socket } from "socket.io";
import type { Server as HTTPServer } from "node:http";
import {
  getChatHistory,
  sendMessage, getLastChatMessage,
  getAllConnections
} from "../repositories/chat.repository.js";
import { HttpError, HttpStatus } from "../lib/errors.js";


export const initSocketServer = (server: HTTPServer) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
    transports: ["websocket"],
  });

  io.use((socket: Socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("User ID is required"));
    }
    return next();
  }
  );

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);
    const userId = socket.handshake.auth.userId;

    const userRoom = `room-${userId}`;
    socket.join(userRoom);
    console.log(`${socket.id} joined room: ${userRoom}`);

    socket.on("sendMessage",async ({ fromId, toId, message }: { fromId: string; toId: string;message: string }) => {
        try {
          const newMessage = await sendMessage(fromId, toId, message);
          console.log("New message:", newMessage);
          const room = `room-${toId}`;
          socket.to(room).emit("receiveMessage", newMessage); 
        } catch (error: any) {
          console.error("Error sending message:", error);
          socket.emit("error", error.message); 
        }
      }
    );

    socket.on("getChatHistory", async ({ userId1, userId2 }: { userId1: string; userId2: string }) => {
        try {
            const chatHistory = await getChatHistory(userId1, userId2);
            socket.emit("chatHistory", chatHistory);
        } catch (error: any) {
            console.error("Error getting chat history:", error);
            socket.emit("error", error.message);
        }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};


export const getConnectionsWithLastMessage = async (userId: string) => {
    const connections = await getAllConnections(userId);
  
    if (!connections.length) {
      throw new HttpError(HttpStatus.NOT_FOUND, {
        message: "No connections found for this user.",
      });
    }
  
    const connectionsWithLastMessages = await Promise.all(
      connections.map(async (connection) => {
        const otherUser =
          connection.from_id.toString() === userId ? connection.to_user : connection.from_user;
  
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