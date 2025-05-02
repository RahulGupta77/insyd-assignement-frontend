import { getConnections, sendConnectRequest } from "@/services/connections";
import { getCurrentUserLikes, likeProfile } from "@/services/likes";
import {
  getBroadcastedMessages,
  getNotifications,
  getUnreadNotificationCount,
  markAllRead,
} from "@/services/notification";
import {
  getAllUsersFromServer,
  getSingleUserFromServer,
} from "@/services/users";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import _ from "lodash";

import toast from "react-hot-toast";
import { useAuth } from "./useAuth";

export default function useUserData() {
  const { loading } = useAuth();
  const [user, setUser] = useState(null);
  const [allUserProfiles, setAllUserProfiles] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalConnections, setTotalConnections] = useState([]);
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [notificationTrigger, setNotificationTrigger] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotification, setReadNotification] = useState([]);
  const [userLikeConnectionTrigger, setUserLikeConnectionTrigger] =
    useState(false);
  const [broadcastMessages, setBroadcastedMessages] = useState([]);

  // Poll trigger with memoized previous values to compare changes
  const [pollTrigger, setPollTrigger] = useState(0);
  const prevUserProfiles = useRef(allUserProfiles);
  const prevTotalLikes = useRef(totalLikes);
  const prevTotalConnections = useRef(totalConnections);
  const prevNotifications = useRef(allNotifications);

  // Load user from localStorage only once
  useEffect(() => {
    const localStorageUser = localStorage.getItem("user");
    if (localStorageUser) {
      try {
        const parsedUser = JSON.parse(localStorageUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, []);

  // Set up polling with useRef to avoid unnecessary renders
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPollTrigger((prev) => prev + 1);
    }, 15000); // every 5 seconds

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  // Memoized function to fetch all users
  const getAllUsers = useCallback(async () => {
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
            return null;
          }
        })
      );

      // Step 3: Filter out any nulls and compare with previous state
      const validProfiles = profiles.filter(Boolean);

      // Only update state if there's a change
      if (!_.isEqual(validProfiles, prevUserProfiles.current)) {
        prevUserProfiles.current = validProfiles;
        setAllUserProfiles(validProfiles);
      }
    } catch (error) {
      console.error("Error fetching all users:", error);
      toast.error("Unable to fetch all users");
    }
  }, []);

  // Memoized function to fetch broadcasted messages
  const fetchBroadcastMessages = useCallback(async () => {
    try {
      const response = await getBroadcastedMessages();
      const broadcasts = response?.broadcasts || [];

      // Only update if there's a change
      setBroadcastedMessages((prevBroadcasts) => {
        if (_.isEqual(prevBroadcasts, broadcasts)) {
          return prevBroadcasts;
        }
        return broadcasts;
      });
    } catch (error) {
      console.error("Error fetching broadcast messages:", error);
      toast.error("Unable to fetch Broadcasted Messages");
    }
  }, []);

  // Memoized function to fetch likes and connections
  const fetchLikesAndConnections = useCallback(async () => {
    try {
      // Fetch likes and connections in parallel
      const [likesResponse, connectionsResponse] = await Promise.all([
        getCurrentUserLikes(),
        getConnections(),
      ]);

      const newLikesCount = likesResponse?.users?.length || 0;
      const newConnections = connectionsResponse?.connections || [];

      // Only update state if there's a change
      if (newLikesCount !== prevTotalLikes.current) {
        prevTotalLikes.current = newLikesCount;
        setTotalLikes(newLikesCount);
      }

      if (!_.isEqual(newConnections, prevTotalConnections.current)) {
        prevTotalConnections.current = newConnections;
        setTotalConnections(newConnections);
      }
    } catch (error) {
      console.error("Error fetching likes and connections:", error);
      toast.error("Unable to fetch likes or connections");
    }
  }, []);

  // Memoized function to fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const [notificationsResponse, unreadCountResponse] = await Promise.all([
        getNotifications(),
        getUnreadNotificationCount(),
      ]);

      const totalNotifications = notificationsResponse?.notifications || [];
      const unreadCount = unreadCountResponse?.unreadCount || 0;

      // Only update if there's a change
      if (!_.isEqual(totalNotifications, prevNotifications.current)) {
        prevNotifications.current = totalNotifications;
        setAllNotifications(totalNotifications);

        // Use lodash to partition the notifications
        const [unread, read] = _.partition(
          totalNotifications,
          (n) => !n?.isRead
        );
        setUnreadNotifications(unread);
        setReadNotification(read);
      }

      setUnreadNotificationCount((prevCount) => {
        if (prevCount === unreadCount) return prevCount;
        return unreadCount;
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error("Unable to fetch notifications");
    }
  }, []);

  // Poll data based on the pollTrigger
  useEffect(() => {
    fetchBroadcastMessages();
    fetchLikesAndConnections();
    fetchNotifications();
  }, [
    pollTrigger,
    userLikeConnectionTrigger,
    notificationTrigger,
    fetchBroadcastMessages,
    fetchLikesAndConnections,
    fetchNotifications,
  ]);

  // Memoized function to mark unread messages as read
  const markUnreadMessages = useCallback(async () => {
    if (!unreadNotifications?.length) {
      toast.error("No Unread Messages found");
      return;
    }

    const allNotificationIds = unreadNotifications.map((n) => n.id);

    try {
      const response = await markAllRead(allNotificationIds);

      if (response?.success) {
        setNotificationTrigger((prev) => !prev);
        toast.success("Marked all unread notifications as read");
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
      toast.error("Unable to mark notifications as read");
    }
  }, [unreadNotifications]);

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers, userLikeConnectionTrigger]);

  // Memoized function to like a profile
  const makeLike = useCallback(async (userId) => {
    try {
      const response = await likeProfile(userId);

      if (response?.success) {
        setUserLikeConnectionTrigger((prev) => !prev);
      }
    } catch (error) {
      console.error("Error liking profile:", error);
      toast.error("Unable to like a profile");
    }
  }, []);

  // Memoized function to make a connection
  const makeConnection = useCallback(async (userId) => {
    try {
      const response = await sendConnectRequest(userId);

      if (response?.success) {
        toast.success("Connection invite sent!");
        setUserLikeConnectionTrigger((prev) => !prev);
      }
    } catch (error) {
      console.error("Error connecting to profile:", error);
      toast.error("Unable to connect a profile");
    }
  }, []);

  // Memoize derived data to prevent unnecessary calculations
  const userStats = useMemo(
    () => ({
      likesCount: totalLikes,
      connectionsCount: totalConnections.length,
      unreadNotifications: unreadNotificationCount,
    }),
    [totalLikes, totalConnections.length, unreadNotificationCount]
  );

  return {
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
    userStats,
    markUnreadMessages,
    makeLike,
    makeConnection,
    refreshPollData: () => {
      setPollTrigger((prev) => prev + 1);
    },
    refreshAllUsers: () => {
      setUserLikeConnectionTrigger((prev) => !prev);
    },
  };
}
