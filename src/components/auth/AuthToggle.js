"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

const AuthToggle = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6 flex">
        <button
          className={`flex-1 py-3 text-center font-medium ${
            isLogin
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`flex-1 py-3 text-center font-medium ${
            !isLogin
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setIsLogin(false)}
        >
          Signup
        </button>
      </div>

      <div className="form-container">
        {isLogin ? (
          <LoginForm />
        ) : (
          <SignupForm onSuccess={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};

export default AuthToggle;
