"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Users,
  PlayCircle,
  Calendar,
  MapPin,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Plus,
  Loader2,
  X,
  TrendingUp,
  BarChart3,
  Award,
  Star,
  UserCheck,
  FileText,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Enhanced Student Row Component
function StudentRow({ enrollment, courseId, index }) {
  const student = enrollment.student;
  const user = student?.user;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "S";

  const { data: pctData } = useQuery({
    queryKey: ["attendance-pct", student?.id, courseId],
    queryFn: async () => {
      const res = await api.get(
        `/api/v1/students/${student.id}/attendance/${courseId}`,
      );
      return res.data.data;
    },
    enabled: !!student?.id && !!courseId,
  });

  const pct = pctData?.percentage ? parseFloat(pctData.percentage) : null;
  const pctNumber = pct || 0;

  const getStatusBadge = () => {
    if (pct === null)
      return {
        text: "No Data",
        color: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
      };
    if (pct >= 75)
      return {
        text: "Good Standing",
        color:
          "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
      };
    if (pct >= 50)
      return {
        text: "At Risk",
        color:
          "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
      };
    return {
      text: "Critical",
      color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    };
  };

  const status = getStatusBadge();

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 px-4 rounded-xl transition-colors"
    >
      <div className="flex items-center gap-4">
        <Avatar className="w-10 h-10 flex-shrink-0 ring-2 ring-offset-2 ring-indigo-100 dark:ring-indigo-900">
          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {user?.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {student?.studentCode}
            </p>
            <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Level {student?.level}
            </p>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-3">
          <div className="w-24">
            <Progress value={pctNumber} className="h-2" />
          </div>
          <p
            className={`font-bold text-sm ${
              pctNumber >= 75
                ? "text-emerald-600 dark:text-emerald-400"
                : pctNumber >= 50
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-red-600 dark:text-red-400"
            }`}
          >
            {pct !== null ? `${pct.toFixed(1)}%` : "—"}
          </p>
          <Badge className={status.color}>{status.text}</Badge>
        </div>
      </div>
    </motion.div>
  );
}

