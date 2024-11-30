import { createContext, useContext, ReactNode, useState } from "react";
import { Post } from "@/lib/types";

interface Feed {
  post: Post & { name: string; profile_photo: string };
}

interface FeedContextType {
  feeds: Feed[];
  setFeeds: (feeds: Feed[]) => void;
  createFeed: (content: string) => Promise<void>;
  updateFeed: (id: number, content: string) => Promise<void>;
  deleteFeed: (id: number) => Promise<void>;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
  const [feeds, setFeeds] = useState<Feed[]>([]);

  const createFeed = async (content: string) => {
    
  };

  const updateFeed = async (id: number, content: string) => {
  };

  const deleteFeed = async (id: number) => {
    
  };

  return (
    <FeedContext.Provider
      value={{ feeds, setFeeds, createFeed, updateFeed, deleteFeed }}
    >
      {children}
    </FeedContext.Provider>
  );
}

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (!context) {
    throw new Error("useFeed must be used within FeedProvider");
  }
  return context;
};
