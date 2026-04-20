/// <reference types="vite/client" />
import axios from "axios";

function getApiBaseUrl() {
  if (import.meta.env.PROD) {
    return (
      import.meta.env.VITE_API_URL_PROD ??
      import.meta.env.VITE_API_URL ??
      "https://api-generator-7lxt.onrender.com"
    );
  }

  return (
    import.meta.env.VITE_API_URL_DEV ??
    import.meta.env.VITE_API_URL ??
    "http://localhost:5000"
  );
}

const API_BASE_URL = getApiBaseUrl();

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("apiKey");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
