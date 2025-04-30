"use client";

import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData) => {
    // In a real app, you would verify credentials with a backend
    // For demo, we'll just store the user data
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    router.push(`/user/${userData.username}`);
  };

  // Signup function
  const signup = (userData) => {
    // In a real app, you would send this data to a backend
    // For demo, we'll just store the user data
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    router.push(`/user/${userData.username}`);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
