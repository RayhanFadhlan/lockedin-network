import { Button } from "@/components/ui/button";
import { Mail, UserPlus } from "lucide-react";
import { Avatar } from "./ui/avatar";
import { Profile } from "@/lib/types";
import { Link } from "react-router-dom";
interface ProfileCardProps extends Profile{

  isAuthenticated: boolean;
}

export default function ProfileCard({
  id,
  name,
  profile_photo,
  isConnected,
  mutual,
  isAuthenticated,
}: ProfileCardProps) {
  return (
    <div className="artdecoCard w-full sm:w-[184px] overflow-hidden">
      <div className="relative h-16 bg-[url('/profile-banner.svg')] bg-cover bg-center">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <Avatar
            src={profile_photo}
            alt="Profile picture"
            className="object-cover w-[104px] h-[104px]"
          />
        </div>
      </div>

      <div className="pt-12 p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="space-y-2">
          <h2 className="text-md font-semibold pt-2">
              <Link
                to={`/profile/${id}`}
                className="hover:underline"
              >
                {name}
              </Link>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {mutual} mutual connections
            </span>
          </div>

          {isAuthenticated ? (
            isConnected ? (
              <>
                <a href={id}>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2 hidden sm:inline" /> Message
                  </Button>
                </a>
              </>
            ) : (
              <>
                <a href={id}>
                  <Button variant="outline" className="w-full">
                    <UserPlus className="w-4 h-4 mr-2 hidden sm:inline" />
                    Connect
                  </Button>
                </a>
              </>
            )
          ) : (
            <Button variant="outline" className="w-full" disabled>
              <UserPlus className="w-4 h-4 mr-2 hidden sm:inline" />
              Connect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
