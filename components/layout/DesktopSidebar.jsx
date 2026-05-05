// components/layout/DesktopSidebar.jsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Zap,
  BookOpen,
  PlayCircle,
  Users,
  GraduationCap,
  MapPin,
  Clock,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useAuthStore from "@/store/authStore";

const sidebarLinks = {
  rep: [
    { label: "Dashboard", icon: Zap, href: "/dashboard" },
    { label: "Courses", icon: BookOpen, href: "/courses" },
    { label: "Sessions", icon: PlayCircle, href: "/sessions" },
    { label: "Members", icon: Users, href: "/members" },
    { label: "Profile", icon: GraduationCap, href: "/profile" },
  ],
  student: [
    { label: "Dashboard", icon: Zap, href: "/dashboard" },
    { label: "Courses", icon: BookOpen, href: "/courses" },
    { label: "Attendance", icon: MapPin, href: "/attendance" },
    { label: "History", icon: Clock, href: "/history" },
    { label: "Profile", icon: GraduationCap, href: "/profile" },
  ],
};

export default function DesktopSidebar({ user, isRep, pathname }) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const links = isRep ? sidebarLinks.rep : sidebarLinks.student;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-black text-gray-900 dark:text-white text-lg leading-none">
              KlassRep
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              Smart Attendance
            </p>
          </div>
        </div>

        {/* User Info */}
        <div className="mx-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {isRep ? "Course Rep" : "Student"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 mx-3 mb-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
