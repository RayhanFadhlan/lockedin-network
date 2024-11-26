import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import api from "@/lib/api";
import toast from "react-hot-toast";

const EditProfile = () => {
  const navigate = useNavigate();
  const { user_id } = useParams<{ user_id: string }>();
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [skills, setSkills] = useState<string>("");
  const [workHistory, setWorkHistory] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_SIZE_MB = 5;
  const validFileTypes = ["image/png", "image/jpeg", "image/jpg"];
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileValidation = (file: File) => {
    if (!validFileTypes.includes(file.type)) {
      setError("Only PNG, JPG, and JPEG files are allowed.");
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError("File size max 5MB.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (handleFileValidation(file)) {
        if (previewPhoto) {
          URL.revokeObjectURL(previewPhoto);
        }
        setProfilePhoto(file);
        setPreviewPhoto(URL.createObjectURL(file));
      }
    }
  };

  const handleClearPreviewPhoto = () => {
    if (previewPhoto) {
      URL.revokeObjectURL(previewPhoto);
    }
    setProfilePhoto(null);
    setPreviewPhoto(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log(workHistory);
    const formData = new FormData();
    if (profilePhoto) {
      formData.append("profile_photo", profilePhoto);
    }
    formData.append("username", username);
    formData.append("name", name);
    formData.append("skills", skills);
    formData.append("work_history", workHistory);

    await api
      .put(`/profile/${user_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        toast.success("Profile updated");
        navigate(`/profile/${user_id}`);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 space-y-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-semibold text-blue-500 mb-7">
          Edit Profile
        </h1>

        <div>
          <label className="block text-md font-medium text-gray-700 mb-2">
            Profile Photo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex justify-center items-center relative">
            {previewPhoto ? (
              <div className="relative">
                <img
                  src={previewPhoto}
                  alt="Preview"
                  className="object-cover rounded-full w-32 h-32"
                />
                <button
                  type="button"
                  onClick={handleClearPreviewPhoto}
                  className="z-50 absolute h-7 w-7 top-0 right-0 bg-red-500 text-white text-sm rounded-full  hover:bg-red-600 focus:outline-none"
                >
                  X
                </button>
              </div>
            ) : (
              <span className="text-gray-500">Click to Upload</span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        <div className="mt-6">
          <label
            htmlFor="username"
            className="block text-md font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="px-2 mt-1 w-full h-10 rounded-sm border shadow-sm text-md"
            placeholder="Enter your username"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="name"
            className="block text-md font-medium text-gray-700 mb-2"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-2 mt-1 w-full h-10 rounded-sm border shadow-sm text-md"
            placeholder="Enter your name"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="work_history"
            className="block text-md font-medium text-gray-700"
          >
            Work History
          </label>
          <ReactQuill
            theme="snow"
            value={workHistory}
            onChange={setWorkHistory}
            className="mt-2 h-32 mb-16"
          />
        </div>

        <div className="mt-24 sm:mt-6">
          <label
            htmlFor="skills"
            className="block text-md font-medium text-gray-700"
          >
            Skills
          </label>
          <ReactQuill
            theme="snow"
            value={skills}
            onChange={setSkills}
            className="mt-2 h-32 mb-16"
          />
        </div>

        <div className="mt-24 sm:mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => handleSubmit}
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
