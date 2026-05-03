"use client";

import { useAuth } from "@/hooks/useAuth";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import LecturerDashboard from "@/components/dashboard/LecturerDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { Zap } from "lucide-react";

export default function DashboardPage() {
  const { user, isStudent, isLecturer, isAdmin } = useAuth();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Top header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 pt-10 sm:pt-12 pb-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200 dark:shadow-blue-900/30">
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-gray-900 dark:text-white text-base sm:text-lg leading-none">
                Klassrep
              </h1>
              <p className="text-gray-400 dark:text-gray-500 text-xs">
                {greeting()}, {user?.name?.split(" ")[0]}
              </p>
            </div>
          </div>
          <div
            className={`text-xs font-bold px-3 py-1.5 rounded-full ${
              isStudent
                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                : isLecturer
                  ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400"
            }`}
          >
            {user?.role}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-5 sm:py-6 max-w-7xl mx-auto">
        {isStudent && <StudentDashboard user={user} />}
        {isLecturer && <LecturerDashboard user={user} />}
        {isAdmin && <AdminDashboard user={user} />}
      </div>
    </div>
  );
}
