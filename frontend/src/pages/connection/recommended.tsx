import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/user-card";
import api from "@/lib/api";
import { Profile } from "@/lib/types";
import { useEffect, useState } from "react";

const RecommendationList = () => {
  const [listUser, setListUser] = useState<Profile[]>([]);

  useEffect(() => {
    const fetchRecommendedConnections = async () => {
      try {
        const response = await api.get("/connection/recommended");
        const combinedData = [
          ...response.data.body.secondDegree.map((user: any) => ({
            ...user,
            id: String(user.id),
            degree: "2nd",
          })),
          ...response.data.body.thirdDegree.map((user: any) => ({
            ...user,
            id: String(user.id),
            degree: "3rd",
          })),
        ];

        setListUser(combinedData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecommendedConnections();
  }, []);

  return (
    <div className="flex justify-center">
      <div className="artdecoCard max-w-[100vw] md:max-w-[90vw] flex flex-col p-8 pb-12">
        <div className="flex flex-row justify-between items-center mx-4 mt-6">
          <p className="text-lg">People you may know near your area</p>
          <Button variant="secondary" className="text-muted-foreground">
            See all
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-4 mb-8 pb-4">
          {listUser.map((profile: Profile) => (
            <ProfileCard
              key={profile.id}
              id={profile.id}
              name={profile.name}
              profile_photo={profile.profile_photo}
              isConnected={profile.isConnected}
              mutual={profile.mutual}
            //   kasih degreenya rayhan
            // diganti dah formatnya
              isAuthenticated={true}
              relation_to={profile.relation_to}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationList;
