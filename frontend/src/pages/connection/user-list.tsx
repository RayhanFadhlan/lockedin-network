import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileCard from "@/components/user-card";
import api from "@/lib/api";
import { Profile } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {  useState } from "react";
import { useLocation } from "react-router-dom";
import { useDebounce } from "use-debounce";
const UserList = () => {
  const location = useLocation();
  const [search, setSearch] = useState(
    new URLSearchParams(location.search).get("search") || ""
  );

  const [debouncedSearch] = useDebounce(search, 500);
  const { data } = useQuery({
    queryKey: ['userlist', debouncedSearch],
    queryFn: async () => {
      const response = await api.get("/users", { params: { search: debouncedSearch } });
      return response.data.body;
    },
  });

  const profiles = data?.users ?? [];
  const isAuthenticated = data?.authenticated ?? false;
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
        <div className="flex flex-row">
          <Input
            className="mx-4 bg-muted mt-4 text-sm md:text-lg"
            placeholder="Search for users"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex flex-row justify-between items-center mx-4 mt-6">
          <p className="text-sm md:text-lg">People you may know near your area</p>
          <Button variant={"secondary"} className="text-muted-foreground">
            See all
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-4 mb-8 pb-4">
          {profiles.map((profile: Profile) => (
            <ProfileCard
              key={profile.id}
              id={profile.id}
              name={profile.name}
              profile_photo={profile.profile_photo}
              // isConnected={profile.isConnected}
              mutual={profile.mutual}
              isAuthenticated={isAuthenticated}
              relation_to={profile.relation_to}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;
