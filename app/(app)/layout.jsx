// app/(app)/layout.jsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import BottomTabBar from "@/components/layout/BottomTabBar";
import ProtectedRoute from "@/components/layout/ProtectedRoutes";
import DesktopSidebar from "@/components/layout/DesktopSidebar";
import { usePathname } from "next/navigation";

export default function AppLayout({ children }) {
  const { user, isRep, isStudent } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Desktop Sidebar - Only visible on large screens */}
        <DesktopSidebar user={user} isRep={isRep} pathname={pathname} />

        {/* Main content - add left padding on desktop to account for sidebar */}
        <div className="lg:pl-64">
          <main className="p-4 md:p-6">{children}</main>
          {/* Only show BottomTabBar on mobile, hide on desktop */}
          <div className="lg:hidden">
            <BottomTabBar />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
