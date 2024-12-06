import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/authProvider";
import {
  User,
  FileText,
  LogOut,
  CircleUserRound,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export function UserNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="flex flex-col items-center text-sm hover:text-black focus:outline-none text-gray-500">
          <div className="w-6 h-6">
            <CircleUserRound />
          </div>
          <div className="flex">
            <span className=" text-xs">Me</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </button>
        {/* <button>tes</button> */}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[100vw] sm:w-56 flex-col"
        align="end"
        forceMount
        sideOffset={12}
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1 items-center">
            <p className="text-sm font-medium leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
          className="flex justify-center"
            onClick={() => navigate(`/profile/${user?.userId}`)}
          >
            <User className="h-4 w-4" />
            <span>My Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
          className="flex justify-center"
          onClick={() => navigate("/myfeed")}>
            <FileText className="h-4 w-4" />
            <span>My Posts</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
        className="flex justify-center"
        onClick={logout}>
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
