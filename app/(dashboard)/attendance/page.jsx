"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
  Navigation,
  Clock,
  BookOpen,
  AlertCircle,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

function SessionCard({ session, onMark, marking, alreadyMarked }) {
  const now = new Date();
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  const isActive = now >= start && now <= end;
  const isFuture = now < start;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2 }}
    >
      <Card
        className={`border-2 transition-all ${
          isActive
            ? "border-blue-100 shadow-md shadow-blue-50"
            : isFuture
              ? "border-yellow-100 bg-yellow-50/30"
              : "border-gray-100 opacity-60"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                {isActive ? (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                    LIVE NOW
                  </Badge>
                ) : isFuture ? (
                  <Badge
                    variant="secondary"
                    className="bg-yellow-100 text-yellow-700 text-xs"
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    UPCOMING
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    ENDED
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base font-bold text-gray-900">
                {session.course?.name || "Unknown Course"}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {session.course?.code} · {session.course?.department}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {new Date(session.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                {" — "}
                {new Date(session.endTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{session.radiusMeters}m radius</span>
            </div>
          </div>

          {alreadyMarked ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-emerald-700 font-bold text-sm">
                  Attendance marked
                </p>
                <p className="text-emerald-600 text-xs">
                  You're recorded as present
                </p>
              </div>
            </div>
          ) : isActive ? (
            <Button
              onClick={() => onMark(session.id)}
              disabled={marking === session.id}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl"
            >
              {marking === session.id ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Getting your location...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Mark My Attendance
                </span>
              )}
            </Button>
          ) : isFuture ? (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 rounded-xl px-4 py-3">
              <Clock className="w-5 h-5 text-yellow-600 flex-shrink-0" />
              <p className="text-yellow-700 font-medium text-sm">
                Session starts at{" "}
                {new Date(session.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <XCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <p className="text-gray-500 font-medium text-sm">
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
  const queryClient = useQueryClient();
  const [marking, setMarking] = useState(null);
  const [markedSessions, setMarkedSessions] = useState([]);

  // Get student ID from user object
  const studentId = user?.student?.id;
  const isValidStudentId = studentId && !isNaN(Number(studentId));

  // Get enrolled courses for this student
  const { data: studentDetail, isLoading: studentLoading } = useQuery({
    queryKey: ["student-detail", studentId],
    queryFn: async () => {
      if (!isValidStudentId) return null;
      const res = await api.get(`/api/v1/students/${studentId}`);
      return res.data.data.student;
    },
    enabled: isValidStudentId,
  });

  // Get enrolled course IDs
  const enrolledCourseIds =
    studentDetail?.enrollments?.map((e) => e.courseId) || [];

  // ✅ ONLY call getAllSessions - NOT the session/:id endpoint
  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useQuery({
    queryKey: ["all-sessions"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/v1/attendance/session/all");
        return res.data.data.sessions || [];
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        return [];
      }
    },
    refetchInterval: 30000,
  });

  // Filter sessions to only those in enrolled courses
  const enrolledSessions = (sessionsData || []).filter((session) =>
    enrolledCourseIds.includes(session.courseId),
  );

  const markAttendance = async (sessionId) => {
    if (!isValidStudentId) {
      toast.error("Student profile not found. Please contact admin.");
      return;
    }

    setMarking(sessionId);

    try {
      // Get GPS location from browser
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error("Geolocation is not supported by your browser"));
          return;
        }
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;

      // Mark attendance
      const res = await api.post("/api/v1/attendance/mark", {
        studentId: Number(studentId),
        sessionId: Number(sessionId),
        latitude,
        longitude,
      });

      const result = res.data.data;

      // Add to marked sessions locally
      setMarkedSessions((prev) => [...prev, sessionId]);

      if (result.status === "PRESENT") {
        toast.success(
          `✅ Present! You are ${result.distanceFromClass} from class.`,
        );
      } else {
        toast.error(
          `❌ Absent — You are ${result.distanceFromClass} from class. Allowed radius is ${result.allowedRadius}.`,
        );
      }

      // Refresh data
      queryClient.invalidateQueries(["all-sessions"]);
    } catch (err) {
      if (err.code === 1 || err.code === "PERMISSION_DENIED") {
        toast.error(
          "Location access denied. Please allow location access and try again.",
        );
      } else if (err.code === 2 || err.code === "POSITION_UNAVAILABLE") {
        toast.error("Location unavailable. Please try again.");
      } else if (err.code === 3 || err.code === "TIMEOUT") {
        toast.error("Location request timed out. Please try again.");
      } else {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to mark attendance";
        toast.error(message);
      }
    } finally {
      setMarking(null);
    }
  };

  const isLoading = studentLoading || sessionsLoading;
  const hasEnrolledCourses = enrolledCourseIds.length > 0;

  if (!isValidStudentId && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Student Profile Not Found
            </h2>
            <p className="text-gray-500">
              Please contact your administrator to set up your student profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 sticky top-0 z-40">
        <h1 className="text-2xl font-black text-gray-900">Mark Attendance</h1>
        <p className="text-gray-400 text-sm">
          {hasEnrolledCourses
            ? "Active sessions for your enrolled courses"
            : "You are not enrolled in any courses yet"}
        </p>
      </div>

      <div className="px-5 py-5 max-w-lg mx-auto space-y-5">
        {/* GPS Info Banner */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3"
        >
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
            <Wifi className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <p className="text-blue-800 font-bold text-sm">GPS Required</p>
            <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
              Your location will be checked when you mark attendance. You must
              be within the allowed radius of your classroom.
            </p>
          </div>
        </motion.div>

        {/* Sessions List */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-5">
                  <div className="h-4 bg-gray-100 rounded w-20 mb-3" />
                  <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-10 bg-gray-100 rounded-xl mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !hasEnrolledCourses ? (
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-semibold text-lg">
              No enrolled courses
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Ask your admin to enroll you in courses
            </p>
          </motion.div>
        ) : enrolledSessions.length === 0 ? (
          <motion.div
            variants={fadeUp}
            custom={1}
            initial="hidden"
            animate="visible"
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-semibold text-lg">
              No active sessions
            </p>
            <p className="text-gray-400 text-sm mt-1">
              When a lecturer starts a session for your courses, it will appear
              here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {enrolledSessions.map((session, i) => (
              <SessionCard
                key={session.id}
                session={session}
                onMark={markAttendance}
                marking={marking}
                alreadyMarked={markedSessions.includes(session.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
