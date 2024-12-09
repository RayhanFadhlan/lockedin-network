import { UserRecommendation } from "@/components/recommendation-card";
import { Button } from "@/components/ui/button";
import ProfileCard from "@/components/user-card";
import api from "@/lib/api";
import { useEffect, useState } from "react";

const RecommendationList = () => {
  const [listUser, setListUser] = useState<UserRecommendation[]>([]);

  useEffect(() => {
    const fetchRecommendedConnections = async () => {
      try {
        const response = await api.get("/connection/recommended");
        const combinedData = [
          ...response.data.body.secondDegree.map((user: UserRecommendation) => ({
            ...user,
            id: String(user.id),
            degree: "2nd",
          })),
          ...response.data.body.thirdDegree.map((user: UserRecommendation) => ({
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
          {listUser.map((profile: UserRecommendation) => (
            <ProfileCard
              key={profile.id}
              id={profile.id}
              name={profile.name}
              profile_photo={profile.profile_photo}
              mutual={profile.mutual}
              isAuthenticated={true}
              relation_to={profile.relation_to}
              degree={profile.degree}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationList;
