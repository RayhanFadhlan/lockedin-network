import { Post } from "@/lib/types";
import { Avatar } from "./ui/avatar";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/authProvider";
import { FeedDropdown } from "./feed-dropdown";

interface FeedCardProps {
  post: Post & {
    name: string;
    profile_photo: string;
  };
}

export function FeedCard({ post }: FeedCardProps) {
  // const { user } = useAuth();
  // const isMyPost = user?.userId === post.user_id.toString();
  const isMyPost = true;

  return (
    <div className="!my-2 artdecoCard p-4 sm:p-4 gap-4 flex flex-col">
      <div className="flex flex-col">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <Avatar
              src="/profile.svg"
              alt={post.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-grow">
              <h3 className="text-md font-semibold">
                <Link
                  to={`/profile/${post.user_id}`}
                  className="text-black hover:underline text-sm"
                >
                  {post.name}
                </Link>
              </h3>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {isMyPost && (
            <FeedDropdown postId={post.id} content={post.content} />
          )}
        </div>
      </div>
      <div className="">
        <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>
    </div>
  );
}
