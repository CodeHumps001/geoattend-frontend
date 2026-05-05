// app/(app)/layout.jsx
"use client";

import BottomTabBar from "@/components/layout/BottomTabBar";
import ProtectedRoute from "@/components/layout/ProtectedRoutes";

export default function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <main className="p-4 md:p-6">{children}</main>
        {/* Only show BottomTabBar on mobile, hide on desktop */}
        <div className="lg:hidden">
          <BottomTabBar />
        </div>
      </div>
    </ProtectedRoute>
  );
}
