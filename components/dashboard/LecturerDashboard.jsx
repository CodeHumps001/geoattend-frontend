"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/axios";

import {
  BookOpen,
  ChevronRight,
  PlayCircle,
  TrendingUp,
  Users,
  PlusCircle,
  Calendar,
  Clock,
  Award,
  Activity,
  BellRing,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { Skeleton } from "@/components/ui/skeleton";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function StatCard({ label, value, icon: Icon, trend, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="group relative overflow-hidden border border-white/10 bg-white dark:bg-[#0F172A] shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-teal-500/[0.05]" />

        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {label}
              </p>

              <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
                {value}
              </h3>

              <div className="flex items-center gap-1 mt-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                  <ArrowUpRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                </div>

                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  {trend}
                </p>
              </div>
            </div>

            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CourseCard({ course, delay }) {
  const router = useRouter();

  const studentCount = course.enrollments?.length || 0;

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="group overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white dark:bg-[#0F172A] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <button
          onClick={() => router.push(`/courses/${course.id}`)}
          className="w-full text-left"
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none dark:bg-emerald-500/10 dark:text-emerald-400">
                    {course.code || "CS301"}
                  </Badge>

                  <Badge variant="outline" className="rounded-full">
                    <Users className="w-3 h-3 mr-1" />
                    {studentCount} Students
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-emerald-600 transition-colors">
                  {course.title}
                </h3>

                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2">
                  {course.description ||
                    "No description available for this course yet."}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {course.schedule || "Mon • 10:00 AM"}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {course.semester || "Semester 1"}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-emerald-500 transition-colors">
                  <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
                </div>

                <div className="flex -space-x-2">
                  {[1, 2, 3].map((item) => (
                    <Avatar
                      key={item}
                      className="w-8 h-8 border-2 border-white dark:border-[#0F172A]"
                    >
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                        ST
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </button>
      </Card>
    </motion.div>
  );
}

function ActivityItem({ icon: Icon, title, sub, time, color }) {
  const colors = {
    emerald:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    amber:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    violet:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  };

  return (
    <div className="flex items-start gap-4 rounded-2xl p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colors[color]}`}
      >
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1">
        <p className="font-semibold text-slate-900 dark:text-white text-sm">
          {title}
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub}</p>
      </div>

      <p className="text-xs text-slate-400 whitespace-nowrap">{time}</p>
    </div>
  );
}

export default function LecturerDashboard({ user }) {
  const router = useRouter();

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["lecturer-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data;
    },
    enabled: !!user,
  });

  const myCourses =
    coursesData?.courses?.filter(
      (c) => c.lecturer?.user?.email === user?.email,
    ) || [];

  const totalStudentsUnderMe = myCourses.reduce(
    (acc, c) => acc + (c.enrollments?.length || 0),
    0,
  );

  const recentActivities = [
    {
      icon: PlayCircle,
      title: "Attendance session started",
      sub: "CS301 • Lecture Hall B",
      time: "2m ago",
      color: "emerald",
    },
    {
      icon: Users,
      title: "28 students checked in",
      sub: "Real-time GPS verification completed",
      time: "15m ago",
      color: "blue",
    },
    {
      icon: BookOpen,
      title: "New course created",
      sub: "CS302 • Algorithms & Complexity",
      time: "Yesterday",
      color: "amber",
    },
    {
      icon: Award,
      title: "Weekly report generated",
      sub: "91.2% average attendance",
      time: "Yesterday",
      color: "violet",
    },
  ];

  return (
    <div className="w-full pb-10 space-y-8">
      {/* HERO */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <Card className="relative overflow-hidden border-none rounded-[32px] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 shadow-2xl">
          <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-black/10 rounded-full blur-3xl" />

          <CardContent className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-5">
                  <Badge className="bg-white/15 text-white border-none backdrop-blur-md px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Smart Dashboard
                  </Badge>

                  <Badge
                    variant="outline"
                    className="border-white/20 text-white"
                  >
                    <Activity className="w-3 h-3 mr-1" />
                    Live Monitoring
                  </Badge>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                  Welcome back,
                </h1>

                <h2 className="text-3xl md:text-4xl font-black text-emerald-100 mt-1">
                  {user?.name?.split(" ")[0] || "Lecturer"}
                </h2>

                <p className="text-emerald-100/90 max-w-xl mt-5 text-base leading-relaxed">
                  Manage attendance, monitor live student activity, and oversee
                  all your academic sessions from one intelligent dashboard.
                </p>

                <div className="flex flex-wrap gap-3 mt-8">
                  <Button
                    onClick={() => router.push("/sessions")}
                    className="bg-white text-emerald-700 hover:bg-slate-100 rounded-2xl h-12 px-6 font-semibold shadow-lg"
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Start Session
                  </Button>

                  <Button
                    onClick={() => router.push("/courses/new")}
                    variant="outline"
                    className="border-white/20 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-2xl h-12 px-6"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Create Course
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 min-w-[280px]">
                {[
                  {
                    label: "Courses",
                    value: myCourses.length,
                  },
                  {
                    label: "Students",
                    value: totalStudentsUnderMe,
                  },
                  {
                    label: "Attendance",
                    value: "91%",
                  },
                  {
                    label: "Sessions",
                    value: "12",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl p-5"
                  >
                    <p className="text-emerald-100 text-sm">{item.label}</p>

                    <h3 className="text-3xl font-black text-white mt-2">
                      {item.value}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {coursesLoading ? (
          <>
            <Skeleton className="h-36 rounded-3xl" />
            <Skeleton className="h-36 rounded-3xl" />
            <Skeleton className="h-36 rounded-3xl" />
            <Skeleton className="h-36 rounded-3xl" />
          </>
        ) : (
          <>
            <StatCard
              label="My Courses"
              value={myCourses.length || 0}
              icon={BookOpen}
              trend="Currently active"
              delay={1}
            />

            <StatCard
              label="Total Students"
              value={totalStudentsUnderMe}
              icon={Users}
              trend="Across all classes"
              delay={2}
            />

            <StatCard
              label="Sessions Today"
              value="3"
              icon={PlayCircle}
              trend="2 completed"
              delay={3}
            />

            <StatCard
              label="Attendance Rate"
              value="91.2%"
              icon={TrendingUp}
              trend="+5.2% this month"
              delay={4}
            />
          </>
        )}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="xl:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                My Courses
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                Manage all your assigned courses and sessions
              </p>
            </div>

            <Button
              variant="ghost"
              className="rounded-2xl"
              onClick={() => router.push("/courses")}
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {coursesLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-40 rounded-3xl" />
              <Skeleton className="h-40 rounded-3xl" />
            </div>
          ) : myCourses.length === 0 ? (
            <Card className="rounded-3xl border-dashed border-2">
              <CardContent className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center mb-5">
                  <BookOpen className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  No courses yet
                </h3>

                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                  Start by creating your first course and begin tracking
                  attendance in real-time.
                </p>

                <Button
                  className="mt-6 rounded-2xl"
                  onClick={() => router.push("/courses/new")}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Course
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-5">
              {myCourses.slice(0, 4).map((course, i) => (
                <CourseCard key={course.id} course={course} delay={i} />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="xl:col-span-4 space-y-6">
          {/* ACTIVITY */}
          <Card className="rounded-3xl border border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Recent Activity
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Latest classroom actions
                  </p>
                </div>

                <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                  <BellRing className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>

              <div className="space-y-2">
                {recentActivities.map((activity, idx) => (
                  <div key={idx}>
                    <ActivityItem {...activity} />

                    {idx < recentActivities.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>

              <Button variant="ghost" className="w-full mt-5 rounded-2xl">
                View Activity Log
              </Button>
            </CardContent>
          </Card>

          {/* TIP */}
          <Card className="rounded-3xl border-none bg-gradient-to-br from-emerald-500 to-teal-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />

            <CardContent className="relative p-6">
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-5">
                <Award className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-black">Smart Teaching Tip</h3>

              <p className="text-emerald-50 text-sm leading-relaxed mt-3">
                Starting attendance sessions 5 minutes before class improves
                student check-in completion rates by up to 30%.
              </p>

              <Button
                variant="secondary"
                className="mt-6 rounded-2xl bg-white text-emerald-700 hover:bg-slate-100"
              >
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
