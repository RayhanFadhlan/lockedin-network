import { Button } from "@/components/ui/button";
import { UsersIcon, Ellipsis, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Connection } from "@/lib/types";
import { Link, useNavigate } from "react-router-dom";

interface ConnectionCardProps {
  connection: Connection;
  isMySelf: boolean;
  menuOpen: boolean;
  toggleMenu: () => void;
  onConnect: (id: string) => void;
  onUnconnect: (id: string) => void;
}

export function ConnectionCard({
  connection,
  isMySelf,
  menuOpen,
  toggleMenu,
  onConnect,
  onUnconnect,
}: ConnectionCardProps) {
  const navigate = useNavigate();

  return (
    <div className="p-4 flex sm:flex-row flex-col items-start sm:items-center border-b-2">
      <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
        <Avatar
          src={connection.profile_photo}
          alt={connection.name}
          className="w-16 h-16"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-md font-semibold">
          <button
            className="text-black hover:underline"
            onClick={() => navigate(`/profile/${connection.id}`)}
          >
            {connection.name}
          </button>
        </h3>

        {connection.mutual && (
          <div className="flex items-center mt-2 text-xs text-muted-foreground">
            <UsersIcon className="w-4 h-4 mr-1" />
            <span>{connection.mutual} mutual connections</span>
          </div>
        )}
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-4 flex flex-row gap-2 sm:flex-row sm:space-y-0 sm:space-x-2 items-center">
        {connection.isConnected ? (
          <Link to={`/messaging?userId=${connection.id}`}>
            <Button variant="outline" className="w-full sm:w-auto">
              Message
            </Button>
          </Link>
        ) : (
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => onConnect(connection.id)}
          >
            Connect
          </Button>
        )}
        {isMySelf && (
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center justify-center w-full sm:w-auto rounded-full hover:bg-accent p-2 ease-in-out transition-all duration-200"
            >
              <Ellipsis className="w-5 h-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-[-10px] mt-2 w-48 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none z-10">
                <div className="py-1">
                  <button
                    id="unconnect"
                    className="group flex rounded-md items-center w-full px-2 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      onUnconnect(connection.id);
                      toggleMenu();
                    }}
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Unconnect
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
