import { Button } from "@/components/ui/button";
import { UsersIcon } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
interface Invitation {
  id: string;
  name: string;
  profile_photo: string;
  detail: string;
  mutual: string;
}

interface InvitationCardProps {
  invitation: Invitation;
}

export function InvitationCard({ invitation }: InvitationCardProps) {
  return (
    <div className="p-4 flex sm:flex-row flex-col  items-start sm:items-center border-b-2">
      <a href={invitation.id} className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
        <Avatar alt={invitation.name} className="w-16 h-16" />
      </a>
      <div className="flex-grow">
        <h3 className="text-md font-semibold">
          <a href={invitation.id} className="text-black hover:underline">
            {invitation.name}
          </a>
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
          {invitation.detail}
        </p>
        <div className="flex items-center mt-2 text-xs text-muted-foreground">
          <UsersIcon className="w-4 h-4 mr-1" />
          <span>{invitation.mutual} mutual connection</span>
        </div>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-row  gap-2 sm:flex-row  sm:space-y-0 sm:space-x-2">
        <Button variant="secondary" className="w-full sm:w-auto">
          Ignore
        </Button>
        <Button variant="outline" className="w-full sm:w-auto">
          Accept
        </Button>
      </div>
    </div>
  );
}
