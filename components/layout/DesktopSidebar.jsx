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
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

const sidebarLinks = {
  rep: [
    { label: "Dashboard", icon: Zap, href: "/dashboard" },
    { label: "Courses", icon: BookOpen, href: "/courses" },
    { label: "Attendance", icon: MapPin, href: "/attendance" },
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
  assisrep: [
    { label: "Dashboard", icon: Zap, href: "/dashboard" },
    { label: "Courses", icon: BookOpen, href: "/courses" },
    { label: "Attendance", icon: MapPin, href: "/attendance" },
    { label: "Sessions", icon: PlayCircle, href: "/sessions" },
    { label: "Profile", icon: GraduationCap, href: "/profile" },
  ],
};

export default function DesktopSidebar({ user, isRep, isAssis, pathname }) {
  const router = useRouter();
  const { logout } = useAuth();
  const links = isRep
    ? sidebarLinks.rep
    : isAssis
      ? sidebarLinks.assisrep
      : sidebarLinks.student;

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
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 flex items-center justify-center shadow-2xl overflow-hidden rounded-xl">
            <Image
              src="/klassrep.png"
              alt="KlassRep Logo"
              width={55}
              height={55}
              className="object-cover rounded"
            />
          </div>
          <span className="text-gray-900 dark:text-white font-black text-lg">
            KlassRep
          </span>
        </div>

        {/* User Info */}
        <div className="mx-3 mt-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Avatar className="w-9 h-9 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.studentId}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isRep
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                  : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400"
              }`}
            >
              {isRep ? "Course Rep" : "Student"}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(link.href);

            return (
              <button
                key={link.href}
                onClick={() => router.push(link.href)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? "text-blue-600 dark:text-blue-400" : ""
                  }`}
                />
                <span className="text-sm">{link.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
