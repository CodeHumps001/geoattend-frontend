import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        localStorage.setItem("klassrep_token", token);
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem("klassrep_token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "klassrep_user",
    },
  ),
);

export default useAuthStore;
