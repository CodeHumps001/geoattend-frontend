"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/axios";

import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  GraduationCap,
  MapPin,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

/* -------------------------------------------------------------------------- */
/*                                  STAT CARD                                 */
/* -------------------------------------------------------------------------- */

function StatCard({ label, value, icon: Icon, trend, subtext, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="group relative overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-blue-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

        <CardContent className="relative p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-slate-400 font-medium">{label}</p>

              <h3 className="mt-2 text-3xl font-black tracking-tight text-white">
                {value}
              </h3>

              {trend && (
                <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                  <TrendingUp className="h-3 w-3" />
                  {trend}
                </div>
              )}

              {subtext && (
                <p className="mt-3 text-xs text-slate-500">{subtext}</p>
              )}
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 transition-transform duration-300 group-hover:scale-110">
              <Icon className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 COURSE CARD                                */
/* -------------------------------------------------------------------------- */

function CourseCard({ course, percentage, delay }) {
  const router = useRouter();

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="group overflow-hidden border border-white/10 bg-[#0b1220]/90 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
        <button
          onClick={() => router.push(`/courses/${course.id}`)}
          className="w-full text-left"
        >
          <CardContent className="p-6">
            {/* Top */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Badge className="border border-blue-500/20 bg-blue-500/10 text-blue-300 hover:bg-blue-500/10">
                    {course.code || "CS301"}
                  </Badge>

                  <Badge className="border border-white/10 bg-white/5 text-slate-300 hover:bg-white/5">
                    <Users className="mr-1 h-3 w-3" />
                    {course.enrollments?.length || 0} Students
                  </Badge>

                  {percentage && (
                    <Badge className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/10">
                      {percentage}% Attendance
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white">{course.title}</h3>

                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-400">
                  {course.description ||
                    "No description available for this course."}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition-all group-hover:border-blue-500/20 group-hover:bg-blue-500/10 group-hover:text-blue-300">
                <ChevronRight className="h-5 w-5" />
              </div>
            </div>

            {/* Progress */}
            {percentage && (
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    Attendance Progress
                  </span>

                  <span className="text-xs font-bold text-white">
                    {percentage}%
                  </span>
                </div>

                <Progress value={percentage} className="h-2 bg-white/10" />
              </div>
            )}

            {/* Bottom */}
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {course.schedule || "Schedule TBD"}
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {course.semester || "Current Semester"}
              </div>
            </div>
          </CardContent>
        </button>
      </Card>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               ACTIVITY ITEM                                */
/* -------------------------------------------------------------------------- */

function ActivityItem({ icon: Icon, title, sub, time, color }) {
  const styles = {
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };

  return (
    <div className="flex items-start gap-4 rounded-2xl p-3 transition-all hover:bg-white/[0.03]">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${styles[color]}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-white">{title}</p>

        <p className="mt-1 text-xs text-slate-400">{sub}</p>
      </div>

      <p className="text-xs text-slate-500 whitespace-nowrap">{time}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             STUDENT DASHBOARD                              */
/* -------------------------------------------------------------------------- */

export default function StudentDashboard({ user }) {
  const router = useRouter();

  const { data: studentData, isLoading: studentLoading } = useQuery({
    queryKey: ["student-profile", user?.id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/students`);
      return res.data.data;
    },
    enabled: !!user,
  });

  const enrollments =
    studentData?.students?.find((s) => s.userId === user?.id)?.enrollments ||
    [];

  const recentActivities = [
    {
      icon: CheckCircle2,
      title: "Attendance marked successfully",
      sub: "CS301 — Data Structures",
      time: "2h ago",
      color: "green",
    },
    {
      icon: CheckCircle2,
      title: "Lecture attended",
      sub: "CS302 — Algorithms",
      time: "Yesterday",
      color: "green",
    },
    {
      icon: AlertCircle,
      title: "Absent from lecture",
      sub: "MATH301 — Calculus",
      time: "2 days ago",
      color: "red",
    },
    {
      icon: BookOpen,
      title: "New course enrollment",
      sub: "CS303 — Databases",
      time: "Last week",
      color: "blue",
    },
  ];

  const averageAttendance = 87.5;
  const perfectCourses = 3;
  const weeklyAttendance = 8;

  return (
    <div className="w-full space-y-8 pb-10">
      {/* HERO */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <Card className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#172554] shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.25),transparent_30%)]" />

          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

          <CardContent className="relative z-10 p-8 md:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              {/* Left */}
              <div className="max-w-2xl">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <Badge className="border border-white/10 bg-white/10 px-3 py-1 text-white hover:bg-white/10">
                    <Sparkles className="mr-1 h-3 w-3" />
                    Student Portal
                  </Badge>

                  <Badge className="border border-blue-400/20 bg-blue-500/10 text-blue-200 hover:bg-blue-500/10">
                    {enrollments.length} Active Courses
                  </Badge>
                </div>

                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-white/10">
                    <AvatarFallback className="bg-blue-500/10 text-lg font-bold text-blue-300">
                      {user?.name
                        ?.split(" ")
                        ?.map((n) => n[0])
                        ?.join("")
                        ?.slice(0, 2) || "ST"}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <h1 className="text-3xl font-black tracking-tight text-white md:text-5xl">
                      Hey, {user?.name?.split(" ")[0] || "Student"}
                    </h1>

                    <p className="mt-2 text-base text-blue-100">
                      Your attendance consistency is looking great this
                      semester.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    onClick={() => router.push("/attendance")}
                    className="h-11 rounded-xl bg-white text-blue-700 hover:bg-slate-100"
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Mark Attendance
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => router.push("/courses")}
                    className="h-11 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10"
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    View Courses
                  </Button>
                </div>
              </div>

              {/* Right Indicators */}
              <div className="grid grid-cols-2 gap-4 lg:w-[320px]">
                {[
                  {
                    label: "Attendance",
                    value: "87.5%",
                  },
                  {
                    label: "Classes",
                    value: "8 This Week",
                  },
                  {
                    label: "Perfect",
                    value: "3 Courses",
                  },
                  {
                    label: "Status",
                    value: "Excellent",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl"
                  >
                    <p className="text-xs text-slate-400">{item.label}</p>

                    <h4 className="mt-2 text-lg font-bold text-white">
                      {item.value}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {studentLoading ? (
          <>
            <Skeleton className="h-32 rounded-3xl bg-white/5" />
            <Skeleton className="h-32 rounded-3xl bg-white/5" />
            <Skeleton className="h-32 rounded-3xl bg-white/5" />
            <Skeleton className="h-32 rounded-3xl bg-white/5" />
          </>
        ) : (
          <>
            <StatCard
              label="Enrolled Courses"
              value={enrollments.length || "0"}
              icon={BookOpen}
              subtext="Currently active"
              delay={1}
            />

            <StatCard
              label="Avg Attendance"
              value={`${averageAttendance}%`}
              icon={TrendingUp}
              trend="+5.2% this month"
              delay={2}
            />

            <StatCard
              label="Weekly Attendance"
              value={weeklyAttendance}
              icon={Clock}
              subtext="Lectures attended"
              delay={3}
            />

            <StatCard
              label="Perfect Records"
              value={perfectCourses}
              icon={Award}
              subtext="100% attendance"
              delay={4}
            />
          </>
        )}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
        {/* COURSES */}
        <div className="xl:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-white">My Courses</h3>

              <p className="mt-1 text-sm text-slate-400">
                Track attendance and monitor progress.
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={() => router.push("/courses")}
              className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
            >
              View All
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>

          {studentLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-44 rounded-3xl bg-white/5" />
              <Skeleton className="h-44 rounded-3xl bg-white/5" />
              <Skeleton className="h-44 rounded-3xl bg-white/5" />
            </div>
          ) : enrollments.length === 0 ? (
            <Card className="border border-dashed border-white/10 bg-white/[0.02]">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <GraduationCap className="h-12 w-12 text-slate-600" />

                <h4 className="mt-4 text-lg font-semibold text-white">
                  No enrolled courses
                </h4>

                <p className="mt-2 max-w-sm text-sm text-slate-400">
                  Your enrolled courses will appear here once assigned by your
                  department or admin.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {enrollments.slice(0, 3).map((enrollment, i) => (
                <CourseCard
                  key={enrollment.id}
                  course={enrollment.course}
                  percentage={87 - i * 5}
                  delay={i}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="xl:col-span-5 space-y-6">
          {/* ACTIVITY */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Recent Activity
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Your latest attendance events.
                </p>
              </div>

              <Badge className="border border-white/10 bg-white/5 text-slate-300 hover:bg-white/5">
                Last 7 Days
              </Badge>
            </div>

            <Card className="border border-white/10 bg-[#0b1220]/90">
              <CardContent className="p-4">
                <div className="space-y-1">
                  {recentActivities.map((activity, idx) => (
                    <div key={idx}>
                      <ActivityItem {...activity} />

                      {idx < recentActivities.length - 1 && (
                        <Separator className="my-2 bg-white/5" />
                      )}
                    </div>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  onClick={() => router.push("/attendance/history")}
                  className="mt-4 w-full text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
                >
                  View Full History
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ACHIEVEMENT */}
          <Card className="overflow-hidden border border-amber-500/10 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent">
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
                  <Award className="h-5 w-5 text-amber-400" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white">
                      Achievement Unlocked
                    </h4>

                    <Badge className="border border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/10">
                      Rare
                    </Badge>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    You've maintained over 90% attendance consistently for 3
                    straight weeks.
                  </p>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-amber-300">
                      Consistency Champion
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Top-performing attendance streak.
                    </p>
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
