"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const PasswordInput = ({
  id,
  name,
  value,
  onChange,
  disabled = false,
  label = "Password",
  error = "",
  placeholder = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          className={`w-full px-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:outline-none transition-all duration-200 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-200"
              : "border-gray-300 focus:border-purple-500 focus:ring-purple-200"
          }`}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default PasswordInput;
