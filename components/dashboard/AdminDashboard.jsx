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
  Eye,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Activity,
  Sparkles,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

/* =========================
   STAT CARD
========================= */

function StatCard({ label, value, icon: Icon, trend, delay, color }) {
  const styles = {
    violet: {
      bg: "from-violet-500 to-purple-600",
      soft: "bg-violet-500/10",
      text: "text-violet-400",
      border: "border-violet-500/20",
    },

    blue: {
      bg: "from-blue-500 to-cyan-500",
      soft: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
    },

    emerald: {
      bg: "from-emerald-500 to-teal-500",
      soft: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
    },

    amber: {
      bg: "from-amber-500 to-orange-500",
      soft: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
    },
  };

  const active = styles[color];

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card
        className={`relative overflow-hidden border bg-[#0F172A]/80 backdrop-blur-xl ${active.border} shadow-[0_0_0_1px_rgba(255,255,255,0.02)] hover:translate-y-[-3px] transition-all duration-300`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

        <CardContent className="relative p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">{label}</p>

              <h2 className="mt-3 text-3xl font-black text-white tracking-tight">
                {value}
              </h2>

              <div
                className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${active.soft} ${active.text}`}
              >
                <TrendingUp className="w-3 h-3" />
                {trend}
              </div>
            </div>

            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${active.bg} flex items-center justify-center shadow-lg`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* =========================
   QUICK ACTION CARD
========================= */

function QuickActionCard({
  label,
  icon: Icon,
  path,
  description,
  delay,
  color,
}) {
  const router = useRouter();

  const styles = {
    violet:
      "from-violet-500/20 to-purple-500/10 border-violet-500/20 hover:border-violet-400/40",

    blue: "from-blue-500/20 to-cyan-500/10 border-blue-500/20 hover:border-blue-400/40",

    emerald:
      "from-emerald-500/20 to-teal-500/10 border-emerald-500/20 hover:border-emerald-400/40",

    amber:
      "from-amber-500/20 to-orange-500/10 border-amber-500/20 hover:border-amber-400/40",
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <button
        onClick={() => router.push(path)}
        className={`group relative overflow-hidden rounded-3xl border bg-gradient-to-br ${styles[color]} p-6 text-left transition-all duration-300 hover:translate-y-[-4px] hover:shadow-2xl`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
              <Icon className="w-6 h-6 text-white" />
            </div>

            <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold text-white">{label}</h3>

            <p className="mt-1 text-sm text-slate-400 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

/* =========================
   ACTIVITY ITEM
========================= */

function ActivityItem({ icon: Icon, title, sub, time, color }) {
  const colors = {
    violet: "bg-violet-500/10 text-violet-400",
    blue: "bg-blue-500/10 text-blue-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    amber: "bg-amber-500/10 text-amber-400",
  };

  return (
    <div className="flex items-start gap-4 rounded-2xl p-3 hover:bg-white/[0.03] transition-colors">
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colors[color]}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white">{title}</p>

        <p className="text-xs text-slate-400 mt-1">{sub}</p>
      </div>

      <p className="text-xs text-slate-500 whitespace-nowrap">{time}</p>
    </div>
  );
}

/* =========================
   MAIN COMPONENT
========================= */

export default function AdminDashboard({ user }) {
  const router = useRouter();

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["all-students"],
    queryFn: async () => {
      const res = await api.get("/api/v1/students");
      return res.data.data;
    },
  });

  const { data: coursesData } = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data;
    },
  });

  const totalStudents = studentsData?.total || 0;
  const totalCourses = coursesData?.count || 0;

  const recentActivities = [
    {
      icon: GraduationCap,
      title: "New student registered",
      sub: "Yaw Fosu • Computer Science",
      time: "1h ago",
      color: "blue",
    },

    {
      icon: BookOpen,
      title: "Course created",
      sub: "CS304 • Machine Learning",
      time: "3h ago",
      color: "emerald",
    },

    {
      icon: Users,
      title: "Student enrolled",
      sub: "Ama Serwaa → CS301",
      time: "5h ago",
      color: "amber",
    },

    {
      icon: PlayCircle,
      title: "Session completed",
      sub: "CS301 • 28 students present",
      time: "Yesterday",
      color: "violet",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-[#020817] text-white space-y-8 pb-10">
      {/* HERO */}

      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-violet-700 via-[#5B21B6] to-[#0F172A] shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_30%)]" />

          <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-400/20 rounded-full blur-3xl" />

          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 p-8 md:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-white/15 hover:bg-white/15 text-white border-white/10 px-4 py-1">
                Admin Control Center
              </Badge>

              <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 px-4 py-1">
                <Activity className="w-3.5 h-3.5 mr-1" />
                System Active
              </Badge>
            </div>

            <div className="mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-black leading-tight">
                  Welcome back,
                  <br />
                  <span className="bg-gradient-to-r from-white to-violet-200 bg-clip-text text-transparent">
                    {user?.name?.split(" ")[0] || "Admin"}
                  </span>
                </h1>

                <p className="mt-4 text-slate-300 max-w-xl leading-relaxed">
                  Monitor institutional performance, manage students &
                  lecturers, and gain real-time insights into attendance
                  analytics.
                </p>

                <div className="flex flex-wrap gap-3 mt-8">
                  <Button
                    onClick={() => router.push("/users")}
                    className="h-11 rounded-xl bg-white text-violet-700 hover:bg-slate-100 font-semibold"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Users
                  </Button>

                  <Button
                    onClick={() => router.push("/reports")}
                    variant="outline"
                    className="h-11 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Reports
                  </Button>
                </div>
              </div>

              {/* RIGHT INFO PANEL */}

              <div className="grid grid-cols-2 gap-4 min-w-[320px]">
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                  <p className="text-sm text-slate-400">Institution Health</p>

                  <div className="mt-3 flex items-end gap-2">
                    <h2 className="text-3xl font-black text-white">96%</h2>

                    <span className="text-emerald-300 text-sm mb-1">+4.2%</span>
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[96%] bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">
                  <p className="text-sm text-slate-400">Live Sessions</p>

                  <h2 className="mt-3 text-3xl font-black text-white">12</h2>

                  <div className="mt-4 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm text-slate-300">Active now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* STATS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {studentsLoading ? (
          <>
            <Skeleton className="h-36 rounded-3xl bg-white/5" />
            <Skeleton className="h-36 rounded-3xl bg-white/5" />
            <Skeleton className="h-36 rounded-3xl bg-white/5" />
            <Skeleton className="h-36 rounded-3xl bg-white/5" />
          </>
        ) : (
          <>
            <StatCard
              label="Total Students"
              value={totalStudents}
              icon={GraduationCap}
              trend="+12% this month"
              delay={1}
              color="violet"
            />

            <StatCard
              label="Total Courses"
              value={totalCourses}
              icon={BookOpen}
              trend="+4 newly added"
              delay={2}
              color="blue"
            />

            <StatCard
              label="Active Sessions"
              value="12"
              icon={PlayCircle}
              trend="3 ongoing now"
              delay={3}
              color="emerald"
            />

            <StatCard
              label="Avg Attendance"
              value="88.4%"
              icon={BarChart3}
              trend="+5.2% growth"
              delay={4}
              color="amber"
            />
          </>
        )}
      </div>

      {/* MAIN GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* QUICK ACTIONS */}

        <div className="xl:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">Quick Actions</h2>

              <p className="text-sm text-slate-400 mt-1">
                Frequently used administrative actions
              </p>
            </div>

            <Button
              variant="ghost"
              className="text-violet-300 hover:text-white hover:bg-white/5"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <QuickActionCard
              label="Add Student"
              icon={GraduationCap}
              path="/users"
              description="Register and onboard new students"
              delay={5}
              color="blue"
            />

            <QuickActionCard
              label="Create Course"
              icon={BookOpen}
              path="/courses"
              description="Add and manage academic courses"
              delay={6}
              color="emerald"
            />

            <QuickActionCard
              label="View Reports"
              icon={BarChart3}
              path="/reports"
              description="Analytics, charts & insights"
              delay={7}
              color="amber"
            />

            <QuickActionCard
              label="Manage Users"
              icon={Users}
              path="/users"
              description="Manage lecturers & permissions"
              delay={8}
              color="violet"
            />
          </div>
        </div>

        {/* ACTIVITY */}

        <div className="xl:col-span-5 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">
                Recent Activity
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Latest updates across the platform
              </p>
            </div>

            <Badge className="bg-white/5 border border-white/10 text-slate-300">
              Last 24 hours
            </Badge>
          </div>

          <Card className="border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl rounded-3xl">
            <CardContent className="p-5">
              <div className="space-y-2">
                {recentActivities.map((activity, idx) => (
                  <div key={idx}>
                    <ActivityItem {...activity} />

                    {idx < recentActivities.length - 1 && (
                      <Separator className="bg-white/5 my-2" />
                    )}
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                className="w-full mt-5 text-violet-300 hover:text-white hover:bg-white/5"
                onClick={() => router.push("/reports")}
              >
                View Full Activity
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* SYSTEM STATUS */}

          <Card className="rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 backdrop-blur-xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-violet-300" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white">System Status</h3>

                    <Badge className="bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                      Operational
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                    All attendance systems, authentication services, and live
                    sessions are currently running smoothly.
                  </p>

                  <div className="mt-5 flex items-center -space-x-3">
                    {["YF", "AS", "KM", "EO"].map((item) => (
                      <Avatar
                        key={item}
                        className="border-2 border-[#020817] w-10 h-10"
                      >
                        <AvatarFallback className="bg-violet-500/20 text-violet-200 text-xs">
                          {item}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
