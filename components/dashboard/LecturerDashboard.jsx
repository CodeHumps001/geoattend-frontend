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
  Clock,
  Award,
  CheckCircle2,
  Calendar,
  BarChart3,
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
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}
          >
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
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

function CourseCard({ course, delay }) {
  const router = useRouter();
  const studentCount = course.enrollments?.length || 0;
  const sessionCount = course.sessions?.length || 0;

  // Calculate avg attendance for this course
  const presentTotal =
    course.sessions?.reduce((acc, s) => {
      return (
        acc + (s.attendance?.filter((a) => a.status === "PRESENT").length || 0)
      );
    }, 0) || 0;
  const totalPossible = studentCount * sessionCount;
  const attendancePct =
    totalPossible > 0 ? Math.round((presentTotal / totalPossible) * 100) : null;

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
                  className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-xs font-bold"
                >
                  {course.code}
                </Badge>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-tight line-clamp-1">
                {course.name}
              </h3>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5">
                {course.department}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-1" />
          </div>
          <div className="flex items-center gap-4 pt-3 border-t border-gray-50 dark:border-gray-800">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Users className="w-3.5 h-3.5" />
              <span>{studentCount} students</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <PlayCircle className="w-3.5 h-3.5" />
              <span>{sessionCount} sessions</span>
            </div>
            {attendancePct !== null && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 ml-auto">
                <BarChart3 className="w-3.5 h-3.5" />
                <span
                  className={
                    attendancePct >= 75
                      ? "text-emerald-600 dark:text-emerald-400 font-bold"
                      : "text-amber-600 dark:text-amber-400 font-bold"
                  }
                >
                  {attendancePct}%
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SessionActivityItem({ session, index }) {
  const now = new Date();
  const isActive = now < new Date(session.endTime);
  const presentCount =
    session.attendance?.filter((a) => a.status === "PRESENT").length || 0;
  const totalCount = session.attendance?.length || 0;

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div
        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-gray-50 dark:bg-gray-800"}`}
      >
        <PlayCircle
          className={`w-4 h-4 ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"}`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
            {session.course?.name || "Session"}
          </p>
          {isActive && (
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {presentCount}/{totalCount} present · {session.course?.code}
        </p>
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">
        {timeAgo(session.startTime)}
      </span>
    </div>
  );
}

export default function LecturerDashboard({ user }) {
  const router = useRouter();

  // Single efficient call — gets lecturer profile with all courses + sessions
  const { data: profileData, isLoading } = useQuery({
    queryKey: ["lecturer-me"],
    queryFn: async () => {
      const res = await api.get("/api/v1/lecturers/me");
      return res.data.data.lecturer;
    },
    enabled: !!user,
  });

  // Get sessions (filtered for this lecturer's courses)
  const { data: sessionsData } = useQuery({
    queryKey: ["all-sessions"],
    queryFn: async () => {
      const res = await api.get("/api/v1/attendance/session/all");
      return res.data.data.sessions;
    },
    refetchInterval: 15000,
    enabled: !!profileData,
  });

  const myCourses = profileData?.courses || [];
  const myCourseIds = new Set(myCourses.map((c) => c.id));
  const mySessions = (sessionsData || []).filter((s) =>
    myCourseIds.has(s.courseId),
  );

  const totalStudents = myCourses.reduce(
    (acc, c) => acc + (c.enrollments?.length || 0),
    0,
  );

  const avgAttendance = (() => {
    let totalPresent = 0,
      totalPossible = 0;
    myCourses.forEach((course) => {
      const students = course.enrollments?.length || 0;
      course.sessions?.forEach((session) => {
        const present =
          session.attendance?.filter((a) => a.status === "PRESENT").length || 0;
        totalPresent += present;
        totalPossible += students;
      });
    });
    return totalPossible > 0
      ? Math.round((totalPresent / totalPossible) * 100)
      : null;
  })();

  const todaySessions = mySessions.filter((s) => {
    return new Date(s.startTime).toDateString() === new Date().toDateString();
  }).length;

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
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 border-none shadow-xl">
          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 bg-teal-500/20 rounded-full translate-y-16 -translate-x-16 blur-2xl" />
          <CardContent className="relative z-10 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge className="bg-white/20 text-white border-none text-xs">
                {greeting()} 👋
              </Badge>
              <Badge className="bg-white/10 text-white border-white/20 text-xs">
                {myCourses.length} Course{myCourses.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 leading-tight">
              {user?.name?.split(" ")[0] || "Lecturer"}
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base max-w-md">
              {profileData?.department || "Managing your courses and sessions"}
            </p>
            <div className="flex flex-wrap gap-3 mt-5">
              <Button
                onClick={() => router.push("/sessions")}
                variant="secondary"
                className="bg-white text-emerald-600 hover:bg-gray-100 shadow-sm font-bold"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Session
              </Button>
              <Button
                onClick={() => router.push("/courses")}
                variant="outline"
                className="bg-emerald-500/20 text-white border-emerald-400/30 hover:bg-emerald-500/30 font-semibold"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                My Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="My Courses"
          value={isLoading ? "—" : myCourses.length}
          icon={BookOpen}
          color="blue"
          delay={1}
          loading={isLoading}
        />
        <StatCard
          label="Total Students"
          value={isLoading ? "—" : totalStudents}
          icon={Users}
          color="emerald"
          delay={2}
          loading={isLoading}
        />
        <StatCard
          label="Sessions Today"
          value={isLoading ? "—" : todaySessions}
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* My Courses */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
                My Courses
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-600 dark:text-emerald-400"
              onClick={() => router.push("/courses")}
            >
              Manage all <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : myCourses.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <CardContent className="py-12 text-center">
                <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 font-semibold">
                  No courses assigned yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Contact admin to assign courses to you
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {myCourses.slice(0, 4).map((course, i) => (
                <CourseCard key={course.id} course={course} delay={i} />
              ))}
              {myCourses.length > 4 && (
                <Button
                  variant="ghost"
                  className="w-full text-emerald-600 dark:text-emerald-400"
                  onClick={() => router.push("/courses")}
                >
                  View all {myCourses.length} courses{" "}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">
              Recent Sessions
            </h3>
          </div>

          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <CardContent className="px-4 sm:px-5 py-0">
              {mySessions.length === 0 ? (
                <div className="py-10 text-center">
                  <PlayCircle className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    No sessions yet
                  </p>
                  <Button
                    size="sm"
                    className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
                    onClick={() => router.push("/sessions")}
                  >
                    Start your first session
                  </Button>
                </div>
              ) : (
                mySessions
                  .slice(0, 5)
                  .map((session, i) => (
                    <SessionActivityItem
                      key={session.id}
                      session={session}
                      index={i}
                    />
                  ))
              )}
            </CardContent>
          </Card>

          {/* Pro tip */}
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-none">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Pro Tip
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    Start a session 5 minutes before class so students can mark
                    attendance as soon as they arrive.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
