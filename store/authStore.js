import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem("geoattend_token", token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem("geoattend_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "geoattend_user",
    },
  ),
);

export default useAuthStore;
