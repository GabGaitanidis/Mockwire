/// <reference types="vite/client" />
import axios from "axios";

// 1. Set up the dynamic URL based on Vite's environment variables
const API_BASE_URL =
  import.meta.env.MODE === "development"
    ? "/api"
    : import.meta.env.VITE_API_URL;

// 2. Pass the dynamic URL into the instance creation
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// 3. Keep your excellent 401 Unauthorized interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage
      localStorage.removeItem("user");
      localStorage.removeItem("apiKey");

      // Force redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
