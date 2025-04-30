"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { validatePassword, validateUsername } from "../../utils/validation";

const LoginForm = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      try {
        // In a real app, you would verify credentials with a backend
        // For demo purposes, we'll just log the user in
        login({
          username: formData.username,
          // Don't include password in user object for security
        });

        // Form submission successful
        setFormData({
          username: "",
          password: "",
        });
      } catch (error) {
        setErrors({
          general: "Failed to login. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Login to your account</h2>

      {errors.general && (
        <div className="p-3 bg-red-100 text-red-700 rounded-md">
          {errors.general}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block mb-1 font-medium">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="input-field"
          value={formData.username}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.username && <p className="form-error">{errors.username}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block mb-1 font-medium">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="input-field"
          value={formData.password}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.password && <p className="form-error">{errors.password}</p>}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? <span>Logging in...</span> : <span>Login</span>}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
