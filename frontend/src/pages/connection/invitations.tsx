import { InvitationCard } from "@/components/invitation-card";
import { Button } from "@/components/ui/button";

const invitations = [
  {
    id: "1",
    name: "Rafly Hanggaraksa",
    profile_photo: "https://www.linkedin.com/in/raflyhanggaraksa",
    detail:
      "Informatics Engineering @ Institut Teknologi Bandung | Programming at DAGOZILLA",
    mutual: "32",
  },{
    id: "1",
    name: "Rafly Hanggaraksa",
    profile_photo: "https://www.linkedin.com/in/raflyhanggaraksa",
    detail:
      "Informatics Engineering @ Institut Teknologi Bandung | Programming at DAGOZILLA",
    mutual: "32",
  },{
    id: "1",
    name: "Rafly Hanggaraksa",
    profile_photo: "https://www.linkedin.com/in/raflyhanggaraksa",
    detail:
      "Informatics Engineering @ Institut Teknologi Bandung | Programming at DAGOZILLA",
    mutual: "32",
  },{
    id: "1",
    name: "Rafly Hanggaraksa",
    profile_photo: "https://www.linkedin.com/in/raflyhanggaraksa",
    detail:
      "Informatics Engineering @ Institut Teknologi Bandung | Programming at DAGOZILLA",
    mutual: "32",
  },
  
];

const Invitations = () => {
  return (
    <div className="artdecoCard">
      <div>
        <div className="flex flex-row justify-between items-center   border-b-2 px-4 py-2">
          <h2 className="text-md font text-foreground">Invitations</h2>
          <Button variant="secondary" className="text-muted-foreground">
            Manage
          </Button>
        </div>
        {invitations.map((invitation) => (
          <InvitationCard key={invitation.id} invitation={invitation} />
        ))}
     
      </div>
    </div>
  );
};

export default Invitations;
