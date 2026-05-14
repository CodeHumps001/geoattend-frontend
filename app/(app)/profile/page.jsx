// app/(app)/profile/page.jsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  LogOut,
  Shield,
  Hash,
  Building,
  GraduationCap,
  Calendar,
  Users,
  Award,
  Clock,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function InfoRow({ icon: Icon, label, value, loading }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-white/20 dark:border-white/10 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-white/40 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {label}
        </p>
        {loading ? (
          <Skeleton className="h-4 w-32 mt-1 bg-white/20 dark:bg-white/10" />
        ) : (
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {value || "—"}
          </p>
        )}
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, gradient, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="backdrop-blur-xl bg-white/30 dark:bg-gray-900/30 border border-white/30 dark:border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 group">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {value}
              </p>
            </div>
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function QuickStat({ label, value, icon: Icon }) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-2">
        <Icon className="w-4 h-4 text-gray-700 dark:text-gray-300" />
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}

export default function ProfilePage() {
  const { user, isCourseRep, isStudent } = useAuth();
  const { logout } = useAuthStore();
  const router = useRouter();

  // Fetch class space data for stats
  const { data: classResponse, isLoading: classLoading } = useQuery({
    queryKey: ["profile-class"],
    queryFn: async () => {
      if (isCourseRep) {
        const res = await api.get("/api/v1/class/me");
        return res.data.data;
      } else {
        const res = await api.get("/api/v1/class/student");
        return res.data.data;
      }
    },
    enabled: !!user,
  });

  // Fetch attendance stats for students
  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ["profile-attendance"],
    queryFn: async () => {
      if (isStudent) {
        const res = await api.get("/api/v1/attendance/me");
        return res.data.data;
      }
      return null;
    },
    enabled: isStudent && !!user,
  });

  const classSpace = classResponse?.classSpace;
  const classStats = {
    totalStudents:
      classSpace?._count?.students || classSpace?.students?.length || 0,
    totalCourses:
      classSpace?._count?.courses || classSpace?.courses?.length || 0,
    totalSessions: classSpace?._count?.sessions || 0,
  };

  const attendanceStats = attendanceData || {
    totalRecords: 0,
    totalPresent: 0,
    stats: [],
  };

  const attendanceRate =
    attendanceStats.totalRecords > 0
      ? Math.round(
          (attendanceStats.totalPresent / attendanceStats.totalRecords) * 100,
        )
      : 0;

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "2025";

  const roleConfig = {
    STUDENT: {
      gradient: "from-blue-500 to-indigo-600",
      badge:
        "bg-blue-100/80 dark:bg-blue-900/40 backdrop-blur-sm text-blue-700 dark:text-blue-300",
      icon: GraduationCap,
      title: "Student Dashboard",
    },
    COURSE_REP: {
      gradient: "from-emerald-500 to-teal-600",
      badge:
        "bg-emerald-100/80 dark:bg-emerald-900/40 backdrop-blur-sm text-emerald-700 dark:text-emerald-300",
      icon: Users,
      title: "Course Rep Dashboard",
    },
  };

  const config = roleConfig[user?.role] || roleConfig.STUDENT;
  const Icon = config.icon;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
          Manage your account and view your stats
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-5">
          {/* Profile Card */}
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
          >
            <Card className="relative overflow-hidden backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/40 dark:border-white/10 shadow-2xl">
              <div
                className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${config.gradient} opacity-10 rounded-full blur-3xl`}
              />
              <div
                className={`absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr ${config.gradient} opacity-5 rounded-full blur-3xl`}
              />
              <CardContent className="p-6 text-center relative z-10">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24 mx-auto ring-4 ring-white/60 dark:ring-white/20 shadow-xl">
                    <AvatarFallback
                      className={`text-3xl font-bold bg-gradient-to-br ${config.gradient} text-white`}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900 shadow-md" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                  {user?.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {user?.email}
                </p>
                <Badge
                  className={`mt-3 ${config.badge} border-0 font-semibold backdrop-blur-sm`}
                >
                  {isCourseRep ? "Course Rep" : "Student"}
                </Badge>

                <Separator className="my-4 bg-white/30 dark:bg-white/10" />

                <div className="grid grid-cols-3 gap-2">
                  <QuickStat
                    label="Courses"
                    value={classStats.totalCourses}
                    icon={GraduationCap}
                  />
                  <QuickStat
                    label="Sessions"
                    value={classStats.totalSessions}
                    icon={Clock}
                  />
                  <QuickStat
                    label="Joined"
                    value={memberSince}
                    icon={Calendar}
                  />
                </div>

                <Button
                  onClick={logout}
                  variant="outline"
                  className="mt-4 w-full border-red-300/50 dark:border-red-700/50 bg-white/40 dark:bg-red-950/20 backdrop-blur-sm text-red-600 dark:text-red-400 hover:bg-red-50/80 dark:hover:bg-red-900/30 hover:border-red-400 dark:hover:border-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          {isCourseRep && (
            <div className="grid grid-cols-2 gap-3">
              <StatsCard
                title="Students"
                value={classStats.totalStudents}
                icon={Users}
                gradient="from-blue-500 to-blue-600"
                delay={1}
              />
              <StatsCard
                title="Courses"
                value={classStats.totalCourses}
                icon={GraduationCap}
                gradient="from-emerald-500 to-emerald-600"
                delay={2}
              />
            </div>
          )}

          {isStudent && attendanceStats.totalRecords > 0 && (
            <div className="space-y-3">
              <StatsCard
                title="Attendance Rate"
                value={`${attendanceRate}%`}
                icon={TrendingUp}
                gradient="from-purple-500 to-purple-600"
                delay={1}
              />
              <StatsCard
                title="Classes Attended"
                value={`${attendanceStats.totalPresent}/${attendanceStats.totalRecords}`}
                icon={CheckCircle2}
                gradient="from-emerald-500 to-emerald-600"
                delay={2}
              />
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-5">
          {/* Personal Information */}
          <motion.div
            variants={fadeUp}
            custom={3}
            initial="hidden"
            animate="visible"
          >
            <Card className="backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/40 dark:border-white/10 shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    Personal Information
                  </CardTitle>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your account details
                </p>
              </CardHeader>
              <CardContent className="space-y-0">
                <InfoRow
                  icon={User}
                  label="Full Name"
                  value={user?.name}
                  loading={false}
                />
                <InfoRow
                  icon={Mail}
                  label="Email Address"
                  value={user?.email}
                  loading={false}
                />
                <InfoRow
                  icon={Shield}
                  label="Role"
                  value={isCourseRep ? "Course Rep" : "Student"}
                  loading={false}
                />
                <InfoRow
                  icon={Hash}
                  label="Student ID"
                  value={user?.studentId}
                  loading={false}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Class Information */}
          <motion.div
            variants={fadeUp}
            custom={4}
            initial="hidden"
            animate="visible"
          >
            <Card className="backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/40 dark:border-white/10 shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                    <Building className="w-4 h-4 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    Class Information
                  </CardTitle>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Your class space details
                </p>
              </CardHeader>
              <CardContent className="space-y-0">
                <InfoRow
                  icon={GraduationCap}
                  label="Class Name"
                  value={classSpace?.name || "—"}
                  loading={classLoading}
                />
                <InfoRow
                  icon={Building}
                  label="Department"
                  value={classSpace?.department || "—"}
                  loading={classLoading}
                />
                <InfoRow
                  icon={Award}
                  label="Level"
                  value={classSpace?.level ? `Level ${classSpace.level}` : "—"}
                  loading={classLoading}
                />
                <InfoRow
                  icon={Calendar}
                  label="Academic Year"
                  value={classSpace?.academicYear || "—"}
                  loading={classLoading}
                />
                {isCourseRep && classSpace?.classCode && (
                  <div className="mt-4 pt-2">
                    <div className="backdrop-blur-md bg-indigo-100/60 dark:bg-indigo-950/40 rounded-xl p-4 border border-indigo-200/50 dark:border-indigo-800/30">
                      <p className="text-xs text-indigo-700 dark:text-indigo-400 font-medium mb-1">
                        Class Code
                      </p>
                      <div className="flex items-center justify-between">
                        <code className="text-lg font-mono font-bold text-indigo-800 dark:text-indigo-300">
                          {classSpace.classCode}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(classSpace.classCode);
                            toast.success("Class code copied!");
                          }}
                          className="h-8 text-xs backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50"
                        >
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                        Share this code with students to join your class
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Course Rep Specific - Course Stats */}
          {isCourseRep && attendanceStats?.stats?.length > 0 && (
            <motion.div
              variants={fadeUp}
              custom={5}
              initial="hidden"
              animate="visible"
            >
              <Card className="backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/40 dark:border-white/10 shadow-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                      Course Analytics
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Attendance breakdown by course
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {attendanceStats.stats.map((course, i) => {
                    const percentage = parseFloat(course.percentage);
                    const color =
                      percentage >= 75
                        ? "emerald"
                        : percentage >= 50
                          ? "amber"
                          : "red";
                    const barColor = {
                      emerald: "bg-emerald-500",
                      amber: "bg-amber-500",
                      red: "bg-red-500",
                    };
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-800 dark:text-gray-300">
                            {course.courseName}
                          </span>
                          <span
                            className={`font-semibold ${
                              percentage >= 75
                                ? "text-emerald-600 dark:text-emerald-400"
                                : percentage >= 50
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {course.percentage}
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className={`h-2 ${barColor[color]}`}
                        />
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {course.present} present · {course.absent} absent
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Student Specific - Attendance Breakdown */}
          {isStudent && attendanceStats.stats?.length > 0 && (
            <motion.div
              variants={fadeUp}
              custom={5}
              initial="hidden"
              animate="visible"
            >
              <Card className="backdrop-blur-xl bg-white/40 dark:bg-gray-900/40 border border-white/40 dark:border-white/10 shadow-xl">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                      Course Progress
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Your attendance by course
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {attendanceStats.stats.map((course, i) => {
                    const percentage = parseFloat(course.percentage);
                    const color =
                      percentage >= 75
                        ? "emerald"
                        : percentage >= 50
                          ? "amber"
                          : "red";
                    const barColor = {
                      emerald: "bg-emerald-500",
                      amber: "bg-amber-500",
                      red: "bg-red-500",
                    };
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-800 dark:text-gray-300">
                            {course.courseName}
                          </span>
                          <span
                            className={`font-semibold ${
                              percentage >= 75
                                ? "text-emerald-600 dark:text-emerald-400"
                                : percentage >= 50
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {course.percentage}
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className={`h-2 ${barColor[color]}`}
                        />
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {course.present} present · {course.absent} absent
                        </p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
