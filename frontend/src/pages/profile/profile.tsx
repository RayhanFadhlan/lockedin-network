
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { Post } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { MultipurposeButton } from "@/components/multipurpose-button";

interface ProfileData {
  username: string;
  name: string;
  profile_photo: string;
  work_history: string;
  skills: string;
  connection_count: number;
  relevant_posts?: Post[];
  relation: "unauthorized" | "unconnected" | "connected" | "owner";
  relation_to: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user_id } = useParams<{ user_id: string }>();

  const { data, error, isLoading } = useQuery<ProfileData>({
    queryKey: ["profile", user_id],
    queryFn: async () => {
      const response = await api.get(`/profile/${user_id}`);
      return response.data.body;
    },
  });
  if (isLoading) return <div>Loading...</div>;
  if(error) {
    navigate("/");
  }

  if(!data){
    return null;
  }
  const {
    username,
    name,
    profile_photo,
    work_history,
    skills,
    connection_count,
    relevant_posts,
    relation,
    relation_to,
  } = data;

  

  // const fetchProfile = async () => {
  //   try {
  //     const response = await api.get(`/profile/${user_id}`);
  //     setProfileData(response.data.body);
  //   } catch (error) {
  //     console.error(error);
  //     navigate("/");
  //   }
  // };
  // useEffect(() => {

  //   fetchProfile();
  // }, [user_id, navigate]);

  // const handleConnect = async () => {
  //   await api
  //     .post(`/connection/send/${user_id}`)
  //     .then(() => {
  //       toast.success("Connection request sent");
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       toast.error(err.response.data.message);
  //     });
  // };

  // const handleUnconnect = async () => {
  //   await api
  //     .delete(`/connection/${user_id}`)
  //     .then(() => {
  //       toast.success("Connection removed");
  //     })
  //     .then(() => {
  //       fetchProfile();
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       toast.error(err.response.data.message);
  //     });
  // };



  // const {
  //   username,
  //   name,
  //   profile_photo,
  //   work_history,
  //   skills,
  //   connection_count,
  //   relevant_posts,
  //   relation,
  //   relation_to,
  // } = profileData;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative bg-white shadow-md rounded-lg overflow-hidden">
        <div className="h-[150px] bg-[url('/profile-banner.svg')]" />
        <div className="absolute left-8 bottom-[146px]">
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
          <Button
            variant={"default"}
            className="absolute top-6 right-6"
            onClick={() => navigate(`/profile/edit/${user_id}`)}
          >
            Edit profile
          </Button>
        )}

        <div className="pt-14 px-11 pb-8 bg-white h-[200px]">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold mt-1">{name}</h1>
              <p className="text-gray-500 text-sm mt-1">{username}</p>
              <button
                className="text-[#0a66c2] text-sm font-semibold pt-2 hover:underline"
                onClick={() => navigate(`/connections/${user_id}`)}
              >
                {connection_count} Connections
              </button>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <MultipurposeButton page="profile" idTarget={user_id} relation_to={relation_to} />
            {/* {relation === "unconnected" && (
              <Button
                variant={"default"}
                onClick={() => handleConnect()}
                className="text-sm h-8"
              >
                <UserPlus className=" h-4 w-4" />
                Connect
              </Button>
            )}
            {relation === "connected" && (
              <>
                <Button variant="default" className="text-sm h-8">
                  <MessageCircle className="h-4 w-4" />
                  Message
                </Button>
                <Button
                  variant="outline"
                  className="text-sm h-8"
                  onClick={() => handleUnconnect()}
                >
                  <UserMinus className="h-4 w-4" />
                  Unconnect
                </Button>
              </>
            )} */}
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

      {(relation === "connected" ||
        relation === "owner" ||
        relation === "unconnected") &&
        relevant_posts && (
          <div className="border rounded-lg p-6 shadow-md bg-white mt-7">
            <div className="flex justify-between items-start">
              <div className="space-y-2 w-full">
                <h2 className="text-xl font-semibold mb-4">Relevant Posts</h2>
                {relevant_posts.length ? (
                  <ul className="space-y-2">
                    {relevant_posts.map((post : Post) => (
                      <li key={post.id} className="p-4 border rounded-md">
                        {post.content}
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
