"use client";

import UserPage from "@/components/Userpage"; // You'll need to move your main component to components folder
import { useParams } from "next/navigation";

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.id;

  return <UserPage userId={userId} />;
}
