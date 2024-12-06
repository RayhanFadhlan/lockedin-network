import { useState, useEffect, useMemo } from "react";
import { Search } from "lucide-react";
import api from "@/lib/api";
import { useChatStore } from "@/hooks/useChatStore";
import { useSearchParams } from "react-router-dom";

interface User {
  userId: string;
  name: string;
  profile_photo: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSenderId?: string;
}

interface UsersChatListProps {
  onSelectUser: (user: User) => void;
  selectedUserId?: string;
}

export function UsersChatList({
  onSelectUser,
  selectedUserId,
}: UsersChatListProps) {
  const { users, setUsers } = useChatStore();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchParams, setSearchParams] = useSearchParams();



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/chat/connections");
        const { body, loggedInUserId } = response.data;
        setUsers(body);
        setLoggedInUserId(loggedInUserId);

      const urlUserId = searchParams.get("userId");
       if (urlUserId) {
         const user = body.find((u: User) => u.userId == urlUserId);
         if (user) {
           onSelectUser(user);
         }
       }
      } catch {
        throw new Error("Failed to fetch users");
      }
    };

    fetchUsers();
  }, []);


  const handleSelectUser = (user: User) => {
    onSelectUser(user);
    setSearchParams({ userId: user.userId });
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;
      return (
        new Date(b.lastMessageTime).getTime() -
        new Date(a.lastMessageTime).getTime()
      );
    });
  }, [users]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(sortedUsers);
    } else {
      setFilteredUsers(
        sortedUsers.filter((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, sortedUsers]);

  return (
    <div className="flex h-full flex-col border-r bg-white">
      <div className="p-3">
        <div className="relative mt-1.5 mb-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            className="w-full rounded-md border bg-gray-50 py-2 pl-10 pr-4 text-sm placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Search User"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto border-t">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No matches found.</div>
        ) : (
          filteredUsers.map((user, index) => (
            <button
              key={user.userId ? String(user.userId) : `user-${index}`}
              onClick={() => {
                handleSelectUser(user);
              }}
              className={`w-full px-3 py-2 text-left hover:bg-gray-100  border-b ${
                selectedUserId === user.userId ? "bg-gray-100 " : ""
              }`}
            >
              <div className="flex items-center gap-4 mt-3 mb-3">
                <div className="relative">
                  <img
                    src={user.profile_photo}
                    alt={user.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-md text-gray-700">
                      {user.name}
                    </span>
                    {user.lastMessageTime && (
                      <span className="text-sm text-gray-500">
                        {new Date(user.lastMessageTime).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    )}
                  </div>
                  {user.lastMessage && (
                    <div className="text-sm text-gray-500 truncate">
                      {user.lastMessageSenderId === loggedInUserId ? (
                        <span>You: </span>
                      ) : (
                        <span>{user.name.split(" ")[0]}: </span>
                      )}
                      {user.lastMessage}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
