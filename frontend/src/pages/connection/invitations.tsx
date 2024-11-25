import  { useState, useEffect } from "react";
import { InvitationCard } from "@/components/invitation-card";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Invitation } from "@/lib/types";
import toast from "react-hot-toast";

const Invitations = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      const response = await api.get("/connection/request");
      setInvitations(response.data.body);
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to fetch invitations");
    }
  };

  const handleAccept = async (userId: string) => {
    await api.post(`/connection/accept/${userId}`)
    .then(() => {
      setInvitations((prev) => prev.filter((inv) => inv.id !== userId));
      toast.success("Connection request accepted");
    })
    .catch((err) => {
      console.error(err);
      toast.error("Failed to accept connection");
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
      toast.error("Failed to reject connection");
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
