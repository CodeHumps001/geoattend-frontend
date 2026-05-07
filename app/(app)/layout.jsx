"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import BottomTabBar from "@/components/layout/BottomTabBar";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import api from "@/lib/axios";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import ProtectedRoute from "@/components/layout/ProtectedRoutes";

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const { user, isCourseRep, isAssistantRep } = useAuth();
  const { updateUser } = useAuthStore();

  // 🔥 Refresh user data on every app load
  // This ensures assistant rep status is always current
  useEffect(() => {
    const refreshUser = async () => {
      try {
        const res = await api.get("/api/v1/auth/me");
        const freshUser = res.data.data.user;
        updateUser(freshUser);
      } catch (err) {
        // If token expired, the axios interceptor handles redirect to login
        console.error("Failed to refresh user:", err);
      }
    };

    if (user) {
      refreshUser();
    }
  }, []); // Only on mount

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <DesktopSidebar user={user} isRep={isCourseRep} pathname={pathname} />

        <div className="lg:pl-64">
          {/* Mobile header */}
          <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 lg:hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 flex items-center justify-center shadow-2xl overflow-hidden rounded-xl">
                  <Image
                    src="/klassrep.png"
                    alt="KlassRep Logo"
                    width={55}
                    height={55}
                    className="object-cover rounded"
                  />
                </div>
                <span className="text-gray-900 dark:text-white font-black text-lg">
                  KlassRep
                </span>
              </div>
              <div
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  isCourseRep
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : isAssistantRep
                      ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                }`}
              >
                {isCourseRep
                  ? "Course Rep"
                  : isAssistantRep
                    ? "Asst. Rep ⭐"
                    : "Student"}
              </div>
            </div>
          </div>

          <main className="p-4 md:p-6 pb-24 lg:pb-8 max-w-7xl mx-auto">
            {children}
          </main>
        </div>

        <div className="lg:hidden">
          <BottomTabBar />
        </div>
      </div>
    </ProtectedRoute>
  );
}
