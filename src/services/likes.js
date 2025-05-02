import ApiClient from "./apiClient";

export const getCurrentUserLikes = async () => {
  try {
    const response = await ApiClient.get("/users/likes/received");
    return response;
  } catch (error) {
    throw new Error(error.message || "Cant fetch the likes");
  }
};

export const likeProfile = async (userId) => {
  try {
    const response = await ApiClient.post("/likes", { userId });
    return response;
  } catch (error) {
    throw new Error(error.message || "Unable to like the profile");
  }
};
