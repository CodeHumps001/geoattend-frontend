"use client";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  BookOpen,
  CheckSquare,
  Users,
  User,
  PlayCircle,
  BarChart3,
  LogOut,
  GraduationCap,
} from "lucide-react";

// Reuse the exact same logic from your BottomTabBar
function getTabsForRole(role) {
  if (role === "STUDENT") {
    return [
      { label: "Home", icon: Home, path: "/dashboard" },
      { label: "Courses", icon: BookOpen, path: "/courses" },
      { label: "Attendance", icon: CheckSquare, path: "/attendance" },
      { label: "Profile", icon: User, path: "/profile" },
    ];
  }
  if (role === "LECTURER") {
    return [
      { label: "Home", icon: Home, path: "/dashboard" },
      { label: "Courses", icon: BookOpen, path: "/courses" },
      { label: "Sessions", icon: PlayCircle, path: "/sessions" },
      { label: "Profile", icon: User, path: "/profile" },
    ];
  }
  if (role === "ADMIN") {
    return [
      { label: "Home", icon: Home, path: "/dashboard" },
      { label: "Users", icon: Users, path: "/users" },
      { label: "Courses", icon: BookOpen, path: "/courses" },
      { label: "Reports", icon: BarChart3, path: "/reports" },
      { label: "Profile", icon: User, path: "/profile" },
    ];
  }
  return [];
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth(); // Assuming you have a logout function
  const tabs = getTabsForRole(user?.role);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0f1117] border-r border-gray-200/60 p-4">
      {/* App Logo / Brand */}
      <div className="flex items-center gap-3 px-3 mb-10">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <GraduationCap className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-black text-gray-900 dark:text-white leading-tight">
            KsTU
          </h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            Portal
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.path === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(tab.path);

          return (
            <button
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className="relative w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all group"
            >
              {/* Active Background Pill (Matches BottomBar Animation) */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="activeSidebarTab"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                  />
                )}
              </AnimatePresence>

              <Icon
                className={`relative z-10 w-5 h-5 transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span
                className={`relative z-10 font-bold text-sm transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-gray-700"
                }`}
              >
                {tab.label}
              </span>

              {isActive && (
                <motion.div
                  layoutId="indicator"
                  className="absolute right-4 w-1.5 h-1.5 bg-blue-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Section */}
      <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 px-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-600">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-colors font-bold text-sm"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
