import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import api from "../../lib/api";
import toast from "react-hot-toast";
import { useAuth } from "@/hooks/authProvider";

interface LoginFormValues {
  identifier: string;
  password: string;
}

const Login = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState<LoginFormValues>({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [error, setError] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors: { identifier?: string; password?: string } = {};
    const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

    if (!formData.identifier) {
      errors.identifier = "Identifier (email or username) is required";
    } else if (
      formData.identifier.includes("@") &&
      !emailRegex.test(formData.identifier)
    ) {
      errors.identifier = "Invalid email format";
    }

    if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      console.log("Form submitted", formData);

      api
        .post("/login", formData)
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
            });
          });
        })
        .catch((err) => toast.error(err.response.data.message));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Sign in to LockedIn
        </h2>
        <form onSubmit={handleSubmit} className="mt-8">
          <label
            htmlFor="identifier"
            className="block text-sm font-medium text-gray-600"
          >
            Username / Email
          </label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            required
            className={`w-full mt-1 p-2 border ${
              error.identifier ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {error.identifier && (
            <p className="text-red-500 text-sm mt-1">{error.identifier}</p>
          )}

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
                error.password ? "border-red-500" : "border-gray-300"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
          {error.password && (
            <p className="text-red-500 text-sm mt-1">{error.password}</p>
          )}

          <button
            type="submit"
            className="w-full mt-6 py-2 px-4 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600"
            onClick={() => handleSubmit}
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          New to LockedIn?
          <button
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline focus:outline-none ml-2"
          >
            Join Now
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
