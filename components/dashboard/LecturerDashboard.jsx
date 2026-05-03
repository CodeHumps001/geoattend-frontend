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
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

// Stat Card Component using shadcn
function StatCard({ label, value, icon: Icon, trend, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="relative overflow-hidden border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {label}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
              {trend && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp size={12} />
                  {trend}
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Course Card Component using shadcn
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
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-800">
        <CardContent className="p-0">
          <button
            onClick={() => router.push(`/courses/${course.id}`)}
            className="w-full text-left p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                  >
                    {course.code || "CS301"}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 dark:bg-gray-800"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    {studentCount} students
                  </Badge>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {course.description?.substring(0, 100) ||
                    "No description available"}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    {course.schedule || "Schedule TBD"}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {course.semester || "Current Semester"}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 mt-2" />
            </div>
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Activity Item Component
function ActivityItem({ icon: Icon, title, sub, time, color }) {
  const colorClasses = {
    emerald:
      "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    amber:
      "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
    violet:
      "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
  };

  return (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div
        className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center flex-shrink-0`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</p>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
        {time}
      </p>
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

  // Fetch sessions
  const { data: sessionsData } = useQuery({
    queryKey: ["lecturer-sessions"],
    queryFn: async () => {
      const res = await api.get("/api/v1/attendance/session/all");
      return res.data.data;
    },
    enabled: !!user,
    refetchInterval: 15000, // Refetch every 15 seconds to show real-time updates
  });

  const myCourses =
    coursesData?.courses?.filter(
      (c) => c.lecturer?.user?.email === user?.email,
    ) || [];

  // Filter sessions for the current lecturer's courses
  const mySessions = (sessionsData?.sessions || []).filter((session) => {
    return myCourses.some((course) => course.id === session.courseId);
  });

  const totalStudentsUnderMe = myCourses.reduce(
    (acc, c) => acc + (c.enrollments?.length || 0),
    0,
  );

  // Build recent activities from actual sessions
  const recentActivities = mySessions
    .slice(0, 4)
    .map((session, idx) => {
      const now = new Date();
      const isActive = now < new Date(session.endTime);
      const presentCount = (session.attendance || []).filter(
        (a) => a.status === "PRESENT",
      ).length;

      return {
        icon: isActive ? PlayCircle : CheckCircle2,
        title: isActive ? "Session in progress" : "Session completed",
        sub: `${session.course?.name || "Course"} — ${presentCount || 0} present`,
        time: new Date(session.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        color: isActive ? "emerald" : "blue",
      };
    })
    .concat([
      {
        icon: Users,
        title: "New student enrolled",
        sub: "Check the courses page",
        time: "Recently",
        color: "amber",
      },
    ])
    .slice(0, 4);

  return (
    <div className="w-full space-y-8 pb-10">
      {/* Hero Section with shadcn Card */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 dark:from-emerald-700 dark:via-emerald-800 dark:to-teal-900 border-none shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/20 rounded-full translate-y-16 -translate-x-16 blur-2xl" />
          <CardContent className="relative z-10 p-8">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-none"
              >
                Welcome Back 👋
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {myCourses.length} Course{myCourses.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              {user?.name?.split(" ")[0] || "Lecturer"}
            </h2>
            <p className="text-emerald-100 text-base max-w-md">
              {myCourses.length} course
              {myCourses.length !== 1 ? "s are" : " is"} under your management
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                onClick={() => router.push("/sessions")}
                variant="secondary"
                className="bg-white text-emerald-600 hover:bg-gray-100 shadow-sm"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Start New Session
              </Button>
              <Button
                onClick={() => router.push("/courses/new")}
                variant="outline"
                className="bg-emerald-500/20 backdrop-blur-md text-white border-emerald-400/30 hover:bg-emerald-500/30"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {coursesLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              label="My Courses"
              value={myCourses.length || "0"}
              icon={BookOpen}
              trend="Active"
              delay={1}
            />
            <StatCard
              label="Total Students"
              value={totalStudentsUnderMe}
              icon={Users}
              trend="Across all courses"
              delay={2}
            />
            <StatCard
              label="Sessions Today"
              value={
                mySessions.filter((s) => {
                  const today = new Date();
                  const sessionDate = new Date(s.startTime);
                  return sessionDate.toDateString() === today.toDateString();
                }).length
              }
              icon={PlayCircle}
              trend="Active & upcoming"
              delay={3}
            />
            <StatCard
              label="Avg Attendance"
              value="91.2%"
              icon={TrendingUp}
              trend="+5.2% vs last month"
              delay={4}
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* My Courses Section */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                My Courses
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-600 dark:text-emerald-400"
              onClick={() => router.push("/courses")}
            >
              Manage all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {coursesLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
              <Skeleton className="h-32 rounded-xl" />
            </div>
          ) : myCourses.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
              <CardContent className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">
                  No courses assigned
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Create a course to begin tracking attendance.
                </p>
                <Button
                  onClick={() => router.push("/courses/new")}
                  variant="outline"
                  className="mt-4"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Your First Course
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {myCourses.slice(0, 3).map((course, i) => (
                <CourseCard key={course.id} course={course} delay={i} />
              ))}
              {myCourses.length > 3 && (
                <Button
                  variant="ghost"
                  className="w-full text-emerald-600 dark:text-emerald-400"
                  onClick={() => router.push("/courses")}
                >
                  View all {myCourses.length} courses
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-1">
                {recentActivities.map((activity, idx) => (
                  <div key={idx}>
                    <ActivityItem {...activity} />
                    {idx < recentActivities.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
                onClick={() => router.push("/reports")}
              >
                View Full Activity Log
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Quick Tip Card */}
          <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-none">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Pro Tip
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    Start a session 5 minutes before class to ensure smooth
                    check-ins.
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
