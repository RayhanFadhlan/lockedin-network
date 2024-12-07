import { Mail, MessageCircle, UserMinus, UserPlus } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
interface MultipurposeButtonProps {
  page: string;
  relation_to: string;
  idTarget?: string;
}

export const MultipurposeButton = ({
  page,
  relation_to,
  idTarget,
}: MultipurposeButtonProps) => {
  const queryClient = useQueryClient();

  const { mutate: handleConnect } = useMutation({
    mutationFn: (user_id: string) =>
      api
        .post(`/connection/send/${user_id}`)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["userlist"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          toast.success("Connection request sent");
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.response.data.message);
        }),
  });

  const { mutate: handleUnconnect } = useMutation({
    mutationFn: (user_id: string) =>
      api
        .delete(`/connection/${user_id}`)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["userlist"] });
          queryClient.invalidateQueries({ queryKey: ["profile"] });
          toast.success("Connection removed");
        })
        .catch((err) => {
          console.error(err);
          toast.error(err.response.data.message);
        }),
  });

  let buttonClass;
  if (page == "profile") {
    buttonClass = "text-sm h-8 overflow-hidden";
  } else {
    buttonClass = "w-full overflow-hidden text-sm";
  }
  if (relation_to == "connected") {
    if (page == "profile") {
      return (
        <>
          <Link to={`/messaging?userId=${idTarget}`}>
            <Button variant="default" className="text-sm h-8">
              <MessageCircle className="h-4 w-4" />
              Message
            </Button>
          </Link>
          <Button
            variant="outline"
            className="text-sm h-8"
            onClick={() => handleUnconnect(idTarget!)}
          >
            <UserMinus className="h-4 w-4" />
            Unconnect
          </Button>
        </>
      );
    } else {
      return (
        <Link to={`/messaging?userId=${idTarget}`}>
          <Button variant="outline" className={buttonClass}>
            <Mail className="w-4 h-4 mr-2 hidden sm:inline" /> Message
          </Button>
        </Link>
      );
    }
  }
  if (relation_to == "owner") {
    if (page != "profile") {
      return (
        <Link to={`/profile/${idTarget}`}>
          <Button variant="outline" className={buttonClass}>
            My Profile
          </Button>
        </Link>
      );
    }
  }
  if (relation_to == "unconnected") {
    return (
      <Button
        variant={page == "profile" ? "default" : "outline"}
        className={buttonClass}
        onClick={() => handleConnect(idTarget!)}
      >
        <UserPlus className="w-4 h-4 mr-2 hidden sm:inline" />
        Connect
      </Button>
    );
  }
  if (relation_to == "unauthorized") {
    return (
      <Button variant="outline" className={buttonClass} disabled>
        <UserPlus className="w-4 h-4 mr-2 hidden sm:inline" />
        Connect
      </Button>
    );
  }
  if (relation_to == "request_sent") {
    return (
      <Button variant="outline" className={buttonClass} disabled>
        Request Sent
      </Button>
    );
  }
  if (relation_to == "request_received") {
    return (
      <Button variant="outline" className={buttonClass} disabled>
        Request Received
      </Button>
    );
  }
};
