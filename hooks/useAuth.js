import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isStudent = user?.role === "STUDENT";
  const isLecturer = user?.role === "LECTURER";
  const isAdmin = user?.role === "ADMIN";

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout: handleLogout,
    isStudent,
    isLecturer,
    isAdmin,
  };
}
