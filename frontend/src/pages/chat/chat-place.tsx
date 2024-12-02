import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { Send } from "lucide-react";
import api from "@/lib/api";
import { useChatStore } from "@/hooks/useChatStore";

interface User {
  userId: string;
  name: string;
  profile_photo: string;
}

interface Message {
  id: string;
  from_id: string;
  to_id: string;
  message: string;
  timestamp: string;
  avatar?: string;
}

interface ChatPlaceProps {
  user?: User;
  currentUser: User;
}

const socketServerUrl = "http://localhost:3000";

export function ChatPlace({ user, currentUser }: ChatPlaceProps) {
  const { updateUser, users } = useChatStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const filteredMessages = messages.filter(
    (message) =>
      (message.from_id === currentUser.userId &&
        message.to_id === user?.userId) ||
      (message.from_id === user?.userId && message.to_id === currentUser.userId)
  );

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [filteredMessages]);

  useEffect(() => {
    const newSocket = io(socketServerUrl, {
      withCredentials: true,
      transports: ["websocket"],
      auth: { userId: currentUser.userId },
    });

    setSocket(newSocket);

    newSocket.on("receiveMessage", (newMessage: Message) => {
      if (!user) return;
      setMessages((prev) => [
        ...prev,
        {
          ...newMessage,
          avatar:
            newMessage.from_id === currentUser.userId
              ? currentUser.profile_photo
              : user?.profile_photo || "/default-avatar.png",
        },
      ]);

      const userKiri = users.find((u) => u.userId === newMessage.from_id);

      updateUser({
        userId: newMessage.from_id,
        name: userKiri?.name || "",
        profile_photo: userKiri?.profile_photo || "",
        lastMessage: newMessage.message,
        lastMessageTime: newMessage.timestamp,
        lastMessageSenderId: newMessage.from_id,
      });

    });

    return () => {
      newSocket.disconnect();
    };
  }, [
    currentUser.userId,
    user?.profile_photo,
    currentUser.profile_photo,
    updateUser,
    users,
    user,
  ]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !user || !socket) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      from_id: currentUser.userId,
      to_id: user.userId,
      message: messageText,
      timestamp: new Date().toISOString(),
      avatar: currentUser.profile_photo,
    };

    setMessages((prev) => [...prev, newMessage]);

    socket.emit("sendMessage", newMessage);
    setMessageText("");

    updateUser({
      userId: user.userId,
      name: user.name,
      profile_photo: user.profile_photo,
      lastMessage: messageText,
      lastMessageTime: new Date().toISOString(),
      lastMessageSenderId: currentUser.userId,
    });
    
  };

  useEffect(() => {
    if (!user) return;

    const fetchChatHistory = async () => {
      try {
        const { data } = await api.get("/chat/history", {
          params: { toId: user.userId },
        });
        const formattedMessages = data.body.map((message: Message) => ({
          ...message,
          avatar:
            message.from_id === currentUser.userId
              ? currentUser.profile_photo
              : user?.profile_photo || "/default-avatar.png",
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [user, currentUser.userId, currentUser.profile_photo]);

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <p className="text-gray-500">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b p-4 flex items-center gap-3">
        <img
          src={user.profile_photo}
          alt={user.name}
          className="h-10 w-10 rounded-full object-cover"
        />
        <h1 className="font-medium">{user.name}</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4" ref={messagesContainerRef}>
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex items-start gap-3 ${
              message.from_id === currentUser.userId
                ? "flex-row-reverse"
                : "flex-row"
            }`}
          >
            <img
              src={message.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="h-8 w-8 rounded-full object-cover"
            />
            <div
              className={`rounded-md px-4 py-2 ${
                message.from_id === currentUser.userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p>{message.message}</p>
              <span className="mt-1 text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t p-4 flex items-end gap-2">
        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Write a message..."
          className="flex-1 min-h-[60px] resize-none rounded-lg border bg-white p-2 focus:outline-none"
        />
        <button
          onClick={handleSendMessage}
          disabled={!messageText.trim()}
          className="rounded-full bg-blue-500 p-3 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
