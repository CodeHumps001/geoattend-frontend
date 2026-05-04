"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    // Don't do anything until Zustand has rehydrated from localStorage
    if (!_hasHydrated) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router, allowedRoles, _hasHydrated]);

  // Show loading spinner while rehydrating — never redirect prematurely
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Loading Klassrep...
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated — render nothing while redirect happens
  if (!isAuthenticated) return null;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return null;

  return children;
}
