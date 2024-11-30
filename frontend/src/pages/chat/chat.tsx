import { useState } from 'react'
import { UsersChatList } from './user-chat-list'
import { ChatPlace } from './chat-place'
import { useAuth } from '@/contexts/authProvider';

interface User {
    userId: string;
    name: string;
    profile_photo: string;
  }

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState<User>()
    const { user } = useAuth();

  return (
    <div className="flex h-[800px]">
      <div className="w-[400px]">
        <UsersChatList onSelectUser={setSelectedUser} selectedUserId={selectedUser?.userId}
         />
      </div>
      <div className="flex-1">
        <ChatPlace user={selectedUser} currentUser={{ userId: String(user?.userId), name: String(user?.name) , profile_photo: String(user?.profile_photo) }} />
      </div> 
    </div>
    
  )
}

