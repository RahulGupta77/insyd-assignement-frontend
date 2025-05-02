import ApiClient from "./apiClient";

export const getConnections = async () => {
  try {
    const response = await ApiClient.get("/connections/received");
    return response;
  } catch (error) {
    throw new Error(error.message || "Cant fetch the Connection");
  }
};

export const sendConnectRequest = async (userId) => {
  try {
    const response = await ApiClient.post("/connections/request", { userId });
    return response;
  } catch (error) {
    throw new Error(error.message || "Unable to like the profile");
  }
};
