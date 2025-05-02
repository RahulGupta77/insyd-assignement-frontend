"use client";

import { getConnections, sendConnectRequest } from "@/services/connections";
import { getCurrentUserLikes, likeProfile } from "@/services/likes";
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllRead,
} from "@/services/notification";
import {
  getAllUsersFromServer,
  getSingleUserFromServer,
} from "@/services/users";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../hooks/useAuth";

export default function UserPage() {
  const { loading } = useAuth();
  const [user, setUser] = useState(null);
  const [allUserProfiles, setAllUserProfiles] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalConnections, setTotalConnections] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [notificationTrigger, setNotificationTrigger] = useState(false);
  const [unreadNotifications, setUnreadNotfications] = useState([]);
  const [readNotification, setReadNotification] = useState([]);
  const [userLikeConnectionTrigger, setUserLikeConnectionTrigger] =
    useState(false);

  const [likesNotificationTrigger, setLikesNotificationTrigger] =
    useState(false);

  useEffect(() => {
    const localStorageUser = localStorage.getItem("user");
    if (localStorageUser) {
      setUser(JSON.parse(localStorageUser));
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setLikesNotificationTrigger((prev) => !prev); // toggle trigger
    }, 5000); // every 5 seconds

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  useEffect(() => {
    const getAllUsers = async () => {
      try {
        // Step 1: Get user list
        const response = await getAllUsersFromServer();
        const serverUsers = response?.users || [];

        // Step 2: Fetch each user profile in parallel
        const profiles = await Promise.all(
          serverUsers.map(async (user) => {
            try {
              const res = await getSingleUserFromServer(user._id);
              return res.user;
            } catch (err) {
              console.error("Error fetching profile for:", user._id);
              return null; // or fallback user object
            }
          })
        );

        // Step 3: Filter out any nulls (in case of failed fetches)
        const validProfiles = profiles.filter(Boolean);
        setAllUserProfiles(validProfiles);
      } catch (error) {
        toast.error("Unable to fetch all users");
      }
    };

    getAllUsers();
  }, [userLikeConnectionTrigger]);

  useEffect(() => {
    const getLikesCount = async () => {
      try {
        const response = await getCurrentUserLikes();
        setTotalLikes(response?.users?.length || 0);
      } catch (error) {
        toast.error("Unable to fetch likes");
      }
    };

    const getConnectionsFromServer = async () => {
      try {
        const response = await getConnections();
        setTotalConnections(response?.connections || []);
      } catch (error) {
        toast.error("Unable to fetch Connection");
      }
    };

    getConnectionsFromServer();
    getLikesCount();
  }, [likesNotificationTrigger]);

  useEffect(() => {
    const getNotificationsFromServer = async () => {
      try {
        const response = await getNotifications();
        const totalNotifications = response?.notifications || [];
        setAllNotifications(totalNotifications);
        setUnreadNotfications(totalNotifications.filter((n) => !n?.isRead));
        setReadNotification(totalNotifications.filter((n) => n?.isRead));
      } catch (error) {
        toast.error("Unable to fetch Connection");
      }
    };

    const getUnreadNotificationsCountFromServer = async () => {
      try {
        const response = await getUnreadNotificationCount();
        setUnreadNotificationCount(response?.unreadCount || 0);
      } catch (error) {
        toast.error("Unable to fetch Connection");
      }
    };

    getUnreadNotificationsCountFromServer();
    getNotificationsFromServer();
  }, [notificationTrigger, likesNotificationTrigger]);

  const markUnreadMessages = async () => {
    const allNotificationIds = unreadNotifications.map((n) => n.id);

    if (!allNotificationIds?.length) {
      toast.error("No Unread Messages found");
      return;
    }

    try {
      const response = await markAllRead(allNotificationIds);

      if (response?.success) {
        setNotificationTrigger((prev) => !prev);
        toast.success("Marked all unread notifications as read");
      }
    } catch (error) {
      toast.error("Unable to Mark notifcation as read");
    }
  };

  const makeLike = async (userId) => {
    try {
      const response = await likeProfile(userId);

      if (response?.success) {
        setUserLikeConnectionTrigger((prev) => !prev);
      }
    } catch (error) {
      toast.error("Unable to like a profile");
    }
  };

  const makeConnection = async (userId) => {
    try {
      const response = await sendConnectRequest(userId);

      if (response?.success) {
        setUserLikeConnectionTrigger((prev) => !prev);
      }

      if (response?.success) {
        toast.success("Connection invite sent!");
      }
    } catch (error) {
      toast.error("Unable to connect a profile");
    }
  };

  if (!allUserProfiles || !allUserProfiles.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-1/4 p-4 bg-white shadow-md">
        <div className="flex flex-col items-center">
          <img
            src={user?.avatarUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
          <h2 className="text-xl font-bold mt-2">{user?.username}</h2>
          <p className="mt-1 text-sm">❤️ Likes: {totalLikes}</p>
          <p className="text-sm">
            🔗 Connections: {totalConnections?.length || 0}
          </p>
          <p className="text-sm">
            🔔 Notifications: {allNotifications?.length || 0}
          </p>
        </div>

        <div className="mt-4">
          <button
            onClick={() => markUnreadMessages()}
            className="bg-purple-600 text-sm cursor-pointer mx-auto  text-white px-2 py-1 rounded-sm shadow hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          >
            Mark All as Read
          </button>
        </div>

        {/* Notifications Accordions */}
        <div className="mt-3">
          <details className="mb-4">
            <summary className="cursor-pointer font-medium">
              Unread Notifications ({unreadNotificationCount})
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
              Read Notifications (
              {(allNotifications?.length || 0) - unreadNotificationCount})
            </summary>
            <ul className="list-disc list-inside mt-2 text-sm">
              {readNotification?.map((n) => (
                <li key={n.id}>{n.message}</li>
              ))}
            </ul>
          </details>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold mb-4">Discover Users</h1>
          <button
            onClick={() => {
              setUserLikeConnectionTrigger((prev) => !prev);
              toast.success("Fetched all users from server");
            }}
            className="bg-purple-600 text-sm cursor-pointer   text-white px-2 py-1 rounded-sm shadow hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          >
            Refresh Users
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allUserProfiles.map((user) => (
            <div key={user?.id} className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={user?.avatarUrl}
                alt={user?.username}
                className="w-full h-32 object-cover rounded-md"
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
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-purple-500 hover:bg-purple-600"
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
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                  disabled={user?.connectionStatus === "pending"}
                >
                  {user?.connectionStatus === "pending" ? "Pending" : "Connect"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
