import axios from "axios";

// Change this based on your backend address
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// OPTIONAL: Add interceptors for debugging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
