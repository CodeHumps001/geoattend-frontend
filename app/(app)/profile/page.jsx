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
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        {loading ? (
          <Skeleton className="h-4 w-32 mt-1" />
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
      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group bg-white dark:bg-gray-900">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {value}
              </p>
            </div>
            <div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}
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
      <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-2">
        <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}

export default function ProfilePage() {
  const { user, isRep, isStudent } = useAuth();
  const { logout } = useAuthStore();
  const router = useRouter();

  // Fetch class space data for stats
  const { data: classResponse, isLoading: classLoading } = useQuery({
    queryKey: ["profile-class"],
    queryFn: async () => {
      if (isRep) {
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
      badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
      icon: GraduationCap,
      title: "Student Dashboard",
    },
    COURSE_REP: {
      gradient: "from-emerald-500 to-teal-600",
      badge:
        "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
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
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
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
            <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <div
                className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${config.gradient} opacity-5 rounded-full blur-3xl`}
              />
              <CardContent className="p-6 text-center">
                <div className="relative inline-block">
                  <Avatar className="w-24 h-24 mx-auto ring-4 ring-white dark:ring-gray-800 shadow-xl">
                    <AvatarFallback
                      className={`text-3xl font-bold bg-gradient-to-br ${config.gradient} text-white`}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-900" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                  {user?.name}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {user?.email}
                </p>
                <Badge
                  className={`mt-3 ${config.badge} border-0 font-semibold`}
                >
                  {isRep ? "Course Rep" : "Student"}
                </Badge>

                <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />

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
                  className="mt-4 w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Cards */}
          {isRep && (
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
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    Personal Information
                  </CardTitle>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                  value={isRep ? "Course Rep" : "Student"}
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
            <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    Class Information
                  </CardTitle>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                {isRep && classSpace?.classCode && (
                  <div className="mt-4 pt-2">
                    <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-xl p-4">
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                        Class Code
                      </p>
                      <div className="flex items-center justify-between">
                        <code className="text-lg font-mono font-bold text-indigo-700 dark:text-indigo-300">
                          {classSpace.classCode}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(classSpace.classCode);
                            toast.success("Class code copied!");
                          }}
                          className="h-8 text-xs"
                        >
                          Copy
                        </Button>
                      </div>
                      <p className="text-xs text-indigo-500 mt-2">
                        Share this code with students to join your class
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Course Rep Specific - Course Stats */}
          {isRep && attendanceStats?.stats?.length > 0 && (
            <motion.div
              variants={fadeUp}
              custom={5}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                      Course Analytics
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                          <span className="font-medium text-gray-700 dark:text-gray-300">
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
                        <p className="text-xs text-gray-500 dark:text-gray-400">
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
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                      Course Progress
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                          <span className="font-medium text-gray-700 dark:text-gray-300">
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
                        <p className="text-xs text-gray-500 dark:text-gray-400">
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
