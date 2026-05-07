// ─────────────────────────────────────────────
// API Client — Axios instance with JWT interceptor
// Automatically attaches Bearer token and handles 401
// ─────────────────────────────────────────────
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// ── Request Interceptor: Attach JWT ──
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ehr-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response Interceptor: Auto-logout on 401 ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("ehr-token");
      localStorage.removeItem("ehr-user");
      // Only redirect if not already on a login page
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
