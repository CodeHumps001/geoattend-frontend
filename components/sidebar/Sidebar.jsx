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
  ChevronRight,
} from "lucide-react";

function getTabsForRole(role) {
  const common = [
    { label: "Home", icon: Home, path: "/dashboard" },
    { label: "Courses", icon: BookOpen, path: "/courses" },
  ];
  if (role === "STUDENT") {
    return [
      ...common,
      { label: "Attendance", icon: CheckSquare, path: "/attendance" },
      { label: "Profile", icon: User, path: "/profile" },
    ];
  }
  if (role === "LECTURER") {
    return [
      ...common,
      { label: "Sessions", icon: PlayCircle, path: "/sessions" },
      { label: "Profile", icon: User, path: "/profile" },
    ];
  }
  if (role === "ADMIN") {
    return [
      ...common,
      { label: "Users", icon: Users, path: "/users" },
      { label: "Reports", icon: BarChart3, path: "/reports" },
      { label: "Profile", icon: User, path: "/profile" },
    ];
  }
  return common;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const tabs = getTabsForRole(user?.role);

  return (
    <div className="h-screen p-2 flex flex-col items-center justify-start pointer-events-none">
      {/* Premium Glass Container - Centered */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.45, 0.27, 0.9] }}
        className="w-full flex flex-col pointer-events-auto  bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/95 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/30 overflow-hidden relative"
      >
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Ambient Glow Effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

        {/* Brand Header with Premium Design */}
        <div className="relative p-6 pb-4 flex items-center justify-between border-b border-gray-200/50 dark:border-white/10">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-md opacity-50" />
              <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="text-white w-5 h-5" />
              </div>
            </motion.div>
            <div>
              <h1 className="font-black text-xl tracking-tight text-gray-900 dark:text-white leading-tight">
                KsTU<span className="text-blue-600">.</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Smart Campus
              </p>
            </div>
          </div>

          {/* Role Badge */}
          <div className="px-2 py-1 bg-blue-50 dark:bg-blue-500/20 rounded-lg">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
              {user?.role === "STUDENT" && "Student"}
              {user?.role === "LECTURER" && "Lecturer"}
              {user?.role === "ADMIN" && "Admin"}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive =
              tab.path === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(tab.path);

            return (
              <motion.button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 overflow-hidden"
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActive"
                      className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </AnimatePresence>

                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div
                    layoutId="activeBar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}

                <Icon
                  className={`relative z-10 w-5 h-5 transition-all duration-300 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                  } ${!isActive && "group-hover:scale-110"}`}
                />
                <span
                  className={`relative z-10 font-semibold text-sm transition-all duration-300 ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                  }`}
                >
                  {tab.label}
                </span>

                {/* Hover Arrow Indicator */}
                {!isActive && (
                  <ChevronRight className="absolute right-4 w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0 -translate-x-2" />
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Footer with Logout */}
        <div className="p-4 mt-auto bg-gradient-to-t from-gray-50/80 to-transparent dark:from-gray-800/30">
          <motion.button
            onClick={logout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors" />
            <LogOut className="relative z-10 w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="relative z-10 font-semibold text-sm">Logout</span>
          </motion.button>

          {/* Version Info */}
          <div className="mt-4 text-center">
            <p className="text-[10px] text-gray-400 dark:text-gray-600 font-medium">
              Version 2.0.0
            </p>
          </div>
        </div>
      </motion.div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.8);
        }
      `}</style>
    </div>
  );
}
