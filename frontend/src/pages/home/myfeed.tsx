import { FeedCard } from "@/components/feed-card";
import { FeedDialog } from "@/components/feed-dialog";
import { ProfileWidget } from "@/components/profile-widget";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/authProvider";

import { FeedProvider } from "@/contexts/feedProvider";
import api from "@/lib/api";
import { Feed } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface FeedResponse {
  body: Feed[];
}

function MyFeed() {
  const { user } = useAuth();

  const { data } = useQuery<FeedResponse>({
    queryKey: ["myfeeds"],
    queryFn: async () => {
      const response = await api.get("/myfeed");
      return response.data;
    },
  });

 

  return (
    <FeedProvider>
      <div className="w-full flex justify-center gap-4">
        <div className="hidden md:block">
          <ProfileWidget />
        </div>

        <div className="max-w-[100vw] md:max-w-[60vw] flex flex-col gap-4">
          <div className="artdecoCard flex flex-row gap-2 !p-4">
            <Avatar src={user?.profile_photo} className="w-12 h-12 rounded-full" />
            <FeedDialog
              trigger={
                <button className="w-full h-full rounded-full border-2 font-semibold text-sm text-muted-foreground text-left pl-4 hover:bg-muted border-muted">
                  Inspire the world with your thoughts...
                </button>
              }
              isCreate={true}
            />
          </div>

          {data?.body.map((feed) => (
            <FeedCard key={feed.id} post={feed} />
          ))}
        </div>
      </div>
    </FeedProvider>
  );
}

export default MyFeed;