import { FeedCard } from "@/components/feed-card";
import { FeedDialog } from "@/components/feed-dialog";
import { ProfileWidget } from "@/components/profile-widget";
import { Avatar } from "@/components/ui/avatar";
import { FeedProvider } from "@/contexts/feedProvider";

const feedProps = [
  {
    id: 1,
    created_at: "2021-10-10",
    updated_at: "2021-10-10",
    content:
      "This is a post, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitm ",
    user_id: 123,
    name: "John Doe",
    profile_photo: "https://randomuser",
  },
  {
    id: 2,
    created_at: "2021-10-11",
    updated_at: "2021-10-11",
    content:
      "This is another post, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitm ",
    user_id: 124,
    name: "Jane Smith",
    profile_photo: "https://randomuser",
  },
  {
    id: 3,
    created_at: "2021-10-12",
    updated_at: "2021-10-12",
    content:
      "This is yet another post, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitLorem ipsum dolor sit amet, consectetur adipiscing elitm ",
    user_id: 125,
    name: "Alice Johnson",
    profile_photo: "https://randomuser",
  },
];

function Home() {
  return (
    <FeedProvider>
      <div className="w-full flex justify-center gap-4">
        <div className="hidden md:block">
          <ProfileWidget />
        </div>

        <div className="max-w-[100vw] md:max-w-[60vw] flex flex-col">
          <div className="artdecoCard flex flex-row gap-2 !p-4">
            <Avatar src="/profile.svg" className="w-12 h-12 rounded-full" />
            <FeedDialog
              trigger={
                <button className="w-full h-full rounded-full border-2 font-semibold text-sm text-muted-foreground text-left pl-4 hover:bg-muted border-muted">
                  Start a post, try writing with AI
                </button>
              }
              isCreate={true}
            />
          </div>
          {feedProps.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </FeedProvider>
  );
}

export default Home;
