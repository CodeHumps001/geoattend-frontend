// app/(app)/attendance/page.jsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
  Navigation,
  Clock,
  Calendar,
  Wifi,
  AlertCircle,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import api from "@/lib/axios";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08 },
  }),
};

function SessionCard({ session, onMark, marking, attendanceStatus }) {
  const isActive = session.isOpen;
  const hasAttended = attendanceStatus !== null;
  const isPresent = attendanceStatus === "PRESENT";

  return (
    <motion.div variants={fadeUp} whileHover={{ y: -2 }}>
      <Card
        className={`border-2 transition-all ${
          isActive
            ? "border-indigo-200 dark:border-indigo-800 shadow-lg shadow-indigo-100/50 dark:shadow-indigo-950/20"
            : "border-gray-200 dark:border-gray-800 opacity-75"
        }`}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isActive && (
                  <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                    LIVE NOW
                  </Badge>
                )}
                {!isActive && <Badge variant="secondary">Ended</Badge>}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                {session.course?.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {session.course?.code}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(session.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(session.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{session.radiusMeters}m check-in radius</span>
            </div>
          </div>

          {hasAttended ? (
            <div
              className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                isPresent
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
                  : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isPresent ? "bg-emerald-500" : "bg-red-500"
                }`}
              >
                {isPresent ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <XCircle className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p
                  className={`font-bold text-sm ${
                    isPresent
                      ? "text-emerald-700 dark:text-emerald-400"
                      : "text-red-700 dark:text-red-400"
                  }`}
                >
                  {isPresent ? "You're Present!" : "You're Absent"}
                </p>
                <p
                  className={`text-xs ${
                    isPresent
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {isPresent
                    ? "Attendance recorded successfully"
                    : "You were outside the allowed radius"}
                </p>
              </div>
            </div>
          ) : isActive ? (
            <Button
              onClick={() => onMark(session.id)}
              disabled={marking === session.id}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 rounded-xl"
            >
              {marking === session.id ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Getting your location...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Mark My Attendance
                  <Navigation className="w-4 h-4" />
                </span>
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
              <XCircle className="w-5 h-5 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Session has ended
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AttendancePage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [marking, setMarking] = useState(null);
  const [locationStatus, setLocationStatus] = useState(null);

  const studentId = user?.student?.id;

  // 1. Fetch student's profile with enrollments
  const { data: student, isLoading: studentLoading } = useQuery({
    queryKey: ["student-profile", studentId],
    queryFn: async () => {
      const res = await api.get(`/api/v1/students/${studentId}`);
      console.log("Student profile:", res.data.data);
      return res.data.data;
    },
    enabled: !!studentId,
  });

  // 2. Get enrolled course IDs
  const enrolledCourseIds = student?.enrollments?.map((e) => e.courseId) || [];

  // 3. Fetch ALL sessions
  const { data: sessionsResponse, isLoading: sessionsLoading } = useQuery({
    queryKey: ["all-sessions"],
    queryFn: async () => {
      const res = await api.get("/api/v1/sessions");
      console.log("Sessions response:", res.data.data);
      return res.data.data; // { sessions: [], count: number }
    },
    enabled: !!user,
    refetchInterval: 10000,
  });

  // 4. Filter sessions for enrolled courses ONLY
  const allSessions = sessionsResponse?.sessions || [];
  const mySessions = allSessions.filter((session) =>
    enrolledCourseIds.includes(session.courseId),
  );

  console.log("Enrolled course IDs:", enrolledCourseIds);
  console.log("All sessions:", allSessions);
  console.log("My sessions:", mySessions);

  // 5. Fetch my attendance history (using the /me endpoint)
  const { data: myAttendance, refetch: refetchAttendance } = useQuery({
    queryKey: ["my-attendance", studentId],
    queryFn: async () => {
      const res = await api.get("/api/v1/attendance/me");
      console.log("My attendance response:", res.data.data);
      return res.data.data;
    },
    enabled: !!studentId,
  });

  // Create a map of sessionId -> status from attendance records
  const attendanceMap = new Map();
  myAttendance?.attendance?.forEach((record) => {
    attendanceMap.set(record.sessionId, record.status);
  });

  // Separate active vs ended sessions
  const activeSessions = mySessions.filter((s) => s.isOpen === true);
  const endedSessions = mySessions.filter((s) => s.isOpen === false);

  const totalSessions = mySessions.length;
  const totalPresent = myAttendance?.totalPresent || 0;
  const attendanceRate =
    totalSessions > 0 ? (totalPresent / totalSessions) * 100 : 0;

  const markAttendance = async (sessionId) => {
    setMarking(sessionId);
    setLocationStatus(null);

    try {
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation not supported"));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude, accuracy } = position.coords;
      setLocationStatus({ latitude, longitude, accuracy });

      console.log("Marking attendance for session:", sessionId);
      console.log("Location:", { latitude, longitude });

      const res = await api.post("/api/v1/attendance/mark", {
        sessionId,
        latitude,
        longitude,
      });

      console.log("Mark attendance response:", res.data);
      const result = res.data.data;

      await refetchAttendance();
      queryClient.invalidateQueries(["all-sessions"]);

      if (result.status === "PRESENT") {
        toast.success(`✅ Present! ${result.distance} from class.`);
      } else {
        toast.error(
          `❌ Absent — ${result.distance} away. Allowed radius is ${result.allowedRadius}.`,
        );
      }
    } catch (err) {
      console.error("Mark attendance error:", err);
      if (err.code === 1 || err.code === "PERMISSION_DENIED") {
        toast.error("Location access denied. Please enable location services.");
      } else if (err.code === 2 || err.code === "POSITION_UNAVAILABLE") {
        toast.error("Location unavailable. Please try again.");
      } else if (err.code === 3 || err.code === "TIMEOUT") {
        toast.error("Location request timed out. Please try again.");
      } else {
        toast.error(err.response?.data?.message || "Failed to mark attendance");
      }
    } finally {
      setMarking(null);
      setTimeout(() => setLocationStatus(null), 3000);
    }
  };

  const isLoading = studentLoading || sessionsLoading;

  if (!studentId && !isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Student Profile Not Found
            </h2>
            <p className="text-gray-500">
              Please contact your course rep to set up your profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Mark Attendance
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {activeSessions.length} active session
          {activeSessions.length !== 1 ? "s" : ""} available
        </p>
      </div>

      {/* Stats Overview */}
      {totalSessions > 0 && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your Attendance Rate
                </p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.round(attendanceRate)}%
                </p>
              </div>
              <div className="w-24">
                <Progress value={attendanceRate} className="h-2" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Present
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {totalPresent}/{totalSessions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* GPS Status */}
      {locationStatus && (
        <Card className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
              <Wifi className="w-4 h-4" />
              <span>
                Location captured! Accuracy:{" "}
                {Math.round(locationStatus.accuracy)}m
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Live Sessions
          </h2>
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onMark={markAttendance}
                marking={marking}
                attendanceStatus={attendanceMap.get(session.id) || null}
              />
            ))}
          </div>
        </div>
      )}

      {/* Ended Sessions */}
      {endedSessions.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            Past Sessions
          </h2>
          <div className="space-y-4">
            {endedSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onMark={markAttendance}
                marking={marking}
                attendanceStatus={attendanceMap.get(session.id) || null}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && mySessions.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No sessions available
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              Your course rep hasn't started any sessions yet
            </p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      )}
    </div>
  );
}
