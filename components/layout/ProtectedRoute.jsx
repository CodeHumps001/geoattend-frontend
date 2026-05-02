"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    // If not logged in redirect to login
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // If roles are specified check if user has the right role
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router, allowedRoles]);

  // Don't render anything until auth is confirmed
  if (!isAuthenticated) return null;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return null;

  return children;
}
