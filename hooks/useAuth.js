import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import api from "@/lib/axios";

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

  // 🔥 Check assistantRep inside student object
  const isAssistantRep = isStudent && user?.student?.assistantRep != null;

  // Can manage sessions = main rep OR assistant rep
  const canManageSessions = isCourseRep || isAssistantRep;

  // Class space — rep uses their classSpace, assistant uses assigned classSpace
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
