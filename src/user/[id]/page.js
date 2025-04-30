"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UserProfile from "../../../components/user/UserProfile";
import { useAuth } from "../../../hooks/useAuth";

export default function UserPage({ params }) {
  const { id: username } = params;
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

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
      <UserProfile username={username} />
    </div>
  );
}
