import { Button } from "@/components/ui/button";
import { Mail, UserPlus } from "lucide-react";
import { Avatar } from "./ui/avatar";
import { Profile } from "@/lib/types";
import { Link,  } from "react-router-dom";
import api from "@/lib/api";
import toast from "react-hot-toast";
interface ProfileCardProps extends Profile {
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
  // const navigate = useNavigate();

  const handleConnect = async (user_id : string) => {
    await api
      .post(`/connection/send/${user_id}`)
      .then(() => {
        toast.success("Connection request sent");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="artdecoCard w-full sm:w-[184px] overflow-hidden flex flex-col h-full">
      <div className="relative h-16 bg-[url('/profile-banner.svg')] bg-cover bg-center">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <Avatar
            src={profile_photo}
            alt="Profile picture"
            className="object-cover w-[104px] h-[104px]"
          />
        </div>
      </div>

      <div className="pt-12 p-6 flex flex-col flex-grow">
        <div className="flex flex-col items-center text-center flex-grow">
          <div className="space-y-2">
            <h2 className="text-md font-semibold pt-2">
              <Link to={`/profile/${id}`} className="hover:underline">
                {name}
              </Link>
            </h2>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-muted-foreground">
              {isAuthenticated && `${mutual} mutual connections`}
            </span>
          </div>

          <div className="mt-auto w-full">
            {isAuthenticated ? (
              isConnected ? (
                <a href={id}>
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2 hidden sm:inline" /> Message
                  </Button>
                </a>
              ) : (
                
                  <Button variant="outline" className="w-full" onClick={() => handleConnect(id)}>
                    <UserPlus className="w-4 h-4 mr-2 hidden sm:inline" />
                    Connect
                  </Button>
           
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
    </div>
  );
}
