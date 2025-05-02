"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthToggle = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Tab Buttons */}
      <div className="grid grid-cols-2">
        <button
          className={`py-4 cursor-pointer text-center font-medium transition-colors duration-300 ${
            isLogin
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700 border-white"
          }`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`py-4 cursor-pointer text-center font-medium transition-colors duration-300 ${
            !isLogin
              ? "text-purple-600 border-b-2 border-purple-600"
              : "text-gray-500 hover:text-gray-700 border-white"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Sign up
        </button>
      </div>

      {/* Form Container */}
      <div className="p-6">
        {isLogin ? (
          <LoginForm onToggleForm={setIsLogin} />
        ) : (
          <SignupForm
            onSuccess={() => setIsLogin(true)}
            onToggleForm={setIsLogin}
          />
        )}
      </div>
    </div>
  );
};

export default AuthToggle;
