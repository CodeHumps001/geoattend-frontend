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
} from "lucide-react";

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

export default function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const tabs = getTabsForRole(user?.role);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Blur backdrop */}
      <div className="absolute inset-0 bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-xl border-t border-gray-200/60" />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive =
              tab.path === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(tab.path);

            return (
              <motion.button
                key={tab.path}
                onClick={() => router.push(tab.path)}
                className="relative flex flex-col items-center gap-1 py-2 px-4 rounded-2xl min-w-[60px]"
                whileTap={{ scale: 0.9 }}
              >
                {/* Active background pill */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-50 rounded-2xl"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{
                        type: "spring",
                        bounce: 0.3,
                        duration: 0.4,
                      }}
                    />
                  )}
                </AnimatePresence>

                <Icon
                  className={`relative z-10 w-5 h-5 transition-colors ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                />
                <span
                  className={`relative z-10 text-xs font-semibold transition-colors ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {tab.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
