import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token from localStorage on every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("klassrep_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          const token = parsed?.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
      } catch {}
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      typeof window !== "undefined" &&
      !window.location.pathname.includes("/login")
    ) {
      localStorage.removeItem("klassrep_user");
      localStorage.removeItem("klassrep_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
