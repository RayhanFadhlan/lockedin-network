import { useState } from "react";
import { UsersChatList } from "./user-chat-list";
import { ChatPlace } from "./chat-place";
import { useAuth } from "@/contexts/authProvider";
import { Navigate } from "react-router-dom";


interface User {
  userId: string;
  name: string;
  profile_photo: string;
}

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState<User>();
  const { user } = useAuth();



  if(!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-[80vh]">
      <div className="w-[400px]">
        <UsersChatList
          onSelectUser={setSelectedUser}
          selectedUserId={selectedUser?.userId}
        />
      </div>
      <div className="flex-1">
        <ChatPlace
          user={selectedUser}
          currentUser={{
            userId: (user.userId),
            name: (user.name),
            profile_photo: user.profile_photo,
          }}
        />
      </div>
    </div>
  );
}
