// app/(app)/dashboard/page.jsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  Users,
  BookOpen,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  MapPin,
  Zap,
  Copy,
  TrendingUp,
  GraduationCap,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

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

function StatCard({ label, value, icon: Icon, color, delay, loading }) {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    violet:
      "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
    amber:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  };
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}
          >
            <Icon className="w-5 h-5" />
          </div>
          {loading ? (
            <Skeleton className="h-7 w-16" />
          ) : (
            <p className="text-2xl font-black text-gray-900 dark:text-white">
              {value}
            </p>
          )}
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
            {label}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ActivityItem({ icon: Icon, title, sub, time, color }) {
  const colors = {
    green:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    amber:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  };
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {sub}
        </p>
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
        {time}
      </span>
    </div>
  );
}

// ── Desktop Sidebar ─────────────────────────────────────────
function DesktopSidebar({ user, isRep, pathname }) {
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
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 lg:flex flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-black text-gray-900 dark:text-white text-lg leading-none">
              Klassrep
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
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
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
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
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

// ── Mobile Menu Button ──────────────────────────────────────
function MobileMenuButton({ isRep, pathname }) {
  const { user } = useAuth();
  const router = useRouter();
  const { logout } = useAuthStore();
  const [open, setOpen] = useState(false);
  const links = isRep ? sidebarLinks.rep : sidebarLinks.student;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="lg:hidden p-2">
          <Menu className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0 bg-white dark:bg-gray-950">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 py-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-black text-gray-900 dark:text-white text-lg leading-none">
                  Klassrep
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  Smart Attendance
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* User Info */}
          <div className="mx-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs font-bold">
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
                  onClick={() => {
                    router.push(link.href);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
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
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Course Rep Dashboard (Working API) ──────────────────────
function RepDashboard({ user }) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["rep-class"],
    queryFn: async () => {
      const res = await api.get("/api/v1/class/me");
      return res.data.data.classSpace;
    },
    enabled: !!user,
  });

  const { data: sessionsData } = useQuery({
    queryKey: ["rep-sessions"],
    queryFn: async () => {
      const res = await api.get("/api/v1/sessions");
      return res.data.data.sessions || [];
    },
    enabled: !!user,
    refetchInterval: 15000,
  });

  const classSpace = data;
  const courses = classSpace?.courses || [];
  const members = classSpace?.students || [];
  const sessions = sessionsData || [];

  const openSessions = sessions.filter((s) => s.isOpen);
  let totalAttendance = 0;
  let totalPresent = 0;
  sessions.forEach((s) => {
    totalAttendance += s.attendance?.length || 0;
    totalPresent +=
      s.attendance?.filter((a) => a.status === "PRESENT").length || 0;
  });
  const avgAttendance =
    totalAttendance > 0
      ? Math.round((totalPresent / totalAttendance) * 100)
      : null;

  const recentActivity = sessions.slice(0, 4).map((s) => ({
    icon: s.isOpen ? PlayCircle : CheckCircle2,
    title: s.isOpen ? "Session active" : "Session completed",
    sub: `${s.course?.name} · ${s.attendance?.filter((a) => a.status === "PRESENT").length || 0} present`,
    time: new Date(s.startTime).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    color: s.isOpen ? "blue" : "green",
  }));

  const copyClassCode = () => {
    navigator.clipboard.writeText(classSpace?.classCode || "");
    toast.success("Class code copied!");
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-none shadow-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10 blur-2xl" />
          <CardContent className="relative z-10 p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div>
                <Badge className="bg-white/20 text-white border-none text-xs mb-3">
                  Course Rep 🎓
                </Badge>
                <h2 className="text-2xl font-black text-white">
                  {user?.name?.split(" ")[0]}'s Class
                </h2>
                <p className="text-blue-200 text-sm mt-1">
                  {classSpace?.name || "Loading..."}
                </p>
              </div>
              {openSessions.length > 0 && (
                <Badge className="bg-emerald-500 text-white border-none font-bold w-fit">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse inline-block" />
                  {openSessions.length} Live
                </Badge>
              )}
            </div>

            {classSpace?.classCode && (
              <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-xl px-4 py-2 mb-5 w-fit">
                <div>
                  <p className="text-blue-200 text-xs">Class Code</p>
                  <p className="text-white font-black font-mono text-base">
                    {classSpace.classCode}
                  </p>
                </div>
                <button
                  onClick={copyClassCode}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all"
                >
                  <Copy className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => router.push("/sessions")}
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-sm text-sm"
              >
                <PlayCircle className="w-4 h-4 mr-2" /> Start Session
              </Button>
              <Button
                onClick={() => router.push("/courses")}
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 text-sm"
              >
                <BookOpen className="w-4 h-4 mr-2" /> Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Members"
          value={members.length}
          icon={Users}
          color="blue"
          delay={1}
          loading={isLoading}
        />
        <StatCard
          label="Courses"
          value={courses.length}
          icon={BookOpen}
          color="emerald"
          delay={2}
          loading={isLoading}
        />
        <StatCard
          label="Sessions"
          value={sessions.length}
          icon={PlayCircle}
          color="violet"
          delay={3}
          loading={isLoading}
        />
        <StatCard
          label="Avg Attendance"
          value={avgAttendance !== null ? `${avgAttendance}%` : "—"}
          icon={TrendingUp}
          color="amber"
          delay={4}
          loading={isLoading}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Active Sessions */}
        <motion.div
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Active Sessions
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 dark:text-blue-400 text-xs"
              onClick={() => router.push("/sessions")}
            >
              All sessions <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="py-6 space-y-3 px-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))}
                </div>
              ) : openSessions.length === 0 ? (
                <div className="py-10 text-center">
                  <PlayCircle className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No active sessions
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                    onClick={() => router.push("/sessions")}
                  >
                    Start one now
                  </Button>
                </div>
              ) : (
                openSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => router.push(`/sessions/${session.id}`)}
                    className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <PlayCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                        {session.course?.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {session.attendance?.filter(
                          (a) => a.status === "PRESENT",
                        ).length || 0}{" "}
                        present · {session.radiusMeters}m radius
                      </p>
                    </div>
                    <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0 text-xs font-bold flex-shrink-0">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse inline-block" />{" "}
                      LIVE
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={fadeUp}
          custom={6}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardContent className="px-4 py-0">
              {recentActivity.length === 0 ? (
                <div className="py-10 text-center">
                  <Clock className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    No activity yet
                  </p>
                </div>
              ) : (
                recentActivity.map((item, i) => (
                  <ActivityItem key={i} {...item} />
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Members Preview */}
      {members.length > 0 && (
        <motion.div
          variants={fadeUp}
          custom={7}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Class Members{" "}
              <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                ({members.length})
              </span>
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 dark:text-blue-400 text-xs"
              onClick={() => router.push("/members")}
            >
              See all <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {members.slice(0, 8).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {member.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                      {member.user?.name?.split(" ")[0]}
                    </span>
                  </div>
                ))}
                {members.length > 8 && (
                  <div className="flex items-center px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      +{members.length - 8} more
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// ── Student Dashboard (Working API) ────────────────────────
function StudentDashboard({ user }) {
  const router = useRouter();

  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ["student-class"],
    queryFn: async () => {
      const res = await api.get("/api/v1/class/student");
      return res.data.data.classSpace;
    },
    enabled: !!user,
  });

  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ["my-attendance"],
    queryFn: async () => {
      const res = await api.get("/api/v1/attendance/me");
      return res.data.data;
    },
    enabled: !!user,
  });

  const { data: sessionsData } = useQuery({
    queryKey: ["class-sessions"],
    queryFn: async () => {
      const res = await api.get("/api/v1/sessions");
      return res.data.data.sessions || [];
    },
    enabled: !!user,
    refetchInterval: 15000,
  });

  const isLoading = classLoading || attendanceLoading;
  const classSpace = classData;
  const attendance = attendanceData?.attendance || [];
  const stats = attendanceData?.stats || [];
  const sessions = sessionsData || [];
  const openSessions = sessions.filter((s) => s.isOpen);

  const totalPresent = attendanceData?.totalPresent || 0;
  const totalRecords = attendanceData?.totalRecords || 0;
  const overallPct =
    totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Hero */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800 border-none shadow-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10 blur-2xl" />
          <CardContent className="relative z-10 p-6">
            <Badge className="bg-white/20 text-white border-none text-xs mb-3">
              {greeting()} 👋
            </Badge>
            <h2 className="text-2xl font-black text-white mb-1">
              {user?.name?.split(" ")[0]}
            </h2>
            <p className="text-blue-200 text-sm mb-1">
              {classSpace?.name || "Loading your class..."}
            </p>
            <p className="text-blue-300 text-xs font-mono mb-5">
              {user?.studentId}
            </p>

            <div className="flex flex-wrap gap-3">
              {openSessions.length > 0 ? (
                <Button
                  onClick={() => router.push("/attendance")}
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-sm text-sm"
                >
                  <MapPin className="w-4 h-4 mr-2" /> Mark Attendance
                  <Badge className="ml-2 bg-emerald-500 text-white border-none text-xs">
                    {openSessions.length} open
                  </Badge>
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/courses")}
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-sm text-sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> View Courses
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Open Session Alert */}
      {openSessions.length > 0 && (
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="visible"
        >
          {openSessions.map((session) => (
            <div
              key={session.id}
              onClick={() => router.push("/attendance")}
              className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl p-4 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <PlayCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                  Session Active — {session.course?.name}
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 text-xs">
                  Tap to mark your attendance now
                </p>
              </div>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
            </div>
          ))}
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Courses"
          value={classSpace?.courses?.length || "—"}
          icon={BookOpen}
          color="blue"
          delay={2}
          loading={classLoading}
        />
        <StatCard
          label="Avg Attendance"
          value={overallPct !== null ? `${overallPct}%` : "—"}
          icon={TrendingUp}
          color="emerald"
          delay={3}
          loading={attendanceLoading}
        />
        <StatCard
          label="Present"
          value={totalPresent}
          icon={CheckCircle2}
          color="violet"
          delay={4}
          loading={attendanceLoading}
        />
        <StatCard
          label="Classmates"
          value={classSpace ? classSpace._count?.students || 0 : "—"}
          icon={Users}
          color="amber"
          delay={5}
          loading={classLoading}
        />
      </div>

      {/* Attendance per Course */}
      {stats.length > 0 && (
        <motion.div
          variants={fadeUp}
          custom={6}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">
              My Attendance
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 dark:text-blue-400 text-xs"
              onClick={() => router.push("/history")}
            >
              Full history <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {stats.map((stat, i) => {
              const pct = parseFloat(stat.percentage);
              const color = pct >= 75 ? "emerald" : pct >= 50 ? "amber" : "red";
              const barColor = {
                emerald: "bg-emerald-500",
                amber: "bg-amber-400",
                red: "bg-red-500",
              };
              const textColor = {
                emerald: "text-emerald-600 dark:text-emerald-400",
                amber: "text-amber-600 dark:text-amber-400",
                red: "text-red-600 dark:text-red-400",
              };
              return (
                <motion.div
                  key={stat.courseId}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                >
                  <Card
                    className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => router.push("/courses")}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                            {stat.courseName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {stat.courseCode}
                          </p>
                        </div>
                        <p
                          className={`font-black text-base flex-shrink-0 ml-3 ${textColor[color]}`}
                        >
                          {stat.percentage}
                        </p>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${barColor[color]}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {stat.present} present · {stat.absent} absent
                        </p>
                        {pct < 75 && (
                          <p className="text-xs text-amber-500 font-semibold">
                            Below 75%
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recent Activity */}
      {attendance.length > 0 && (
        <motion.div
          variants={fadeUp}
          custom={7}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardContent className="px-4 py-0">
              {attendance.slice(0, 5).map((record, i) => {
                const isPresent = record.status === "PRESENT";
                const timeAgo = (date) => {
                  const diff = Date.now() - new Date(date).getTime();
                  const hours = Math.floor(diff / 3600000);
                  const days = Math.floor(diff / 86400000);
                  if (hours < 1) return "Just now";
                  if (hours < 24) return `${hours}h ago`;
                  return `${days}d ago`;
                };
                return (
                  <ActivityItem
                    key={record.id}
                    icon={isPresent ? CheckCircle2 : XCircle}
                    title={record.session?.course?.name || "Course"}
                    sub={`Marked ${isPresent ? "present" : "absent"} · ${record.session?.course?.code || ""}`}
                    time={timeAgo(record.markedAt)}
                    color={isPresent ? "green" : "red"}
                  />
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// ── Main Dashboard Page ─────────────────────────────────────
export default function DashboardPage() {
  const { user, isCourseRep, isStudent } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <DesktopSidebar user={user} isRep={isCourseRep} pathname={pathname} />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile Header with Menu */}
        <div className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-gray-900 dark:text-white">
                Klassrep
              </span>
            </div>
            <MobileMenuButton isRep={isCourseRep} pathname={pathname} />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-4 md:p-6">
          {isCourseRep && <RepDashboard user={user} />}
          {isStudent && <StudentDashboard user={user} />}
        </div>
      </div>
    </>
  );
}
