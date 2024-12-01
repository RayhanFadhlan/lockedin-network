import { createContext, useContext, ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import toast from "react-hot-toast";



interface FeedContextType {
  createFeed: (content: string) => void;
  updateFeed: (params: { id: number; content: string }) => void;
  deleteFeed: (id: number) => void;
}

const FeedContext = createContext<FeedContextType | undefined>(undefined);

export function FeedProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const createFeedMutation = useMutation({
    mutationFn: (content: string) => 
      api.post("/feed", { content }).then(res => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      queryClient.invalidateQueries({ queryKey: ["myfeeds"] });
      toast.success(data.message);
    },
    onError: () => {
      toast.error("Failed to create feed");
    }
  });

  const updateFeedMutation = useMutation({
    mutationFn: ({ id, content }: { id: number; content: string }) =>
      api.put(`/feed/${id}`, { content }).then(res => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      queryClient.invalidateQueries({ queryKey: ["myfeeds"] });
      toast.success(data.message);
    },
    onError: () => {
      toast.error("Failed to update feed");
    }
  });

  const deleteFeedMutation = useMutation({
    mutationFn: (id: number) => 
      api.delete(`/feed/${id}`).then(res => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["feeds"] });
      queryClient.invalidateQueries({ queryKey: ["myfeeds"] });
      toast.success(data.message);
    },
    onError: () => {
      toast.error("Failed to delete feed");
    }
  });

  return (
    <FeedContext.Provider
      value={{
        createFeed: createFeedMutation.mutate,
        updateFeed: updateFeedMutation.mutate,
        deleteFeed: deleteFeedMutation.mutate,
      }}
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