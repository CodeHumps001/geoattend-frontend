import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://geoattend-backend-0tjn.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("klassrep_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("klassrep_token");
      localStorage.removeItem("klassrep_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
