"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  Home,
  BookOpen,
  PlayCircle,
  Users,
  User,
  MapPin,
  Clock,
} from "lucide-react";

const REP_TABS = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Courses", icon: BookOpen, path: "/courses" },
  { label: "Attendance", icon: MapPin, path: "/attendance" },
  { label: "Sessions", icon: PlayCircle, path: "/sessions" },
  { label: "Members", icon: Users, path: "/members" },
  { label: "Profile", icon: User, path: "/profile" },
];

const ASSISTANT_TABS = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Courses", icon: BookOpen, path: "/courses" },
  { label: "Attendance", icon: MapPin, path: "/attendance" },
  { label: "Sessions", icon: PlayCircle, path: "/sessions" },
  { label: "Profile", icon: User, path: "/profile" },
];

const STUDENT_TABS = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Courses", icon: BookOpen, path: "/courses" },
  { label: "Attendance", icon: MapPin, path: "/attendance" },
  { label: "History", icon: Clock, path: "/history" },
  { label: "Profile", icon: User, path: "/profile" },
];

export default function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCourseRep, isAssistantRep } = useAuth();

  // 🔥 Pick tabs based on role
  const tabs = isCourseRep
    ? REP_TABS
    : isAssistantRep
      ? ASSISTANT_TABS
      : STUDENT_TABS;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800" />
      <div className="relative z-10 max-w-lg mx-auto px-1 py-1.5">
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
                className="relative flex flex-col items-center gap-0.5 py-2 px-3 rounded-2xl min-w-[56px]"
                whileTap={{ scale: 0.88 }}
              >
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-2xl"
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
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
                <span
                  className={`relative z-10 text-[10px] font-semibold transition-colors ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-400 dark:text-gray-500"
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
