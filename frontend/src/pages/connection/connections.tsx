import React, { useState } from "react";
import { ConnectionCard } from "@/components/connection-card";

const connections = [
  {
    id: "1",
    name: "Rafly Hanggaraksa",
    profile_photo: "https://www.linkedin.com/in/raflyhanggaraksa",
    detail:
      "Informatics Engineering @ Institut Teknologi Bandung | Programming at DAGOZILLA",
    mutual: "32",
    isConnected: true,
  },
  {
    id: "2",
    name: "Rafly Hanggaraksa",
    profile_photo: "https://www.linkedin.com/in/raflyhanggaraksa",
    detail:
      "Informatics Engineering @ Institut Teknologi Bandung | Programming at DAGOZILLA",
    mutual: "32",
    isConnected: true,
  },
  {
    id: "3",
    name: "Rafly Hanggaraksa",
    profile_photo: "https://www.linkedin.com/in/raflyhanggaraksa",
    detail:
      "Informatics Engineering @ Institut Teknologi Bandung | Programming at DAGOZILLA",
    mutual: "32",
    isConnected: false,
  },
  {
    id: "4",
    name: "Rafly Hanggaraksa",
    profile_photo: "https://www.linkedin.com/in/raflyhanggaraksa",
    detail:
      "Informatics Engineering @ Institut Teknologi Bandung | Programming at DAGOZILLA",
    mutual: "32",
    isConnected: false,
  },
];

const numberOfConnections = 64;
const ismySelf = true;

const Connections = () => {
  // const { userId } = useParams<{ userId: string }>();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="artdecoCard">
      <div>
        <div className="flex flex-row justify-between items-center   border-b-2 px-4 py-6">
          <h2 className="text-lg font text-foreground">
            {numberOfConnections} Connections
          </h2>
        </div>
        {connections.map((connection) => (
          <ConnectionCard
            key={connection.id}
            connection={connection}
            isMySelf={ismySelf}
            menuOpen={openMenuId === connection.id}
            toggleMenu={() => toggleMenu(connection.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Connections;
