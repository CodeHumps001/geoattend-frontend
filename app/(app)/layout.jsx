"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

import DesktopSidebar from "@/components/layout/DesktopSidebar";
import ProtectedRoute from "@/components/layout/ProtectedRoutes";
import BottomTabBar from "@/components/layout/BottomTabBar";
import Image from "next/image";

export default function AppLayout({ children }) {
  const pathname = usePathname();
  const { user, isCourseRep } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Desktop Sidebar — hidden on mobile */}
        <DesktopSidebar user={user} isRep={isCourseRep} pathname={pathname} />

        {/* Main content — offset by sidebar on desktop */}
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
              <div className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                {isCourseRep ? "Rep" : "Student"}
              </div>
            </div>
          </div>

          {/* Page content */}
          <main className="p-4 md:p-6 pb-24 lg:pb-8 max-w-7xl mx-auto">
            {children}
          </main>
        </div>

        {/* Bottom tab bar — mobile only */}
        <div className="lg:hidden">
          <BottomTabBar />
        </div>
      </div>
    </ProtectedRoute>
  );
}
