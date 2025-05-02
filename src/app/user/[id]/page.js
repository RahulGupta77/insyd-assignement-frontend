"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import UserProfile from "../../../components/user/UserProfile";
import { useAuth } from "../../../hooks/useAuth";

export default function UserPage() {
  const { loading } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localStorageUser = localStorage.getItem("user");
    if (localStorageUser) {
      setUser(JSON.parse(localStorageUser));
    }
  }, []);
  // Show loading state while checking auth

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <UserProfile user={user} username={user?.name || ""} />
    </div>
  );
}
