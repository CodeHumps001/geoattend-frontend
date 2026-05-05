import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export function useAuth() {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    setAuth,
    updateUser,
    logout,
    _hasHydrated,
  } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isCourseRep = user?.role === "COURSE_REP";
  const isStudent = user?.role === "STUDENT";

  // Course rep's class space
  const classSpace = isCourseRep
    ? user?.courseRep?.classSpace
    : user?.student?.classSpace;

  const classCode = classSpace?.classCode;

  return {
    user,
    token,
    isAuthenticated,
    _hasHydrated,
    setAuth,
    updateUser,
    logout: handleLogout,
    isCourseRep,
    isStudent,
    classSpace,
    classCode,
  };
}
