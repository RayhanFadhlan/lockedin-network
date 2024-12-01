import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/authProvider";
import { subscribeUser } from "@/lib/notification";

interface RegisterFormData {
  username: string;
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}

const SignUp = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateEmail = () => {
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    const newErrors: { email?: string } = {};
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswords = () => {
    const newErrors: { password?: string; confirmPassword?: string } = {};
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail() && validatePasswords()) {
      console.log("Form submitted", formData);

      api
        .post("/register", formData)
        .then((res) => {
          toast.success(res.data.message);
          navigate("/");
        })
        .then(() => {
          api.get("/self").then((res) => {
            login({
              userId: res.data.body.userId,
              name: res.data.body.name,
              email: res.data.body.email,
              username: res.data.body.username,
              profile_photo: res.data.body.profile_photo,
            });
          });
        })
        .then(async() => await subscribeUser())
        .catch((err) => toast.error(err.response.data.message));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Make the most of your professional life
        </h2>
        <form onSubmit={handleSubmit} className="mt-8">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-600"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedinblue"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600 mt-4"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full mt-1 p-2 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-linkedinblue`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600 mt-4"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-linkedinblue"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mt-4"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`w-full mt-1 p-2 border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-linkedinblue`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute mt-4 right-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiOutlineEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-600 mt-4"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className={`w-full mt-1 p-2 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                } rounded-md focus:outline-none focus:ring-2 focus:ring-linkedinblue`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute mt-4 right-3 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible className="h-5 w-5" />
                ) : (
                  <AiOutlineEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-2 px-4 bg-linkedinblue text-white font-medium rounded-md hover:bg-blue-600"
            onClick={() => handleSubmit}
          >
            Agree & Join
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already on Lockedin?
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline focus:outline-none ml-2"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
