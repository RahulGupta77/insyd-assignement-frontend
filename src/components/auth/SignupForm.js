"use client";

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import {
  validateConfirmPassword,
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../utils/validation";

const SignupForm = ({ onSuccess }) => {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    // Special case for confirmPassword
    if (name === "password" && formData.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value !== formData.confirmPassword ? "Passwords do not match" : "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      username: validateUsername(formData.username),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
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
        // In a real app, you would send this data to a backend
        signup({
          username: formData.username,
          email: formData.email,
          // Don't include password in user object for security
        });

        // Form submission successful
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Optionally switch to login after successful signup
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        setErrors({
          general: "Failed to sign up. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Create an account</h2>

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
        <label htmlFor="email" className="block mb-1 font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="input-field"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.email && <p className="form-error">{errors.email}</p>}
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

      <div>
        <label htmlFor="confirmPassword" className="block mb-1 font-medium">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className="input-field"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isSubmitting}
        />
        {errors.confirmPassword && (
          <p className="form-error">{errors.confirmPassword}</p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span>Creating account...</span>
          ) : (
            <span>Sign Up</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default SignupForm;
