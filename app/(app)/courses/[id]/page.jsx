// app/(app)/courses/[id]/page.jsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Users,
  PlayCircle,
  Calendar,
  Clock,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05 },
  }),
};

function StatBox({ label, value, icon: Icon }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
        <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
      </div>
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function SessionItem({ session }) {
  const router = useRouter();
  const { isStudent, isAssistantRep, isCourseRep } = useAuth();
  const presentCount =
    session.attendance?.filter((a) => a.status === "PRESENT").length || 0;
  const totalCount = session.attendance?.length || 0;
  const attendanceRate = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

  return (
    <>
      {isAssistantRep || isCourseRep ? (
        <div
          onClick={() => router.push(`/sessions/${session.id}`)}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date(session.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(session.startTime).toLocaleTimeString()} -{" "}
                {new Date(session.endTime).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900 dark:text-white">
              {presentCount}/{totalCount}
            </p>
            <div className="w-20 mt-1">
              <Progress value={attendanceRate} className="h-1" />
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => toast.error("You're not authorized for ths page")}
          className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {new Date(session.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(session.startTime).toLocaleTimeString()} -{" "}
                {new Date(session.endTime).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-gray-900 dark:text-white">
              {presentCount}/{totalCount}
            </p>
            <div className="w-20 mt-1">
              <Progress value={attendanceRate} className="h-1" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isCourseRep, isAssistantRep, isStudent } = useAuth();

  // Fetch course details - matches backend response structure
  const { data: response, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/courses/${id}`);
      return res.data.data; // { course: {...} }
    },
    enabled: !!id,
  });

  const course = response?.course;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Course not found</p>
      </div>
    );
  }

  // Safely access arrays with fallbacks
  const sessions = course.sessions || [];
  const sessionCount = sessions.length;

  // Get student count from classSpace if available
  const studentCount = course.classSpace?.students?.length || 0;

  // Calculate attendance stats
  let presentCount = 0;
  let totalAttendance = 0;

  sessions.forEach((session) => {
    const attendance = session.attendance || [];
    totalAttendance += attendance.length;
    presentCount += attendance.filter((a) => a.status === "PRESENT").length;
  });

  const avgAttendance =
    totalAttendance > 0
      ? Math.round((presentCount / totalAttendance) * 100)
      : 0;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
              {course.code}
            </Badge>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {course.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {course.lecturerName || "No lecturer assigned"}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="w-4 h-4 mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Students" value={studentCount} icon={Users} />
        <StatBox label="Sessions" value={sessionCount} icon={PlayCircle} />
        <StatBox
          label="Avg Attendance"
          value={`${avgAttendance}%`}
          icon={Calendar}
        />
        <StatBox label="Total Records" value={totalAttendance} icon={Clock} />
      </div>

      {/* Sessions Section */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Sessions
          </h2>
          {isStudent ? (
            ""
          ) : (
            <Button size="sm" onClick={() => router.push("/sessions")}>
              <PlayCircle className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          )}
        </div>

        {sessions.length === 0 ? (
          <Card className="text-center py-8">
            <CardContent>
              <PlayCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No sessions yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start your first session to track attendance
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {sessions.map((session, i) => (
              <SessionItem key={session.id} session={session} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
