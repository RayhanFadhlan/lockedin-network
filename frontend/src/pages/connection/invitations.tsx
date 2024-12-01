import  { useState, useEffect } from "react";
import { InvitationCard } from "@/components/invitation-card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Invitation } from "@/lib/types";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Invitations = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const navigate = useNavigate();

  const fetchInvitations = async () => {

    await api.get("/connection/request")
    .then((response) => {
      setInvitations(response.data.body);
    })
    .catch((err) => {

      if(err.response.status === 401) {
        navigate("/login");
      }
      console .error(err);
      toast.error(err.response.data.message);
    }
    );
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

 

  const handleAccept = async (userId: string) => {
    await api.post(`/connection/accept/${userId}`)
    .then(() => {
      setInvitations((prev) => prev.filter((inv) => inv.id !== userId));
      toast.success("Connection request accepted");
    })
    .catch((err) => {
      console.error(err);
      toast.error(err.response.data.message);
    });
  };

  const handleReject = async (userId: string) => {
    await api.delete(`/connection/reject/${userId}`)
    .then(() => {
      setInvitations((prev) => prev.filter((inv) => inv.id !== userId));
      toast.success("Connection request rejected");
    })
    .catch((err) => {
      console.error(err);
      toast.error(err.response.data.message);
    });
  };

  return (
    <div className="flex justify-center">
      <div className="artdecoCard min-w-[45vw] max-w-[90vw] w-full md:w-[45vw]">
        <div className="flex flex-row justify-between items-center border-b-2 px-4 py-2">
          <h2 className="text-md font text-foreground">Invitations</h2>
          <Button variant="secondary" className="text-muted-foreground">
            Manage
          </Button>
        </div>
        {invitations.map((invitation: Invitation) => (
          <InvitationCard key={invitation.id} invitation={invitation} onAccept={handleAccept} onReject={handleReject} />
        ))}
      </div>
    </div>
  );
};

export default Invitations;
