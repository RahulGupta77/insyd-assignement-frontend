"use client";

import authService from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { validatePassword, validateUsername } from "../../utils/validation";
import PasswordInput from "./PasswordInput";

const LoginForm = ({ onToggleForm }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      username: validateUsername(formData.username),
      password: validatePassword(formData.password),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.login(
        formData.username,
        formData.password
      );

      toast.success(response?.message);
      localStorage.setItem("user", JSON.stringify(response?.user));
      setFormData({ username: "", password: "" });
      const userId = response?.user?.id;

      if (userId) {
        router.push(`/user/${userId}`);
      }
    } catch (error) {
      toast.error("Failed to sign up. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[340px]">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Welcome back</h2>

      <div className="space-y-5">
        {errors.general && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {errors.general}
          </div>
        )}

        <div>
          <label
            htmlFor="username"
            className="block mb-2 text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 ${
              errors.username
                ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:border-purple-500 focus:ring-purple-200"
            }`}
            value={formData.username}
            onChange={handleChange}
            disabled={isSubmitting}
            placeholder="Enter your username"
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
          )}
        </div>

        <PasswordInput
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
          error={errors.password}
          placeholder="Enter your password"
        />

        <div className="pt-2">
          <button
            onClick={(e) => handleSubmit(e)}
            className="w-full px-4 py-2 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-2 transition-colors duration-300 disabled:opacity-70"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </button>
        </div>

        <p className="text-center mt-4 text-sm text-gray-600">
          Dont have an account?{" "}
          <button
            type="button"
            onClick={() => onToggleForm && onToggleForm(false)}
            className="text-purple-600 font-medium hover:text-purple-800"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
