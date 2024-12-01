import {create} from "zustand";

export interface User {
  userId: string;
  name: string;
  profile_photo: string;
  lastMessage?: string;
  lastMessageTime?: string;
  lastMessageSenderId?: string;
}

interface ChatStore {
  users: User[];
  updateUser: (updatedUser: User) => void;
  setUsers: (newUsers: User[]) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  users: [],
  setUsers: (newUsers) => set({ users: newUsers }),
  updateUser: (updatedUser) =>
    set((state) => {
      const updatedUsers = state.users.map((user) =>
        user.userId === updatedUser.userId ? updatedUser : user
      );
      return { users: updatedUsers };
    }),
}));
