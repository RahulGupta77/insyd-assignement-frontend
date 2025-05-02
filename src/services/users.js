import ApiClient from "./apiClient";

export const getAllUsersFromServer = async () => {
  try {
    const response = await ApiClient.get("/users");
    return response;
  } catch (error) {
    throw new Error(error.message || "Cant get all users");
  }
};

export const getSingleUserFromServer = async (id) => {
  try {
    const response = await ApiClient.get("users/profile/" + id);
    return response;
  } catch (error) {
    throw new Error(error.message || "Cant get the requested user");
  }
};
