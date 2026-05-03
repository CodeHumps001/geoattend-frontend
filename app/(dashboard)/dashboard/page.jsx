"use client";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import LecturerDashboard from "@/components/dashboard/LecturerDashboard";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import { useAuth } from "@/hooks/useAuth";
import { User, ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { user, isStudent, isLecturer, isAdmin, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get user initials for avatar
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
    <div className="w-full min-h-screen bg-gray-50">
      {/* Top Header - Fixed */}
      <header
        className={`fixed top-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-end px-4 py-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-2"
          >
            {showMobileMenu ? (
              <X size={20} className="text-gray-600 dark:text-gray-400" />
            ) : (
              <Menu size={20} className="text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* User Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 group"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-md shadow-violet-200/50 dark:shadow-violet-900/30">
                  <span className="text-white font-bold text-sm">
                    {getInitials()}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
              </div>

              {/* User Info - Hidden on mobile */}
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                  {user?.name || user?.email?.split("@")[0]}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>

              {/* Chevron - Hidden on mobile */}
              <ChevronDown
                size={14}
                className={`hidden md:block text-gray-400 transition-transform duration-200 ${
                  showUserMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50"
                >
                  <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Signed in as
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {user?.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        window.location.href = "/profile";
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                    >
                      <User size={14} />
                      Profile Settings
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            {/* Menu Panel */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">K</span>
                  </div>
                  <div>
                    <h1 className="font-black text-xl tracking-tight text-gray-900 dark:text-white">
                      KsTU<span className="text-violet-600">.</span>
                    </h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Smart Campus
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-6 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl">
                  <p className="text-xs text-violet-600 dark:text-violet-400 font-medium mb-1">
                    Logged in as
                  </p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">
                    {user?.name || user?.email?.split("@")[0]}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {user?.email}
                  </p>
                  <div className="mt-2 inline-block px-2 py-1 bg-violet-100 dark:bg-violet-500/20 rounded-lg">
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase">
                      {user?.role === "STUDENT" && "Student"}
                      {user?.role === "LECTURER" && "Lecturer"}
                      {user?.role === "ADMIN" && "Admin"}
                    </span>
                  </div>
                </div>
                {/* Add navigation links here if needed */}
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content - With proper spacing from fixed header */}
      <main className="pt-16 lg:pt-14 pb-8 px-4 lg:px-6">
        <div className="max-w-7xl mx-auto">
          {isStudent && <StudentDashboard user={user} />}
          {isLecturer && <LecturerDashboard user={user} />}
          {isAdmin && <AdminDashboard user={user} />}
        </div>
      </main>
    </div>
  );
}
