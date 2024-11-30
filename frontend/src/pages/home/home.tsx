import { FeedCard } from "@/components/feed-card";
import { Avatar } from "@/components/ui/avatar";

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

interface ProfileWidgetProps {
  name: string;
  profile_photo: string;
  id: string;
  email: string;
  username: string;
}

export function ProfileWidget({
  name,
  profile_photo,
  email,
  username,
}: ProfileWidgetProps) {
  return (
    <div className="artdecoCard w-full md:w-[225px] overflow-hidden flex flex-col h-fit sticky top-4">
      <div className="relative h-16 bg-[url('/profile-banner.svg')] bg-cover bg-center">
        <div className="absolute -bottom-8 left-4">
          <Avatar
            src={profile_photo}
            alt="Profile picture"
            className="w-16 h-16"
          />
        </div>
      </div>
      <div className="flex flex-col pt-10 px-4 pb-4">
        <h2 className="text-md font-semibold">
          <div className="hover:underline">{name}</div>
        </h2>
        <span className="text-xs text-muted-foreground">{username}</span>
        <span className="text-xs text-muted-foreground truncate max-w-[140px]">
          {email}
        </span>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="w-full flex justify-center gap-4">
      <div className="hidden md:block">
        <ProfileWidget
          name="Your Name"
          profile_photo="/profile.svg"
          id="your-id"
          email="rayhan@gmail.com"
          username="rayhan"
        />
      </div>

      <div className="max-w-[100vw] md:max-w-[60vw] flex flex-col">
        <div className="artdecoCard flex flex-row gap-2 !p-4">
          <Avatar src="/profile.svg" className="w-12 h-12 rounded-full" />
          <button className="w-full h-full rounded-full border-2 font-semibold text-sm text-muted-foreground text-left pl-4 hover:bg-muted border-muted">
            Start a post, try writing with AI
          </button>
        </div>
        {feedProps.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Home;
