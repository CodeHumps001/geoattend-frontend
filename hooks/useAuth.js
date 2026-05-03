import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useAuthStore from "@/store/authStore";
import api from "@/lib/axios";

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();

  // Fetch full profile on every session to get student/lecturer details
  const { data: profileData } = useQuery({
    queryKey: ["me", user?.id],
    queryFn: async () => {
      const res = await api.get("/api/v1/auth/me");
      return res.data.data;
    },
    enabled: !!isAuthenticated,
  });

  const fullUser = profileData?.user || user;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return {
    user: fullUser,
    token,
    isAuthenticated,
    setAuth,
    logout: handleLogout,
    isStudent: fullUser?.role === "STUDENT",
    isLecturer: fullUser?.role === "LECTURER",
    isAdmin: fullUser?.role === "ADMIN",
  };
}
