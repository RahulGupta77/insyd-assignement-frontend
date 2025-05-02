"use client";

import { broadcastMessageTemplates } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import useUserData from "@/hooks/useUserData";
import { sendBroadcastedMessage } from "@/services/notification";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

export default function UserPage({ userId }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [isClient, setIsClient] = useState(false);

  // Use the custom hook to get all the data and methods
  const {
    loading,
    user,
    allUserProfiles,
    totalLikes,
    totalConnections,
    allNotifications,
    unreadNotificationCount,
    unreadNotifications,
    readNotification,
    broadcastMessages,
    markUnreadMessages,
    makeLike,
    makeConnection,
    refreshPollData,
    refreshAllUsers,
  } = useUserData(userId); // Pass the userId if needed by your hook

  // Handle hydration issues by confirming we're on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize computed values to prevent recalculation on every render
  const readNotificationsCount = useMemo(
    () => (allNotifications?.length || 0) - (unreadNotificationCount || 0),
    [allNotifications, unreadNotificationCount]
  );

  const totalNotifications = useMemo(
    () => (allNotifications?.length || 0) + (broadcastMessages?.length || 0),
    [allNotifications, broadcastMessages]
  );

  // Show loading state
  if (!isClient || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  // Handle case when user data failed to load
  if (!user && !loading) {
    return (
      <div className="flex justify-center items-center h-screen flex-col">
        <div className="text-center">
          <p className="text-xl text-red-500">Failed to load user data</p>
          <button
            onClick={() => router.push("/login")}
            className="mt-4 bg-purple-600 text-white px-4 py-2 rounded"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 p-4 bg-white shadow-md">
        <div className="flex flex-col items-center">
          <img
            src={user?.avatarUrl || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />
          <h2 className="text-xl font-bold mt-2">{user?.username || "User"}</h2>
          <p className="mt-1 text-sm">❤️ Likes: {totalLikes || 0}</p>
          <p className="text-sm">
            🔗 Connections: {totalConnections?.length || 0}
          </p>
          <p className="text-sm">🔔 Notifications: {totalNotifications || 0}</p>
        </div>

        <div className="mt-4">
          <button
            onClick={markUnreadMessages}
            className="bg-purple-600 text-sm cursor-pointer mx-auto text-white px-2 py-1 rounded-sm shadow hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            disabled={!unreadNotifications?.length}
          >
            Mark Unread as Read
          </button>
        </div>

        {/* Notifications Accordions */}
        <div className="mt-3">
          <details className="mb-4">
            <summary className="cursor-pointer font-medium">
              Unread Notifications ({unreadNotificationCount || 0})
            </summary>
            <ul className="list-disc list-inside mt-2 text-sm">
              {unreadNotifications?.map((n) => (
                <li className="mt-1" key={n.id}>
                  {n.message}
                </li>
              ))}
            </ul>
          </details>

          <details>
            <summary className="cursor-pointer font-medium">
              Read Notifications ({readNotificationsCount || 0})
            </summary>
            <ul className="list-disc list-inside mt-2 text-sm">
              {readNotification?.map((n) => (
                <li key={n.id}>{n.message}</li>
              ))}
            </ul>
          </details>
        </div>

        <div className="mt-3">
          <details>
            <summary className="cursor-pointer font-medium">
              Broadcasted Notifications ({broadcastMessages?.length || 0})
            </summary>
            <ul className="list-disc list-inside mt-2 text-sm">
              {broadcastMessages?.map((n) => (
                <li className="mt-3" key={n._id}>
                  <span className="text-xs">{n.message}</span> -Sent By{" "}
                  {n?.fromUser?.username}
                </li>
              ))}
            </ul>
          </details>
        </div>

        <div className="mt-3">
          <details>
            <summary className="cursor-pointer font-medium">
              Broadcast Message to All Users
            </summary>
            <ul className="list-disc list-inside mt-2 text-sm space-y-3">
              {broadcastMessageTemplates.map((template) => (
                <li
                  key={template.id}
                  className="list-none border p-2 rounded shadow-sm bg-gray-50"
                >
                  <p className="text-xs mb-2">{template.messageContent}</p>
                  <button
                    onClick={async () => {
                      try {
                        await sendBroadcastedMessage(template.id);
                        toast.success("Broadcasted this message to everyone!");
                        refreshPollData();
                      } catch (err) {
                        toast.error(err?.message || "Error sending broadcast");
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-800 cursor-pointer transition text-white text-xs px-3 py-1 rounded"
                  >
                    Broadcast
                  </button>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
          <h1 className="text-2xl font-bold mb-4">Discover Users</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                refreshAllUsers();
                toast.success("Fetched all users from server");
              }}
              className="bg-purple-600 text-sm cursor-pointer text-white px-2 py-1 rounded-sm shadow hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            >
              Refresh Users
            </button>

            <button
              onClick={logout}
              className="bg-purple-600 text-sm cursor-pointer text-white px-2 py-1 rounded-sm shadow hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {allUserProfiles && allUserProfiles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {allUserProfiles.map((user) => (
              <div key={user?.id} className="bg-white p-4 rounded-lg shadow-md">
                <img
                  src={user?.avatarUrl || "/default-avatar.png"}
                  alt={user?.username || "User"}
                  className="w-full h-32 object-cover rounded-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <h3 className="text-lg font-semibold mt-2">{user.username}</h3>
                <div className="flex justify-between mt-3 text-sm">
                  <button
                    onClick={() => {
                      if (user?.liked) {
                        toast.error("User is already liked");
                        return;
                      }
                      makeLike(user?.id);
                    }}
                    className={`px-3 py-1 rounded text-white ${
                      user?.liked
                        ? "bg-red-500 hover:bg-red-600 cursor-not-allowed"
                        : "bg-purple-500 hover:bg-purple-600 cursor-pointer"
                    }`}
                  >
                    {user?.liked ? "Liked" : "Like"}
                  </button>

                  <button
                    onClick={() => {
                      if (user?.connectionStatus === "none") {
                        makeConnection(user?.id);
                      }
                    }}
                    className={`px-3 py-1 rounded text-white ${
                      user?.connectionStatus === "pending"
                        ? "bg-yellow-500 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 cursor-pointer "
                    }`}
                    disabled={user?.connectionStatus === "pending"}
                  >
                    {user?.connectionStatus === "pending"
                      ? "Pending"
                      : "Connect"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p>No users found. Try refreshing the page.</p>
          </div>
        )}
      </main>
    </div>
  );
}
