import { ROOT_BACKEND_URL } from "@/constants";
import axios from "axios";

const ApiClient = axios.create({
  baseURL: ROOT_BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
ApiClient.interceptors.request.use(
  (config) => {
    // Add authorization token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
ApiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle errors globally
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      // localStorage.removeItem("token");
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default ApiClient;
