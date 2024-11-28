import { Server as Server, Socket } from "socket.io";
import http from "http";
import {
  getChatHistory,
  sendMessage,
} from "../repositories/chat.repository.js";

export const initSocketServer = (server: http.Server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    const userId = socket.handshake.query.userId;
    if (!userId) {
      console.error("User ID is required");
      socket.emit("error", "User ID is required");
      return;
    }

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
