"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  const end = new Date(session.endTime);
  const isActive = now < end;

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
            : "border-gray-100 opacity-60"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {isActive ? (
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 text-xs font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                    LIVE
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Ended
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
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
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
  const [marking, setMarking] = useState(null);
  const [markedSessions, setMarkedSessions] = useState([]);
  const [lastResult, setLastResult] = useState(null);

  // Get all sessions
  const { data: sessionsData, isLoading } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await api.get("/api/v1/attendance/session/all");
      return res.data.data;
    },
    refetchInterval: 30000, // refresh every 30 seconds
  });

  const sessions = sessionsData?.sessions || [];

  const markAttendance = async (sessionId) => {
    setMarking(sessionId);
    setLastResult(null);

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

      // Get student id
      const meRes = await api.get("/api/v1/auth/me");
      const studentId = meRes.data.data.user?.student?.id;

      if (!studentId) {
        toast.error("Student profile not found. Contact your admin.");
        return;
      }

      const res = await api.post("/api/v1/attendance/mark", {
        studentId,
        sessionId,
        latitude,
        longitude,
      });

      const result = res.data.data;
      setLastResult(result);
      setMarkedSessions((prev) => [...prev, sessionId]);

      if (result.attendance?.status === "PRESENT") {
        toast.success(
          `✅ Present! You are ${result.distanceFromClass} from class.`,
        );
      } else {
        toast.error(
          `❌ Absent — You are ${result.distanceFromClass} from class.`,
        );
      }
    } catch (err) {
      if (err.code === 1) {
        toast.error(
          "Location access denied. Please allow location access and try again.",
        );
      } else if (err.code === 2) {
        toast.error("Location unavailable. Please try again.");
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 sticky top-0 z-40">
        <h1 className="text-2xl font-black text-gray-900">Mark Attendance</h1>
        <p className="text-gray-400 text-sm">
          Active sessions you can mark in to
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

        {/* Last Result */}
        <AnimatePresence>
          {lastResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-2xl p-5 border-2 ${
                lastResult.attendance?.status === "PRESENT"
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {lastResult.attendance?.status === "PRESENT" ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                ) : (
                  <XCircle className="w-8 h-8 text-red-500" />
                )}
                <div>
                  <p
                    className={`font-black text-lg ${
                      lastResult.attendance?.status === "PRESENT"
                        ? "text-emerald-700"
                        : "text-red-600"
                    }`}
                  >
                    {lastResult.attendance?.status === "PRESENT"
                      ? "You're Present!"
                      : "Marked Absent"}
                  </p>
                  <p
                    className={`text-sm ${
                      lastResult.attendance?.status === "PRESENT"
                        ? "text-emerald-600"
                        : "text-red-500"
                    }`}
                  >
                    {lastResult.message}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`rounded-xl p-3 ${
                    lastResult.attendance?.status === "PRESENT"
                      ? "bg-emerald-100"
                      : "bg-red-100"
                  }`}
                >
                  <p className="text-xs font-medium text-gray-600">
                    Distance from class
                  </p>
                  <p className="font-bold text-gray-900">
                    {lastResult.distanceFromClass}
                  </p>
                </div>
                <div
                  className={`rounded-xl p-3 ${
                    lastResult.attendance?.status === "PRESENT"
                      ? "bg-emerald-100"
                      : "bg-red-100"
                  }`}
                >
                  <p className="text-xs font-medium text-gray-600">
                    Allowed radius
                  </p>
                  <p className="font-bold text-gray-900">
                    {lastResult.allowedRadius}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
        ) : sessions.length === 0 ? (
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
              No active sessions
            </p>
            <p className="text-gray-400 text-sm mt-1">
              When a lecturer starts a session for your course it will appear
              here
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session, i) => (
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
