"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthToggle from "../components/auth/AuthToggle";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push(`/user/${user.username}`);
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
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to Insyd</h1>
      </div>

      <AuthToggle />
    </div>
  );
}
