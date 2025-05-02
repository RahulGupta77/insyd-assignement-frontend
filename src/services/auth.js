import ApiClient from "./apiClient";

const authService = {
  login: async (username, password) => {
    try {
      const response = await ApiClient.post("/auth/login", {
        username,
        password,
      });
      // Store token if provided in response
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      return response;
    } catch (error) {
      throw new Error(error.message || "Login failed");
    }
  },

  signup: async (username, password) => {
    try {
      const response = await ApiClient.post("/auth/signup", {
        username,
        password,
      });
      // Store token if provided in response
      if (response.token) {
        localStorage.setItem("token", response.token);
      }
      return response;
    } catch (error) {
      throw new Error(error.message || "Signup failed");
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

export default authService;
