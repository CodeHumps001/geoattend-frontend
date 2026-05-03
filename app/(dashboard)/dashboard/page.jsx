"use client";

import AdminDashboard from "@/components/dashboard/AdminDashboard";
import LecturerDashboard from "@/components/dashboard/LecturerDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { useAuth } from "@/hooks/useAuth";
import { Zap } from "lucide-react";

// ── Activity Item ──────────────────────────────────────────────

export default function DashboardPage() {
  const { user, isStudent, isLecturer, isAdmin } = useAuth();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-gray-900 text-lg leading-none">
                Klassrep
              </h1>
              <p className="text-gray-400 text-xs">
                {greeting()}, {user?.name?.split(" ")[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                isStudent
                  ? "bg-blue-50 text-blue-600"
                  : isLecturer
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-purple-50 text-purple-600"
              }`}
            >
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5 max-w-lg mx-auto">
        {isStudent && <StudentDashboard user={user} />}
        {isLecturer && <LecturerDashboard user={user} />}
        {isAdmin && <AdminDashboard user={user} />}
      </div>
    </div>
  );
}
