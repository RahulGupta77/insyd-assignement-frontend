"use client";

import { Suspense } from "react";

export default function UserLayout({ children }) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading user data...
        </div>
      }
    >
      {children}
    </Suspense>
  );
}
