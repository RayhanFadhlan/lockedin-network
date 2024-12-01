import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send } from 'lucide-react';
import api from '@/lib/api';

interface User {
  userId: string;
  name: string;
  profile_photo: string;
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string; 
  content: string;
  timestamp: string;
  senderAvatar: string;
}

interface ChatPlaceProps {
  user?: User; 
  currentUser: User;
}

const socketServerUrl = 'http://localhost:3000';

export function ChatPlace({ user, currentUser }: ChatPlaceProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const filteredMessages = messages.filter(
    (message) =>
      (message.senderId === currentUser.userId && message.receiverId === user?.userId) ||
      (message.senderId === user?.userId && message.receiverId === currentUser.userId)
  );

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [filteredMessages]);

  useEffect(() => {
    const newSocket = io(socketServerUrl, {
      withCredentials: true,
      transports: ['websocket'],
      auth: { userId: currentUser.userId }, 
    });
    setSocket(newSocket);

    newSocket.on('receiveMessage', (newMessage: any) => {
        const formattedMessage: Message = {
          id: String(newMessage.id),
          senderId: String(newMessage.from_id),
          receiverId: String(newMessage.to_id),
          content: newMessage.message,
          timestamp: newMessage.timestamp,
          senderAvatar:
          newMessage.from_id === currentUser.userId
            ? currentUser.profile_photo
            : user?.profile_photo || '/default-avatar.png',
        };
        setMessages((prev) => [...prev, formattedMessage]);
      });
      return () => {
        newSocket.disconnect();
      };
    }, [currentUser.userId, user]);

  const handleSendMessage = () => {
    if (!messageText.trim() || !user || !socket) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: String(currentUser.userId),
      receiverId: String(user.userId),
      content: messageText,
      timestamp: new Date().toISOString(),
      senderAvatar: currentUser.profile_photo,
    };

    setMessages((prev) => [...prev, newMessage]);

    socket.emit('sendMessage', {
      fromId: currentUser.userId,
      toId: user.userId,
      message: messageText,
    });

    setMessageText('');
  };

  useEffect(() => {
    if (!user) return;

    const fetchChatHistory = async () => {
        try {
          const response = await api.get('/chat/history', { params: { toId: user.userId } });
          const formattedMessages = response.data.body.map((message: any) => ({
            id: String(message.id),
            senderId: String(message.from_id), 
            receiverId: String(message.to_id), 
            content: message.message, 
            timestamp: message.timestamp, 
            senderAvatar:
            String(message.from_id) === currentUser.userId
            ? currentUser.profile_photo
            : user?.profile_photo || '/default-avatar.png',
                }));
          
        
          setMessages(formattedMessages);
          console.log('Updated messages state:', formattedMessages);
        } catch (error) {
          console.error('Error fetching chat history:', error);
        }
      };
    
      fetchChatHistory();
    }, [user]);


  if (!user) {
    return (
      <div className="flex h-full items-center justify-center bg-white">
        <p className="text-gray-500">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="border-b p-4">
        <div className="flex items-center gap-3">
          <img
            src={user.profile_photo}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <h1 className='font-medium'>{user.name}</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4" ref={messagesContainerRef}>
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 flex items-start gap-3 ${
              message.senderId === currentUser.userId ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div className="flex flex-col items-center">
                <img
                src={message.senderAvatar || '/default-avatar.png'}
                alt="Avatar"
                className="h-8 w-8 rounded-full object-cover"
                />
                <p className="mt-1 text-xs text-gray-500">
                {message.senderId === currentUser.userId
                    ? currentUser.name.split(' ')[0]
                    : user?.name.split(' ')[0]}
                </p>
            </div>
            <div
              className={`rounded-md px-4 py-2 ${
                message.senderId === currentUser.userId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {message.content}
              <div className="mt-1 text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 rounded-lg border bg-white p-2">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Write a message..."
              className="min-h-[60px] w-full resize-none bg-transparent text-sm focus:outline-none"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex gap-2">
              </div>
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            className="rounded-full bg-blue-500 p-3 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
