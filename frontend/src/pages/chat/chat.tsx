import { useState } from "react";
import { UsersChatList } from "./user-chat-list";
import { ChatPlace } from "./chat-place";
import { useAuth } from "@/contexts/authProvider";
import { Navigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

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
    <div className="flex justify-center items-center">
      <div className="flex h-[80vh] bg-white shadow-lg rounded-md overflow-hidden">
      <div
          className={`${
            selectedUser ? "hidden" : "block"
          } md:block w-full md:w-[350px] border-r`}
        >
          <UsersChatList
            onSelectUser={setSelectedUser}
            selectedUserId={selectedUser?.userId}
          />
        </div>
        <div
          className={`${
            selectedUser ? "block" : "hidden"
          } md:block flex-1 w-[450px] h-[73vh] md:h-[80vh]`}
        >
          {selectedUser && (
            <button
                className="md:hidden text-gray-700 ml-2 mt-2 rounded-full flex items-center justify-center"
                onClick={() => setSelectedUser(undefined)}
            >
                <ArrowLeft size={22} />
            </button>
            )}
          <ChatPlace
            user={selectedUser}
            currentUser={{
              userId: user.userId,
              name: user.name,
              profile_photo: user.profile_photo,
            }}
          />
        </div>
      </div>
    </div>
  );
}
