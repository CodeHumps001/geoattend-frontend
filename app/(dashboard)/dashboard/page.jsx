"use client";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import LecturerDashboard from "@/components/dashboard/LecturerDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { useAuth } from "@/hooks/useAuth";
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
    <div className="w-full">
      {/* 
         Top header: 
         - 'sticky' for mobile scrolling.
         - 'md:relative' or 'md:static' for desktop if you prefer it to scroll away.
      */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-6 sticky top-0 z-40 mb-6 -mx-4 md:mx-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile-only logo (hidden on desktop because sidebar has it) */}
            <div className="md:hidden w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Zap className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="font-black text-gray-900 text-xl leading-tight">
                {greeting()}, {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                Here is what&apos;s happening today.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-[10px] uppercase tracking-widest font-black px-4 py-2 rounded-xl shadow-sm ${
                isStudent
                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                  : isLecturer
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : "bg-purple-50 text-purple-600 border border-purple-100"
              }`}
            >
              {user?.role}
            </span>
          </div>
        </div>
      </header>

      {/* 
          Main Content Container:
          - Removed 'max-w-lg mx-auto' so it fills the screen.
          - Added 'w-full' to ensure child dashboards can use grid systems properly.
      */}
      <div className="w-full">
        {isStudent && <StudentDashboard user={user} />}
        {isLecturer && <LecturerDashboard user={user} />}
        {isAdmin && <AdminDashboard user={user} />}
      </div>
    </div>
  );
}
