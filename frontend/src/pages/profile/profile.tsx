import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserPlus, UserMinus} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api"; //buat fetch data

interface ProfileData {
  name: string;
  profile_photo: string;
  work_history: string;
  skills: string;
  connection_count: number;
  relevant_posts?: string[];
  relation: "unauthorized" | "unconnected" | "connected" | "owner";
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  //   useEffect(() => {
  //     const fetchProfile = async () => {
  //       try {
  //         const response = await api.get(`/profile/${id}`);
  //         setProfileData(response.data.body);
  //       } catch (error) {
  //         navigate("/");
  //       }
  //     };

  //     fetchProfile();
  //   }, [id, navigate]);

  const fetchDummyProfile = () => {
    const dummyProfile: ProfileData = {
      name: "Rayhan F.A",
      profile_photo: "",
      work_history: "Mahasiswa ITB GAJELAS",
      skills: "belom ada, masi cupu bang",
      connection_count: 173,
      relevant_posts: [
        "Post 1: Bolos matkul adalah kesukaanku",
        "Post 2: i love ITB",
      ],
      relation: "connected",
    };

    setTimeout(() => {
      setProfileData(dummyProfile);
    }, 200);
  };

  useEffect(() => {
    fetchDummyProfile();
  }, []);

  if (!profileData) {
    return;
  }

  const {name, profile_photo, work_history, skills, connection_count, relevant_posts, relation} = profileData;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative bg-white shadow-md rounded-lg overflow-hidden">
        <div className="h-[150px] bg-[#a0b4b7]" />
        <div className="absolute left-8 bottom-[122px]">
          <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden">
            <img
              src={profile_photo || "../profile.svg"}
              alt="Profile picture"
              width={128}
              height={128}
              className="object-cover z-50"
            />
          </div>
        </div>

        {relation === "owner" && (
          <button
            className="absolute top-6 right-6 flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-md hover:bg-blue-700"
            onClick={() => navigate(`/profile/edit/`)}
            // (`/profile/edit/${id}`) nanti routingnya diganti
          >
            Edit Profile
          </button>
        )}

        <div className="pt-16 px-11 bg-white h-[180px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold">{name}</h1>
              <p className="text-blue-600 text-sm">{connection_count} Connections</p>
            </div>
          </div>

            {/* Masih kurang logic buat connect dan unconnectnya nya */}
          <div className="flex gap-2 mt-2">
            {relation === "unconnected" && (
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => console.log("Send connect request")}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Connect
              </Button>
            )}
            {relation === "connected" && (
              <Button
                variant="outline"
                onClick={() => console.log("Send unconnect request")}
              >
                <UserMinus className="mr-2 h-4 w-4" />
                Unconnect
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 bg-white shadow-md rounded-lg mt-7">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Work History</h2>
            <p className="text-gray-600 leading-relaxed">
              {work_history || "No job history available"}
            </p>
          </div>
        </div>
      </div>

        <div className="p-6 bg-white shadow-md rounded-lg mt-7">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Skills</h2>
              <p className="text-gray-600 leading-relaxed">
                {skills || "No skills available"}
                </p>
            </div>
          </div>
        </div>

      {(relation === "connected" || relation === "owner") && relevant_posts && (
        <div className="border rounded-lg p-6 shadow-md bg-white mt-7">
          <div className="flex justify-between items-start">
            <div className="space-y-2 w-full">
              <h2 className="text-xl font-semibold mb-4">Relevant Posts</h2>
              {relevant_posts.length ? (
                <ul className="space-y-2">
                  {relevant_posts.map((post, index) => (
                    <li key={index} className="p-4 border rounded-md">
                      {post}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No posts available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;