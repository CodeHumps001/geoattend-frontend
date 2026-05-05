// app/(app)/layout.jsx
"use client";

import BottomTabBar from "@/components/layout/BottomTabBar";
import ProtectedRoute from "@/components/layout/ProtectedRoutes";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        {/* Remove max-w-7xl and mx-auto to allow full width */}
        <main className="pb-20 p-4">{children}</main>
        <BottomTabBar />
      </div>
    </ProtectedRoute>
  );
}
