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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

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

  const pctColor =
    pct === null
      ? "text-gray-400"
      : pct >= 75
        ? "text-emerald-600"
        : pct >= 50
          ? "text-orange-500"
          : "text-red-500";

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-0"
    >
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xs">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">
          {user?.name}
        </p>
        <p className="text-xs text-gray-400">
          {student?.studentCode} · Level {student?.level}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`font-black text-sm ${pctColor}`}>
          {pct !== null ? `${pct.toFixed(1)}%` : "—"}
        </p>
        <p className="text-xs text-gray-400">attendance</p>
      </div>
    </motion.div>
  );
}

function SessionRow({ session, index }) {
  const router = useRouter();
  const now = new Date();
  const isActive = now < new Date(session.endTime);
  const presentCount =
    session.attendance?.filter((a) => a.status === "PRESENT").length || 0;
  const totalCount = session.attendance?.length || 0;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ x: 3 }}
      onClick={() => router.push(`/sessions/${session.id}`)}
      className="flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-0 cursor-pointer"
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isActive ? "bg-emerald-50" : "bg-gray-50"
        }`}
      >
        <PlayCircle
          className={`w-5 h-5 ${
            isActive ? "text-emerald-600" : "text-gray-400"
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900 text-sm">
            {new Date(session.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
          {isActive && (
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs font-bold">
              LIVE
            </Badge>
          )}
        </div>
        <p className="text-xs text-gray-400">
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
      <div className="text-right flex-shrink-0">
        <p className="font-black text-sm text-gray-900">
          {presentCount}/{totalCount}
        </p>
        <p className="text-xs text-gray-400">present</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
    </motion.div>
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

  const totalSessions = sessions.length;
  const avgAttendance =
    enrollments.length > 0 && totalSessions > 0
      ? Math.round(
          (sessions.reduce((acc, s) => {
            const present =
              s.attendance?.filter((a) => a.status === "PRESENT").length || 0;
            return acc + present;
          }, 0) /
            (totalSessions * enrollments.length)) *
            100,
        )
      : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-5">
        <BookOpen className="w-12 h-12 text-gray-300 mb-4" />
        <p className="text-gray-500 font-semibold">Course not found</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 sticky top-0 z-40">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-0 font-bold">
                {course.code}
              </Badge>
            </div>
            <h1 className="text-xl font-black text-gray-900 leading-tight">
              {course.name}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {course.department} · {course.semester}
            </p>
          </div>
          {(isLecturer || isAdmin) && (
            <Button
              onClick={() => router.push("/sessions")}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex-shrink-0"
            >
              <PlayCircle className="w-4 h-4 mr-1.5" />
              Start Session
            </Button>
          )}
        </div>
      </div>

      <div className="px-5 py-5 max-w-lg mx-auto space-y-5">
        {/* Lecturer info */}
        {course.lecturer && (
          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
          >
            <Card className="border border-gray-100 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-11 h-11">
                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-bold text-sm">
                      {course.lecturer.user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "L"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">
                      {course.lecturer.user?.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {course.lecturer.user?.email}
                    </p>
                    <Badge className="mt-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs">
                      Lecturer
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Students",
              value: enrollments.length,
              icon: Users,
              color: "blue",
              delay: 1,
            },
            {
              label: "Sessions",
              value: totalSessions,
              icon: PlayCircle,
              color: "emerald",
              delay: 2,
            },
            {
              label: "Avg Attendance",
              value: avgAttendance !== null ? `${avgAttendance}%` : "—",
              icon: BarChart3,
              color: "violet",
              delay: 3,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            const colorMap = {
              blue: "bg-blue-50 text-blue-600",
              emerald: "bg-emerald-50 text-emerald-600",
              violet: "bg-violet-50 text-violet-600",
            };
            return (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={stat.delay}
                initial="hidden"
                animate="visible"
              >
                <Card className="border border-gray-100 shadow-sm text-center">
                  <CardContent className="p-4">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2 ${colorMap[stat.color]}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xl font-black text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="visible"
        >
          <Tabs defaultValue="students">
            <TabsList className="w-full bg-gray-100 rounded-xl p-1 h-11">
              <TabsTrigger
                value="students"
                className="flex-1 rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Students ({enrollments.length})
              </TabsTrigger>
              <TabsTrigger
                value="sessions"
                className="flex-1 rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Sessions ({sessions.length})
              </TabsTrigger>
            </TabsList>

            {/* Students Tab */}
            <TabsContent value="students" className="mt-4">
              <Card className="border border-gray-100 shadow-sm">
                <CardContent className="px-5 py-0">
                  {enrollments.length === 0 ? (
                    <div className="py-12 text-center">
                      <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-semibold">
                        No students enrolled
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Ask an admin to enroll students
                      </p>
                    </div>
                  ) : (
                    enrollments.map((enrollment, i) => (
                      <StudentRow
                        key={enrollment.id}
                        enrollment={enrollment}
                        courseId={Number(id)}
                        index={i}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value="sessions" className="mt-4">
              <Card className="border border-gray-100 shadow-sm">
                <CardContent className="px-5 py-0">
                  {sessions.length === 0 ? (
                    <div className="py-12 text-center">
                      <PlayCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-semibold">
                        No sessions yet
                      </p>
                      {(isLecturer || isAdmin) && (
                        <Button
                          onClick={() => router.push("/sessions")}
                          size="sm"
                          className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
                        >
                          Start First Session
                        </Button>
                      )}
                    </div>
                  ) : (
                    sessions.map((session, i) => (
                      <SessionRow
                        key={session.id}
                        session={session}
                        index={i}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
