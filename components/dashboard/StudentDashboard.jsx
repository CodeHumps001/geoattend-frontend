"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import {
  BookOpen,
  ChevronRight,
  MapPin,
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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

function StatCard({ label, value, icon: Icon, color, delay, loading }) {
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
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-7 w-16 mb-1" />
          ) : (
            <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              {value}
            </p>
          )}
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5">
            {label}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CourseCard({ course, enrollment, percentage, sessionCount, delay }) {
  const router = useRouter();
  const pct = percentage ? parseFloat(percentage) : 0;
  const color = pct >= 75 ? "emerald" : pct >= 50 ? "amber" : "red";
  const colorMap = {
    emerald: {
      bar: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
    },
    amber: { bar: "bg-amber-400", text: "text-amber-600 dark:text-amber-400" },
    red: { bar: "bg-red-500", text: "text-red-600 dark:text-red-400" },
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -1 }}
    >
      <Card
        className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-900"
        onClick={() => router.push(`/courses/${course.id}`)}
      >
        <CardContent className="p-4 sm:p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <Badge
                  variant="outline"
                  className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-xs font-bold"
                >
                  {course.code}
                </Badge>
                {pct < 75 && pct > 0 && (
                  <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-0 text-xs">
                    Below threshold
                  </Badge>
                )}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-tight line-clamp-1">
                {course.name}
              </h3>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 line-clamp-1">
                {course.department}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-1" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Attendance
              </span>
              <span className={`text-xs font-bold ${colorMap[color].text}`}>
                {percentage || "No sessions yet"}
              </span>
            </div>
            {pct > 0 && (
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${colorMap[color].bar}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(pct, 100)}%` }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800">
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {sessionCount} session{sessionCount !== 1 ? "s" : ""}
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Enrolled{" "}
              {new Date(enrollment.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ActivityItem({ record, index }) {
  const isPresent = record.status === "PRESENT";
  const courseName = record.session?.course?.name || "Unknown Course";
  const courseCode = record.session?.course?.code || "";
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0"
    >
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isPresent ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20"}`}
      >
        {isPresent ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <XCircle className="w-4 h-4 text-red-500 dark:text-red-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
          {courseCode} — {courseName}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Marked {isPresent ? "present" : "absent"}
        </p>
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
        {timeAgo(record.markedAt)}
      </span>
    </motion.div>
  );
}

export default function StudentDashboard({ user }) {
  const router = useRouter();

  // Single efficient call — fetches student + enrollments + attendance history
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["student-me"],
    queryFn: async () => {
      const res = await api.get("/api/v1/students/me");
      return res.data.data.student;
    },
    enabled: !!user,
  });

  const enrollments = profileData?.enrollments || [];
  const recentAttendance = profileData?.attendance || [];

  // Fetch attendance percentages for each enrolled course in parallel
  const { data: percentages, isLoading: loadingPct } = useQuery({
    queryKey: [
      "student-percentages",
      profileData?.id,
      enrollments.map((e) => e.courseId),
    ],
    queryFn: async () => {
      const results = await Promise.all(
        enrollments.map(async (enrollment) => {
          try {
            const res = await api.get(
              `/api/v1/students/${profileData.id}/attendance/${enrollment.courseId}`,
            );
            return { courseId: enrollment.courseId, data: res.data.data };
          } catch {
            return { courseId: enrollment.courseId, data: null };
          }
        }),
      );
      return Object.fromEntries(results.map((r) => [r.courseId, r.data]));
    },
    enabled: !!profileData?.id && enrollments.length > 0,
  });

  const avgAttendance = percentages
    ? Math.round(
        Object.values(percentages)
          .map((d) => parseFloat(d?.percentage || 0))
          .reduce((a, b) => a + b, 0) /
          Math.max(Object.keys(percentages).length, 1),
      )
    : 0;

  const perfectCourses = percentages
    ? Object.values(percentages).filter(
        (d) => parseFloat(d?.percentage || 0) >= 100,
      ).length
    : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 pb-10">
      {/* Hero */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-none shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-indigo-500/20 rounded-full translate-y-16 -translate-x-16 blur-2xl" />
          <CardContent className="relative z-10 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge className="bg-white/20 text-white border-none text-xs">
                {greeting()} 👋
              </Badge>
              {profileData && (
                <Badge className="bg-white/10 text-white border-white/20 text-xs">
                  {profileData.department} · Level {profileData.level}
                </Badge>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              {user?.name?.split(" ")[0] || "Student"}
            </h2>
            <p className="text-blue-100 text-sm sm:text-base max-w-md">
              {profileData?.studentCode || "Keep up the great attendance!"}
            </p>
            <Button
              onClick={() => router.push("/attendance")}
              variant="secondary"
              className="mt-5 bg-white text-blue-600 hover:bg-gray-100 shadow-sm font-bold"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Enrolled Courses"
          value={isLoading ? "—" : enrollments.length}
          icon={BookOpen}
          color="blue"
          delay={1}
          loading={isLoading}
        />
        <StatCard
          label="Avg Attendance"
          value={loadingPct ? "—" : `${avgAttendance}%`}
          icon={TrendingUp}
          color="emerald"
          delay={2}
          loading={loadingPct}
        />
        <StatCard
          label="Sessions Attended"
          value={
            isLoading
              ? "—"
              : recentAttendance.filter((a) => a.status === "PRESENT").length
          }
          icon={Clock}
          color="violet"
          delay={3}
          loading={isLoading}
        />
        <StatCard
          label="Perfect Courses"
          value={loadingPct ? "—" : perfectCourses}
          icon={Award}
          color="amber"
          delay={4}
          loading={loadingPct}
        />
      </div>

      {/* My Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
              My Courses
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-600 dark:text-blue-400 text-sm"
            onClick={() => router.push("/courses")}
          >
            See all <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-36 rounded-2xl" />
            ))}
          </div>
        ) : enrollments.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <CardContent className="py-12 text-center">
              <GraduationCap className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-semibold">
                No courses yet
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Ask your admin to enroll you in courses
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {enrollments.slice(0, 4).map((enrollment, i) => (
              <CourseCard
                key={enrollment.id}
                course={enrollment.course}
                enrollment={enrollment}
                percentage={percentages?.[enrollment.courseId]?.percentage}
                sessionCount={enrollment.course?.sessions?.length || 0}
                delay={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      {recentAttendance.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardContent className="px-4 sm:px-5 py-0">
              {recentAttendance.slice(0, 5).map((record, i) => (
                <ActivityItem key={record.id} record={record} index={i} />
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
