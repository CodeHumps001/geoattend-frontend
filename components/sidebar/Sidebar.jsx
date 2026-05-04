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
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  const getRoleDisplay = () => {
    if (user?.role === "STUDENT") return "Student";
    if (user?.role === "LECTURER") return "Lecturer";
    if (user?.role === "ADMIN") return "Admin";
    return "";
  };

  const getRoleColor = () => {
    if (user?.role === "STUDENT") return "from-blue-500 to-blue-600";
    if (user?.role === "LECTURER") return "from-emerald-500 to-emerald-600";
    if (user?.role === "ADMIN") return "from-violet-500 to-violet-600";
    return "from-indigo-500 to-indigo-600";
  };

  const getInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TooltipProvider>
      <div className="h-screen p-3 flex flex-col items-center justify-start pointer-events-none">
        {/* Premium Glass Container */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.21, 0.45, 0.27, 0.9] }}
          className="w-72 flex flex-col pointer-events-auto bg-gradient-to-br from-white/95 via-white/90 to-white/95 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/95 backdrop-blur-2xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/30 overflow-hidden relative"
        >
          {/* Ambient Glow Effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

          {/* Brand Header */}
          <div className="relative p-5 pb-3 border-b border-gray-200/50 dark:border-white/10">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur-md opacity-50" />
                <div className="relative w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
              </motion.div>
              <div>
                <h1 className="font-black text-xl tracking-tight text-gray-900 dark:text-white leading-tight">
                  KlassRep
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <div
                    className={`w-2 h-2 rounded-full bg-gradient-to-r ${getRoleColor()}`}
                  />
                  <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {getRoleDisplay()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* User Greeting Section */}
          <div className="px-5 py-4 border-b border-gray-200/50 dark:border-white/10">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-2">
              Signed in as
            </p>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-offset-2 ring-indigo-100 dark:ring-indigo-900">
                <AvatarFallback
                  className={`bg-gradient-to-r ${getRoleColor()} text-white font-bold text-sm`}
                >
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-900 dark:text-white truncate capitalize">
                  {user?.name || user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
            {tabs.map((tab, idx) => {
              const Icon = tab.icon;
              const isActive =
                tab.path === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(tab.path);

              return (
                <Tooltip key={tab.path}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => router.push(tab.path)}
                      className={`group relative w-full flex items-center justify-start gap-3 px-3 py-2.5 h-auto rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/20 dark:to-purple-500/20 text-indigo-600 dark:text-indigo-400"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-600 dark:text-gray-400"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 transition-all duration-300 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "group-hover:scale-110"}`}
                      />
                      <span
                        className={`font-medium text-sm ${isActive ? "font-semibold" : ""}`}
                      >
                        {tab.label}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeBar"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{tab.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>

          <Separator className="mx-5 w-auto bg-gray-200/50 dark:bg-gray-800/50" />

          {/* Footer with Logout */}
          <div className="p-4 mt-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="relative w-full flex items-center justify-start gap-3 px-3 py-2.5 h-auto rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 group"
                >
                  <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                  <span className="font-medium text-sm">Logout</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Sign out</p>
              </TooltipContent>
            </Tooltip>

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
    </TooltipProvider>
  );
}
