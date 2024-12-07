import React, { useEffect, useState }  from "react";
import api from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  profile_photo: string;
  name: string;
  degree: "2nd" | "3rd";
}


const RecommendationFriends: React.FC = () => {
    const [listUser, setListUser] = useState<User[]>([]);
    const navigate = useNavigate();

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
          const limitedData = combinedData.slice(0, 5);

          console.log(limitedData);
          setListUser(limitedData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRecommendedConnections();
  }, []);
  
    return (
    <div className="bg-white p-6 rounded-lg border border-gray-300 w-full md:w-[260px]">
      <h3 className="text-md font-semibold text-left mb-4">People you may know</h3>
      {listUser.length > 0 ? (
        listUser.map((user) => (
          <div
            key={user.id}
            className="flex-col flex items-center border-b p-4 hover:shadow-md hover:bg-gray-100 cursor-pointer transition duration-300"
            onClick={() => navigate(`/profile/${user.id}`)}
          >
            <img
              src={user.profile_photo}
              alt={`${user.name}'s profile`}
              className="w-16 h-16 rounded-full object-cover mb-2"
            />

            <h2 className="font-medium text-md text-center">
              {user.name}
            </h2>

            <p className="text-gray-500 text-sm mt-1">{user.degree} connection</p>

            <button className="bg-blue-600 text-white px-4 py-1 rounded-md mt-2">
                blom connect
            </button>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No Recommendation Friends Available</p>
      )}
      <div className="mt-5 flex justify-center">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition"
            onClick={() => navigate("/recommended/connections")}
        >
          Show All
        </button>
      </div>
    </div>
  );
};

export default RecommendationFriends;
