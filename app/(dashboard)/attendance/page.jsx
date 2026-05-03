"use client";

import { useState } from "react";
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
  Calendar,
  Users,
  Award,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Smartphone,
  PlayCircle,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Enhanced Attendance Card Component
function AttendanceCard({ session, onMark, marking, alreadyMarked }) {
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className={`relative overflow-hidden transition-all duration-300 h-full ${
          isActive
            ? "border-2 border-blue-200 dark:border-blue-800 shadow-xl shadow-blue-100/50 dark:shadow-blue-900/30 bg-gradient-to-br from-white dark:from-gray-900 to-blue-50/30 dark:to-blue-950/20"
            : isFuture
              ? "border border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-white dark:from-gray-900 to-yellow-50/20 dark:to-yellow-950/10"
              : "border border-gray-200 dark:border-gray-700 opacity-75"
        }`}
      >
        {/* Animated Live Badge */}
        {isActive && (
          <div className="absolute top-0 right-0">
            <div className="absolute -top-1 -right-1 w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full blur-xl opacity-60 animate-pulse" />
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-lg z-10">
              <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse" />
              LIVE NOW
            </Badge>
          </div>
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between pr-16">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 font-mono"
                >
                  {session.course?.code}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  {session.course?.department}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                {session.course?.name || "Unknown Course"}
              </CardTitle>
              <CardDescription className="flex items-center gap-3 text-xs flex-wrap text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(session.startTime).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(session.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" - "}
                  {new Date(session.endTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{session.radiusMeters}m check-in radius</span>
            </div>
            {!alreadyMarked && isFuture && (
              <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500">
                <Clock className="w-3 h-3" />
                <span>Starts soon</span>
              </div>
            )}
          </div>

          {alreadyMarked ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl px-4 py-3"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                  Attendance Marked!
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 text-xs">
                  You're recorded as present
                </p>
              </div>
            </motion.div>
          ) : isActive ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onMark(session.id)}
              disabled={marking === session.id}
              className="relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all duration-300 overflow-hidden group"
            >
              {marking === session.id ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Getting your location...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  Mark My Attendance
                  <Navigation className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </motion.button>
          ) : isFuture ? (
            <div className="flex items-center gap-3 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-3">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-500" />
              <p className="text-yellow-700 dark:text-yellow-400 font-medium text-sm">
                Session starts at{" "}
                {new Date(session.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3">
              <XCircle className="w-5 h-5 text-gray-400 dark:text-gray-500" />
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                Session has ended
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Statistics Card Component
function StatsCard({ title, value, icon: Icon, gradient, delay, trend }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="relative overflow-hidden border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group bg-white dark:bg-gray-900">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
              {trend && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {trend}
                </p>
              )}
            </div>
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// GPS Test Modal
function GPSTestModal({ isOpen, onClose, onUseLocation }) {
  const [location, setLocation] = useState(null);
  const [testing, setTesting] = useState(false);

  const testGPS = async () => {
    setTesting(true);
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

      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });

      toast.success("GPS location captured!");
    } catch (err) {
      toast.error(`GPS error: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            Test GPS Location
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Check your current location before marking attendance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Button onClick={testGPS} disabled={testing} className="w-full">
            {testing ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Navigation className="w-4 h-4 mr-2" />
            )}
            {testing ? "Getting Location..." : "Get Current Location"}
          </Button>

          {location && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Location Details:
              </p>
              <div className="space-y-1 text-xs font-mono text-gray-600 dark:text-gray-400">
                <p>Latitude: {location.lat.toFixed(6)}</p>
                <p>Longitude: {location.lng.toFixed(6)}</p>
                <p>Accuracy: {Math.round(location.accuracy)} meters</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  onUseLocation(location);
                  onClose();
                  toast.success("Location set for attendance!");
                }}
              >
                Use This Location
              </Button>
            </div>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Make sure GPS is enabled and you're in a well-lit area for better
            accuracy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function AttendancePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [marking, setMarking] = useState(null);
  const [markedSessions, setMarkedSessions] = useState([]);
  const [showGPSTest, setShowGPSTest] = useState(false);
  const [customLocation, setCustomLocation] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  const studentId = user?.student?.id;
  const isValidStudentId = studentId && !isNaN(Number(studentId));

  const { data: studentDetail, isLoading: studentLoading } = useQuery({
    queryKey: ["student-detail", studentId],
    queryFn: async () => {
      if (!isValidStudentId) return null;
      const res = await api.get(`/api/v1/students/${studentId}`);
      return res.data.data?.student || null;
    },
    enabled: isValidStudentId,
  });

  const enrolledCourseIds =
    studentDetail?.enrollments?.map((e) => e.courseId) || [];

  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ["all-sessions"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/v1/attendance/session/all");
        return res.data.data?.sessions || [];
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
        return [];
      }
    },
    refetchInterval: 30000,
  });

  const enrolledSessions = (sessionsData || []).filter((session) =>
    enrolledCourseIds.includes(session.courseId),
  );

  // Categorize sessions
  const now = new Date();
  const activeSessionsList = enrolledSessions.filter((s) => {
    const start = new Date(s.startTime);
    const end = new Date(s.endTime);
    return now >= start && now <= end;
  });
  const upcomingSessionsList = enrolledSessions.filter((s) => {
    const start = new Date(s.startTime);
    return now < start;
  });
  const completedSessionsList = enrolledSessions.filter((s) => {
    const end = new Date(s.endTime);
    return now > end;
  });

  // Statistics
  const totalSessions = enrolledSessions.length;
  const activeSessions = activeSessionsList.length;
  const totalMarked = markedSessions.length;
  const attendanceRate =
    totalSessions > 0 ? (totalMarked / totalSessions) * 100 : 0;

  const markAttendance = async (sessionId) => {
    if (!isValidStudentId) {
      toast.error("Student profile not found. Please contact admin.");
      return;
    }

    setMarking(sessionId);

    try {
      let latitude, longitude;

      if (customLocation) {
        latitude = customLocation.lat;
        longitude = customLocation.lng;
        console.log("Using custom location:", latitude, longitude);
      } else {
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
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

      const res = await api.post("/api/v1/attendance/mark", {
        studentId: Number(studentId),
        sessionId: Number(sessionId),
        latitude,
        longitude,
      });

      const result = res.data.data;
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

      refetchSessions();
    } catch (err) {
      if (err.code === 1 || err.code === "PERMISSION_DENIED") {
        toast.error("Location access denied. Please allow location access.");
      } else {
        const message =
          err.response?.data?.message ||
          err.message ||
          "Failed to mark attendance";
        toast.error(message);
      }
    } finally {
      setMarking(null);
      setCustomLocation(null);
    }
  };

  const isLoading = studentLoading || sessionsLoading;
  const hasEnrolledCourses = enrolledCourseIds.length > 0;

  if (!isValidStudentId && !isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-4 bg-white dark:bg-gray-900">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 dark:text-amber-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Student Profile Not Found
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Please contact your administrator to set up your student profile.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 pt-8 pb-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Attendance Dashboard
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {hasEnrolledCourses
                  ? `You have ${totalSessions} session${totalSessions !== 1 ? "s" : ""} available`
                  : "You are not enrolled in any courses yet"}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowGPSTest(true)}
              className="gap-2 border-gray-200 dark:border-gray-700"
            >
              <Wifi className="w-4 h-4" />
              Test GPS
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        {hasEnrolledCourses && totalSessions > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              title="Total Sessions"
              value={totalSessions}
              icon={Calendar}
              gradient="from-blue-500 to-blue-600"
              delay={0}
            />
            <StatsCard
              title="Active Sessions"
              value={activeSessions}
              icon={Clock}
              gradient="from-emerald-500 to-emerald-600"
              delay={1}
              trend="Mark now!"
            />
            <StatsCard
              title="Marked Complete"
              value={totalMarked}
              icon={CheckCircle2}
              gradient="from-purple-500 to-purple-600"
              delay={2}
            />
            <StatsCard
              title="Attendance Rate"
              value={`${Math.round(attendanceRate)}%`}
              icon={TrendingUp}
              gradient="from-orange-500 to-orange-600"
              delay={3}
            />
          </div>
        )}

        {/* Tabs for Session Categories */}
        {hasEnrolledCourses && totalSessions > 0 && (
          <Tabs
            defaultValue="active"
            className="mb-6"
            onValueChange={setActiveTab}
          >
            <TabsList className="bg-gray-100 dark:bg-gray-800 rounded-xl p-1 h-12 w-full max-w-md">
              <TabsTrigger
                value="active"
                className="flex-1 rounded-lg font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Active ({activeSessionsList.length})
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="flex-1 rounded-lg font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                <Clock className="w-4 h-4 mr-2" />
                Upcoming ({upcomingSessionsList.length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="flex-1 rounded-lg font-semibold data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Completed ({completedSessionsList.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              {activeSessionsList.length === 0 ? (
                <Card className="text-center py-12 bg-white dark:bg-gray-900">
                  <CardContent>
                    <PlayCircle className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">
                      No active sessions
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                      Check back later for live sessions
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {activeSessionsList.map((session) => (
                    <AttendanceCard
                      key={session.id}
                      session={session}
                      onMark={markAttendance}
                      marking={marking}
                      alreadyMarked={markedSessions.includes(session.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="upcoming" className="mt-6">
              {upcomingSessionsList.length === 0 ? (
                <Card className="text-center py-12 bg-white dark:bg-gray-900">
                  <CardContent>
                    <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">
                      No upcoming sessions
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                      Sessions will appear here when scheduled
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {upcomingSessionsList.map((session) => (
                    <AttendanceCard
                      key={session.id}
                      session={session}
                      onMark={markAttendance}
                      marking={marking}
                      alreadyMarked={markedSessions.includes(session.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              {completedSessionsList.length === 0 ? (
                <Card className="text-center py-12 bg-white dark:bg-gray-900">
                  <CardContent>
                    <CheckCircle2 className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">
                      No completed sessions
                    </p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                      Completed sessions will appear here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {completedSessionsList.map((session) => (
                    <AttendanceCard
                      key={session.id}
                      session={session}
                      onMark={markAttendance}
                      marking={marking}
                      alreadyMarked={markedSessions.includes(session.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Loading your sessions...
              </p>
            </div>
          </div>
        )}

        {/* No Courses State */}
        {!isLoading && !hasEnrolledCourses && (
          <Card className="text-center py-16 bg-white dark:bg-gray-900">
            <CardContent>
              <BookOpen className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-semibold text-xl">
                No enrolled courses
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 max-w-md mx-auto">
                You haven't been enrolled in any courses yet. Please contact
                your administrator to get started.
              </p>
            </CardContent>
          </Card>
        )}

        {/* No Sessions State (has courses but no sessions) */}
        {!isLoading && hasEnrolledCourses && totalSessions === 0 && (
          <Card className="text-center py-16 bg-white dark:bg-gray-900">
            <CardContent>
              <Clock className="w-20 h-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-semibold text-xl">
                No sessions available
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 max-w-md mx-auto">
                Your lecturers haven't started any sessions yet. When they do,
                you'll see them here.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* GPS Test Modal */}
      <GPSTestModal
        isOpen={showGPSTest}
        onClose={() => setShowGPSTest(false)}
        onUseLocation={(location) => {
          setCustomLocation(location);
        }}
      />
    </div>
  );
}