// Enhanced Session Row Component
function SessionRow({ session, index }) {
  const router = useRouter();
  const now = new Date();
  const isActive = now < new Date(session.endTime);
  const isLive =
    now >= new Date(session.startTime) && now <= new Date(session.endTime);
  const presentCount =
    session.attendance?.filter((a) => a.status === "PRESENT").length || 0;
  const totalCount = session.attendance?.length || 0;
  const attendanceRate = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ x: 4 }}
      onClick={() => router.push(`/sessions/${session.id}`)}
      className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 px-4 rounded-xl transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isLive
              ? "bg-emerald-100 dark:bg-emerald-900/30"
              : isActive
                ? "bg-blue-100 dark:bg-blue-900/30"
                : "bg-gray-100 dark:bg-gray-800"
          }`}
        >
          <PlayCircle
            className={`w-6 h-6 ${
              isLive
                ? "text-emerald-600 dark:text-emerald-400"
                : isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-400 dark:text-gray-600"
            }`}
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-gray-900 dark:text-white">
              {new Date(session.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            {isLive && (
              <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0 text-xs font-bold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                LIVE NOW
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            {new Date(session.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            —{" "}
            {new Date(session.endTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-3">
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-lg">
              {presentCount}/{totalCount}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">present</p>
          </div>
          <div className="w-20">
            <Progress value={attendanceRate} className="h-2" />
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
        </div>
      </div>
    </motion.div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon: Icon, gradient, delay, subtitle }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group bg-white dark:bg-gray-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {value}
              </p>
              {subtitle && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {subtitle}
                </p>
              )}
            </div>
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Info Row Component
function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </div>
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isStudent, isLecturer, isAdmin } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/courses/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  const course = data?.course;
  const enrollments = course?.enrollments || [];
  const sessions = course?.sessions || [];

  const totalStudents = enrollments.length;
  const totalSessions = sessions.length;

  // Calculate average attendance
  let avgAttendance = null;
  if (totalStudents > 0 && totalSessions > 0) {
    let totalPresent = 0;
    let totalPossible = 0;
    sessions.forEach((session) => {
      const present =
        session.attendance?.filter((a) => a.status === "PRESENT").length || 0;
      totalPresent += present;
      totalPossible += totalStudents;
    });
    avgAttendance =
      totalPossible > 0
        ? Math.round((totalPresent / totalPossible) * 100)
        : null;
  }

  // Calculate overall attendance rate
  const overallAttendance = avgAttendance !== null ? `${avgAttendance}%` : "—";

  // Calculate completed sessions
  const completedSessions = sessions.filter(
    (s) => new Date(s.endTime) < new Date(),
  ).length;
  const upcomingSessions = sessions.filter(
    (s) => new Date(s.startTime) > new Date(),
  ).length;
  const activeSessions = sessions.filter((s) => {
    const now = new Date();
    return now >= new Date(s.startTime) && now <= new Date(s.endTime);
  }).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center px-5">
        <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">
          Course not found
        </p>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mt-4"
        >
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 pt-8 pb-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Courses</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 font-bold">
                  {course.code}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                >
                  {course.semester}
                </Badge>
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                {course.name}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {course.department}
              </p>
            </div>
            {(isLecturer || isAdmin) && (
              <Button
                onClick={() => router.push("/sessions")}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200 dark:shadow-indigo-900/30"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Start New Session
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Information Card */}
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    Course Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoRow
                    icon={BookOpen}
                    label="Course Code"
                    value={course.code}
                  />
                  <InfoRow
                    icon={GraduationCap}
                    label="Department"
                    value={course.department}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Semester"
                    value={course.semester}
                  />
                  <Separator className="bg-gray-200 dark:bg-gray-700" />
                  {course.lecturer && (
                    <div className="flex items-center gap-3 pt-2">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold">
                          {course.lecturer.user?.name?.charAt(0) || "L"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          Course Lecturer
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {course.lecturer.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {course.lecturer.user?.email}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats Card */}
            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Course Progress
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {completedSessions}/{totalSessions} sessions
                    </span>
                  </div>
                  <Progress
                    value={
                      totalSessions > 0
                        ? (completedSessions / totalSessions) * 100
                        : 0
                    }
                    className="h-2"
                  />
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Active Sessions
                      </p>
                      <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                        {activeSessions}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Upcoming
                      </p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {upcomingSessions}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Stats and Tabs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatsCard
                title="Enrolled Students"
                value={totalStudents}
                icon={Users}
                gradient="from-blue-500 to-blue-600"
                delay={2}
                subtitle="active enrollments"
              />
              <StatsCard
                title="Total Sessions"
                value={totalSessions}
                icon={PlayCircle}
                gradient="from-emerald-500 to-emerald-600"
                delay={3}
                subtitle={`${completedSessions} completed`}
              />
              <StatsCard
                title="Avg Attendance"
                value={overallAttendance}
                icon={TrendingUp}
                gradient="from-purple-500 to-purple-600"
                delay={4}
                subtitle="overall rate"
              />
            </div>

            {/* Tabs */}
            <motion.div
              variants={fadeUp}
              custom={5}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
                <CardHeader className="pb-3">
                  <Tabs defaultValue="students" className="w-full">
                    <TabsList className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl p-1 h-12">
                      <TabsTrigger
                        value="students"
                        className="flex-1 rounded-lg font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm text-sm"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Students ({totalStudents})
                      </TabsTrigger>
                      <TabsTrigger
                        value="sessions"
                        className="flex-1 rounded-lg font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm text-sm"
                      >
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Sessions ({totalSessions})
                      </TabsTrigger>
                    </TabsList>

                    {/* Students Tab */}
                    <TabsContent value="students" className="mt-4">
                      {enrollments.length === 0 ? (
                        <div className="py-16 text-center">
                          <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">
                            No students enrolled
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                            {isAdmin
                              ? "Enroll students to get started"
                              : "Ask an admin to enroll students"}
                          </p>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                          {enrollments.map((enrollment, i) => (
                            <StudentRow
                              key={enrollment.id}
                              enrollment={enrollment}
                              courseId={Number(id)}
                              index={i}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    {/* Sessions Tab */}
                    <TabsContent value="sessions" className="mt-4">
                      {sessions.length === 0 ? (
                        <div className="py-16 text-center">
                          <PlayCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">
                            No sessions yet
                          </p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                            {isLecturer || isAdmin
                              ? "Start your first session"
                              : "Sessions will appear here"}
                          </p>
                          {(isLecturer || isAdmin) && (
                            <Button
                              onClick={() => router.push("/sessions")}
                              className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Start First Session
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                          {sessions.map((session, i) => (
                            <SessionRow
                              key={session.id}
                              session={session}
                              index={i}
                            />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardHeader>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
