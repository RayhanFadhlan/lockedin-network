import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProfileCard from "@/components/user-card";

const profiles = [
  {
    id: "1",
    name: "Rafly Hanggaraksa",
    profile_photo: "/profile.svg",
    mutual: "46",
    isConnected: true,
  },
  {
    id: "2",
    name: "Ananda Shaafiyah",
    profile_photo: "/profile.svg",
    mutual: "46",

    isConnected: false,
  },
  {
    id: "1",
    name: "Rafly Hanggaraksa",
    profile_photo: "/profile.svg",
    mutual: "46",

    isConnected: true,
  },
  {
    id: "2",
    name: "Ananda Shaafiyah",
    profile_photo: "/profile.svg",
    mutual: "46",

    isConnected: false,
  },
  {
    id: "1",
    name: "Rafly Hanggaraksa",
    profile_photo: "/profile.svg",
    mutual: "46",

    isConnected: true,
  },
  {
    id: "2",
    name: "Ananda Shaafiyah",
    profile_photo: "/profile.svg",
    mutual: "46",
    isConnected: false,
  },
];

const isAuthenticated = false;

const UserList = () => {
  return (
    <div className="flex justify-center">
      <div className="artdecoCard max-w-[100vw] md:max-w[90vw] flex flex-col p-8">
        <Input
          className="mx-4 bg-muted max-w-[60%] sm:max-w-[40%] mt-4"
          placeholder="Search for users"
        />
        <div className="flex flex-row justify-between items-center mx-4 mt-6">
          <p className="text-lg">People you may know near your area</p>
          <Button variant={'secondary'} className="text-muted-foreground">See all</Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 mx-4">
          {profiles.map((profile) => (
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
