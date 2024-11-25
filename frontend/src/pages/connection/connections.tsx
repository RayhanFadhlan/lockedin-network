import  { useState, useEffect } from "react";
import { ConnectionCard } from "@/components/connection-card";
import { Connection } from "@/lib/types";
import { useParams } from "react-router-dom";
import api from "@/lib/api";
import toast from "react-hot-toast";


const Connections = () => {
  const { user_id } = useParams<{ user_id: string }>();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [numberOfConnections, setNumberOfConnections] = useState(0);
  const [isMySelf, setIsMySelf] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    await api.get(`/connection/${user_id}`)
    .then((response) => {
      setConnections(response.data.body.connections);
      setNumberOfConnections(response.data.body.connectionCount);
      setIsMySelf(response.data.body.isMySelf);
    })
    .catch((err) => {
      console.error(err);
    });
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleConnect = async (userId: string) => {
    await api.post(`/connection/send/${userId}`)
    .then(() => {
      toast.success("Connection request sent");
    }).catch((err) => {
      console.error(err);
      toast.error(err.response.data.message);
    });

  };

  const handleUnconnect = async (userId: string) => {
    await api.delete(`/connection/${userId}`)
    .then(() => {
      setConnections((prev) => prev.filter((conn) => conn.id !== userId));
      setNumberOfConnections((prev) => prev - 1);
      toast.success("Connection removed");
    }).catch((err) => {
      console.error(err);
      toast.error(err.response.data.message);
    });

  }

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
            isMySelf={isMySelf}
            menuOpen={openMenuId === connection.id}
            toggleMenu={() => toggleMenu(connection.id)}
            onConnect={handleConnect}
            onUnconnect={handleUnconnect}
          />
        ))}
      </div>
    </div>
  );
};

export default Connections;
