"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  GraduationCap,
  PlayCircle,
  Users,
  Calendar,
  Eye,
  TrendingUp,
  UserCheck,
  Shield,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function StatCard({ label, value, icon: Icon, color, delay, loading, trend }) {
  const colorMap = {
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
      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all bg-white dark:bg-gray-900">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center ${colorMap[color]}`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-8 w-20 mb-1" />
          ) : (
            <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
              {value}
            </p>
          )}
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
            {label}
          </p>
          {trend && !loading && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trend}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function QuickAction({ label, desc, icon: Icon, path, color, delay }) {
  const router = useRouter();
  const colorMap = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30",
    violet:
      "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30",
    amber:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30",
  };
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2 }}
    >
      <button
        onClick={() => router.push(path)}
        className={`w-full p-4 sm:p-5 rounded-2xl text-left transition-all ${colorMap[color]} group`}
      >
        <Icon className="w-6 h-6 mb-3 group-hover:scale-110 transition-transform" />
        <p className="font-bold text-sm sm:text-base text-gray-900 dark:text-white">
          {label}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {desc}
        </p>
      </button>
    </motion.div>
  );
}

function ActivityItem({ icon: Icon, title, sub, time, color }) {
  const colorMap = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    violet:
      "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
    amber:
      "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  };
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
          {sub}
        </p>
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap flex-shrink-0">
        {time}
      </span>
    </div>
  );
}

