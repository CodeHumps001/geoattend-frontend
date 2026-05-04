import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://geoattend-backend-0tjn.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    // Try localStorage directly — works on both client and SSR fallback
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("geoattend_user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const token = parsed?.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch {}
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("geoattend_user");
      localStorage.removeItem("geoattend_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
