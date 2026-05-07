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

  // Check if student is an assistant rep
  const isAssistantRep = isStudent && !!user?.student?.assistantRep;

  // Can manage sessions = main rep OR assistant rep
  const canManageSessions = isCourseRep || isAssistantRep;

  const classSpace = isCourseRep
    ? user?.courseRep?.classSpace
    : isAssistantRep
      ? user?.student?.assistantRep?.classSpace
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
    isAssistantRep,
    canManageSessions,
    classSpace,
    classCode,
  };
}
