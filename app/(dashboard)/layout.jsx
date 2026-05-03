"use client";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import BottomTabBar from "@/components/layout/BottomTabBar";

export default function DashboardLayout({ children }) {
  return (
    // <ProtectedRoute>
    <div className="min-h-screen bg-gray-50">
      {/* Main content — padding bottom so content doesn't hide behind tab bar */}
      <main className="pb-20">{children}</main>
      {/* Bottom tab bar — always visible */}
      <BottomTabBar />
    </div>
    // </ProtectedRoute>
  );
}
