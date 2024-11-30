import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileCard from "@/components/user-card";
import api from "@/lib/api";
import { Profile } from "@/lib/types";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const UserList = () => {
  const location = useLocation();
  const [search, setSearch] = useState(
    new URLSearchParams(location.search).get("search") || ""
  );
  const [profiles, setProfiles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      const response = await api.get("/users", { params: { search } });
      setProfiles(response.data.body.users);
      setIsAuthenticated(response.data.body.authenticated);
    };

    const debounceFetch = setTimeout(fetchProfiles, 300);

    return () => clearTimeout(debounceFetch);
  }, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    setSearch(newSearch);
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("search", newSearch);
    window.history.pushState(null, "", `?${queryParams.toString()}`);
  };

  return (
    <div className="flex justify-center">
      <div className="artdecoCard max-w-[100vw] md:max-w-[90vw] flex flex-col p-8 pb-12">
        <Input
          className="mx-4 bg-muted max-w-[60%] sm:max-w-[40%] mt-4"
          placeholder="Search for users"
          value={search}
          onChange={handleSearchChange}
        />
        <div className="flex flex-row justify-between items-center mx-4 mt-6">
          <p className="text-lg">People you may know near your area</p>
          <Button variant={"secondary"} className="text-muted-foreground">
            See all
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-4 mb-8 pb-4">
          {profiles.map((profile: Profile) => (
            <ProfileCard
              key={profile.id}
              id={profile.id}
              name={profile.name}
              profile_photo={profile.profile_photo}
              isConnected={profile.isConnected}
              mutual={profile.mutual}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
