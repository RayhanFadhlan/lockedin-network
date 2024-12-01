import { useAuth } from "@/contexts/authProvider";
import { Avatar } from "./ui/avatar";

export function ProfileWidget() {
  const { user } = useAuth();

  return (
    <div className="artdecoCard w-full md:w-[225px] overflow-hidden flex flex-col h-fit top-[95px] sticky top-4">
      <div className="relative h-16 bg-[url('/profile-banner.svg')] bg-cover bg-center">
        <div className="absolute -bottom-8 left-4">
          <Avatar
            src={user?.profile_photo}
            alt="Profile picture"
            className="w-16 h-16"
          />
        </div>
      </div>
      <div className="flex flex-col pt-10 px-4 pb-4">
        <h2 className="text-md font-semibold">
          <div className="hover:underline">{user?.name}</div>
        </h2>
        <span className="text-xs text-muted-foreground">{user?.username}</span>
        <span className="text-xs text-muted-foreground truncate max-w-[140px]">
          {user?.email}
        </span>
      </div>
    </div>
  );
}
