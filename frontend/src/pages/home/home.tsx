import { FeedCard } from "@/components/feed-card";
import { FeedDialog } from "@/components/feed-dialog";
import { ProfileWidget } from "@/components/profile-widget";
import RecommendationFriends from "@/components/recommendation-card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/authProvider";
import { FeedProvider } from "@/contexts/feedProvider";
import api from "@/lib/api";
import { Feed } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface FeedResponse {
  body: {
    feeds: Feed[];
    cursor: number;
  };
}

function Home() {
  const limit = 10;
  const { user } = useAuth();


  const { ref, inView } = useInView();

  const fetchFeeds = async ({ pageParam }: { pageParam?: number }) => {
    if (pageParam !== undefined) {
      const response = await api.get(
        `/feed?cursor=${pageParam}&limit=${limit}`
      );
      return response.data;
    } else {
      const response = await api.get(`/feed?limit=${limit}`);
      return response.data;
    }
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["feeds"],
    queryFn: fetchFeeds,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.body.cursor,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "pending") {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full h-screen flex flex-col gap-4 items-center justify-center">
        <p className="text-destructive">Error: {error?.message}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <FeedProvider>
      <div className="w-full flex flex-col md:flex-row justify-center gap-4">
        <div className="order-1 md:order-1 w-full md:w-[auto]">
          <ProfileWidget />
        </div>

        <div className="order-3 md:order-2 w-full md:max-w-[60vw] flex flex-col gap-4">
          <div className="artdecoCard flex flex-row gap-2 !p-4">
            <Avatar src={user?.profile_photo} className="w-12 h-12 rounded-full" />
            <FeedDialog
              trigger={
                <button className="w-full rounded-full border-2 font-semibold text-sm text-muted-foreground text-left pl-4 hover:bg-muted border-muted">
                  Inspire the world with your thoughts...
                </button>
              }
              isCreate={true}
            />
          </div>

          {data.pages.map((page: FeedResponse) =>
            page.body.feeds.map((feed) => (
              <FeedCard key={feed.id} post={feed} />
            ))
          )}

          <div ref={ref} className="h-10 flex justify-center">
            {isFetchingNextPage && <Loader2 className="h-6 w-6 animate-spin" />}
          </div>
        </div>

        <div className="order-2 md:order-3 md:mt-4 w-full md:w-[20%] md:mr-16 md:ml-0">
          <RecommendationFriends
          />
        </div>
      </div>
    </FeedProvider>
  );
}

export default Home;
