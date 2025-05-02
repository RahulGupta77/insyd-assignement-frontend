import ApiClient from "./apiClient";

export const getNotifications = async () => {
  try {
    const response = await ApiClient.get("/notifications");
    return response;
  } catch (error) {
    throw new Error(error.message || "Cant fetch the Notification");
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const response = await ApiClient.get("/notifications/unread-count");
    return response;
  } catch (error) {
    throw new Error(error.message || "Cant fetch the Unread Notification");
  }
};

export const markAllRead = async (notificationIds) => {
  try {
    const response = await ApiClient.post("/notifications/mark-read", {
      notificationIds,
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Cant fetch the Unread Notification");
  }
};

export const getBroadcastedMessages = async () => {
  try {
    const response = await ApiClient.get("/users/broadcast");
    return response;
  } catch (error) {
    throw new Error(error.message || "Cant fetch Broadcasted Messages");
  }
};

export const sendBroadcastedMessage = async (notificationTemplateId) => {
  try {
    const response = await ApiClient.post("/users/broadcast", {
      notificationTemplateId,
    });
    return response;
  } catch (error) {
    throw new Error(error.message || "Cant fetch Broadcasted Messages");
  }
};
