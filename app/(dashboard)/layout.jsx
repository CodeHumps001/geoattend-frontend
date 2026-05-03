"use client";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import BottomTabBar from "@/components/layout/BottomTabBar";
import Sidebar from "@/components/sidebar/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    // <ProtectedRoute>
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar: Visible ONLY on big screens (md and up) */}
      <aside className="hidden md:flex w-72 flex-col bg-white border-r border-gray-200">
        <Sidebar />
      </aside>

      <div className="flex flex-1 flex-col relative overflow-hidden">
        {/* 
          Main Scrollable Content:
          - pb-24: Extra space on mobile for the BottomTabBar
          - md:pb-6: Normal spacing on desktop since the bar is hidden
        */}
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 md:pb-6">
          {children}
        </main>

        {/* 
          Bottom Tab Bar: Visible ONLY on mobile
          - md:hidden: Hides the bar once the screen is big enough for the Sidebar
        */}
        <div className="md:hidden">
          <BottomTabBar />
        </div>
      </div>
    </div>
    // </ProtectedRoute>
  );
}