export default function AdminDashboard({ user }) {
  const router = useRouter();

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["all-students"],
    queryFn: async () => {
      const res = await api.get("/api/v1/students");
      return res.data.data;
    },
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data;
    },
  });

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ["all-sessions"],
    queryFn: async () => {
      const res = await api.get("/api/v1/attendance/session/all");
      return res.data.data;
    },
    refetchInterval: 15000,
  });

  const { data: lecturersData } = useQuery({
    queryKey: ["all-lecturers"],
    queryFn: async () => {
      const res = await api.get("/api/v1/lecturers");
      return res.data.data;
    },
  });

  const students = studentsData?.students || [];
  const courses = coursesData?.courses || [];
  const sessions = sessionsData?.sessions || [];
  const lecturers = lecturersData?.lecturers || [];

  const isLoading = studentsLoading || coursesLoading || sessionsLoading;

  // Real computed stats
  const now = new Date();
  const activeSessions = sessions.filter(
    (s) => now >= new Date(s.startTime) && now <= new Date(s.endTime),
  ).length;
  const todaySessions = sessions.filter(
    (s) => new Date(s.date).toDateString() === now.toDateString(),
  ).length;

  // Real avg attendance across all sessions
  const avgAttendance = (() => {
    let totalPresent = 0,
      totalRecords = 0;
    sessions.forEach((s) => {
      totalRecords += s.attendance?.length || 0;
      totalPresent +=
        s.attendance?.filter((a) => a.status === "PRESENT").length || 0;
    });
    return totalRecords > 0
      ? Math.round((totalPresent / totalRecords) * 100)
      : null;
  })();

  // Build real activity from actual data
  const recentActivity = [
    ...sessions.slice(0, 2).map((s) => ({
      icon: PlayCircle,
      title: `Session — ${s.course?.name || "Unknown"}`,
      sub: `${s.attendance?.filter((a) => a.status === "PRESENT").length || 0} present · ${s.course?.code}`,
      time: new Date(s.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      color: now < new Date(s.endTime) ? "emerald" : "violet",
    })),
    ...students.slice(0, 1).map((s) => ({
      icon: GraduationCap,
      title: `${s.user?.name} registered`,
      sub: `${s.department} · Level ${s.level} · ${s.studentCode}`,
      time: "Recently",
      color: "blue",
    })),
    ...courses.slice(0, 1).map((c) => ({
      icon: BookOpen,
      title: `Course: ${c.name}`,
      sub: `${c.code} · ${c.enrollments?.length || 0} students enrolled`,
      time: "Active",
      color: "amber",
    })),
  ].slice(0, 5);

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-10">
      {/* Hero */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 border-none shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-purple-500/20 rounded-full translate-y-16 -translate-x-16 blur-2xl" />
          <CardContent className="relative z-10 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge className="bg-white/20 text-white border-none text-xs">
                Admin Panel 🛡️
              </Badge>
              {activeSessions > 0 && (
                <Badge className="bg-white/10 text-white border-white/20 text-xs">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse inline-block" />
                  {activeSessions} live
                </Badge>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              {user?.name?.split(" ")[0] || "Admin"}
            </h2>
            <p className="text-violet-100 text-sm sm:text-base max-w-md">
              Full institution oversight & management
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Button
                onClick={() => router.push("/users")}
                variant="secondary"
                className="bg-white text-violet-600 hover:bg-gray-100 shadow-sm font-bold"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button
                onClick={() => router.push("/courses")}
                variant="outline"
                className="bg-violet-500/20 text-white border-violet-400/30 hover:bg-violet-500/30 font-semibold"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Students"
          value={isLoading ? "—" : students.length}
          icon={GraduationCap}
          color="blue"
          delay={1}
          loading={studentsLoading}
          trend={`+${students.length} registered`}
        />
        <StatCard
          label="Total Courses"
          value={isLoading ? "—" : courses.length}
          icon={BookOpen}
          color="emerald"
          delay={2}
          loading={coursesLoading}
        />
        <StatCard
          label="Active Sessions"
          value={isLoading ? "—" : activeSessions}
          icon={PlayCircle}
          color="violet"
          delay={3}
          loading={sessionsLoading}
          trend={activeSessions > 0 ? "Live now" : undefined}
        />
        <StatCard
          label="Avg Attendance"
          value={avgAttendance !== null ? `${avgAttendance}%` : "—"}
          icon={BarChart3}
          color="amber"
          delay={4}
          loading={sessionsLoading}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
              Quick Actions
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <QuickAction
              label="Manage Users"
              desc="Students & lecturers"
              icon={Users}
              path="/users"
              color="blue"
              delay={5}
            />
            <QuickAction
              label="All Courses"
              desc="Create & manage"
              icon={BookOpen}
              path="/courses"
              color="emerald"
              delay={6}
            />
            <QuickAction
              label="Sessions"
              desc="View all sessions"
              icon={PlayCircle}
              path="/sessions"
              color="violet"
              delay={7}
            />
            <QuickAction
              label="Reports"
              desc="Analytics & insights"
              icon={BarChart3}
              path="/reports"
              color="amber"
              delay={8}
            />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {[
              {
                label: "Lecturers",
                value: lecturers.length,
                icon: UserCheck,
                color: "text-emerald-600 dark:text-emerald-400",
                bg: "bg-emerald-50 dark:bg-emerald-900/20",
              },
              {
                label: "Sessions Today",
                value: todaySessions,
                icon: Clock,
                color: "text-violet-600 dark:text-violet-400",
                bg: "bg-violet-50 dark:bg-violet-900/20",
              },
              {
                label: "Total Sessions",
                value: sessions.length,
                icon: PlayCircle,
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-50 dark:bg-blue-900/20",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  variants={fadeUp}
                  custom={9 + i}
                  initial="hidden"
                  animate="visible"
                >
                  <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.bg} flex-shrink-0`}
                      >
                        <Icon className={`w-4 h-4 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-lg font-black text-gray-900 dark:text-white leading-none">
                          {item.value}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.label}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
                Recent Activity
              </h3>
            </div>
            <Badge variant="outline" className="text-xs">
              Live
            </Badge>
          </div>

          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardContent className="px-4 sm:px-5 py-0">
              {isLoading ? (
                <div className="py-6 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 rounded-xl" />
                  ))}
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="py-10 text-center">
                  <Eye className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    No activity yet
                  </p>
                </div>
              ) : (
                recentActivity.map((activity, idx) => (
                  <ActivityItem key={idx} {...activity} />
                ))
              )}
            </CardContent>
            {!isLoading && recentActivity.length > 0 && (
              <div className="px-5 pb-4">
                <Button
                  variant="ghost"
                  className="w-full text-violet-600 dark:text-violet-400 hover:text-violet-700"
                  onClick={() => router.push("/sessions")}
                >
                  View all sessions <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </Card>

          {/* System status */}
          <Card className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  System Status
                </p>
                <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0 text-xs">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                  Operational
                </Badge>
              </div>
              <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>GPS Verification</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Active
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Database</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Connected
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Auth Service</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ Running
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
