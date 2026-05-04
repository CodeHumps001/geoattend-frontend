"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  PlayCircle,
  Plus,
  Users,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  Calendar,
  Navigation,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

function SessionCard({ session, index }) {
  const router = useRouter();
  const now = new Date();
  const isLive =
    now >= new Date(session.startTime) && now <= new Date(session.endTime);
  const isEnded = now > new Date(session.endTime);

  // Use attendance data already included in the session from getAllSessions
  const records = session.attendance || [];
  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const attendanceRate =
    records.length > 0 ? ((presentCount / records.length) * 100).toFixed(0) : 0;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <Card
        className={`h-full border-2 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden group relative ${
          isLive
            ? "border-emerald-200 dark:border-emerald-800 shadow-lg shadow-emerald-50 dark:shadow-emerald-950/30"
            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
        } bg-white dark:bg-gray-900`}
        onClick={() => router.push(`/sessions/${session.id}`)}
      >
        {isLive && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
        )}

        <CardHeader className="pb-2 pt-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {isLive ? (
                  <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0 text-xs font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                    LIVE
                  </Badge>
                ) : isEnded ? (
                  <Badge variant="secondary" className="text-xs">
                    Completed
                  </Badge>
                ) : (
                  <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-0 text-xs">
                    Upcoming
                  </Badge>
                )}
              </div>
              <CardTitle className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">
                {session.course?.name || "Unknown Course"}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                <span className="font-mono">{session.course?.code}</span>
                {session.course?.department && (
                  <span> · {session.course.department}</span>
                )}
              </CardDescription>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p className="text-2xl font-black text-gray-900 dark:text-white">
                {presentCount}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                present
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
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
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
              <span>
                {new Date(session.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{session.radiusMeters}m GPS radius</span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {records.length} recorded
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  {presentCount}
                </span>
              </div>
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                {attendanceRate}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-700"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end">
            <span className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function SessionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [form, setForm] = useState({
    courseId: "",
    startTime: "",
    endTime: "",
    latitude: "",
    longitude: "",
    radiusMeters: "100",
  });

  // Get lecturer's courses for the dropdown
  const { data: coursesData } = useQuery({
    queryKey: ["my-courses-for-session"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data;
    },
  });

  // Get all sessions — attendance is already included from backend
  const {
    data: sessionsData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-sessions"],
    queryFn: async () => {
      const res = await api.get("/api/v1/attendance/session/all");
      return res.data.data;
    },
    refetchInterval: 15000,
  });

  // Filter sessions for lecturer — only show their courses' sessions
  const allSessions = sessionsData?.sessions || [];
  const myCourseIds = new Set(
    (coursesData?.courses || [])
      .filter((c) => c.lecturer?.user?.email === user?.email)
      .map((c) => c.id),
  );

  // Admins see all, lecturers see only their course sessions
  const sessions =
    user?.role === "ADMIN"
      ? allSessions
      : allSessions.filter((s) => myCourseIds.has(s.courseId));

  const myCourses = (coursesData?.courses || []).filter(
    (c) => c.lecturer?.user?.email === user?.email,
  );

  const now = new Date();
  const liveSessions = sessions.filter(
    (s) => now >= new Date(s.startTime) && now <= new Date(s.endTime),
  ).length;

  const getLocation = () => {
    setGettingLocation(true);
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setGettingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }));
        toast.success(
          `Location captured! (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
        );
        setGettingLocation(false);
      },
      (err) => {
        toast.error("Could not get location. Please allow location access.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.latitude || !form.longitude) {
      toast.error("Please capture your GPS location first");
      return;
    }
    setCreating(true);
    try {
      await api.post("/api/v1/attendance/session", {
        courseId: Number(form.courseId),
        startTime: new Date(form.startTime).toISOString(),
        endTime: new Date(form.endTime).toISOString(),
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        radiusMeters: Number(form.radiusMeters),
      });
      toast.success("Session started! Students can now mark attendance.");
      setShowModal(false);
      setForm({
        courseId: "",
        startTime: "",
        endTime: "",
        latitude: "",
        longitude: "",
        radiusMeters: "100",
      });
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start session");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 pt-10 sm:pt-12 pb-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              Sessions
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5">
              {sessions.length} total
              {liveSessions > 0 && (
                <span className="ml-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                  · {liveSessions} live now
                </span>
              )}
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 dark:shadow-blue-900/30 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-56 rounded-2xl" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <Card className="text-center py-16 border-0 shadow-lg bg-white dark:bg-gray-900">
            <CardContent>
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PlayCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-bold text-lg">
                No sessions yet
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Start a session to begin tracking attendance
              </p>
              <Button
                onClick={() => setShowModal(true)}
                className="mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start First Session
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {sessions.map((session, i) => (
              <SessionCard key={session.id} session={session} index={i} />
            ))}
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", bounce: 0.2 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 w-full max-w-md max-h-[92vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">
                    Start Session
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Capture your classroom location first
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                    Course
                  </Label>
                  <select
                    value={form.courseId}
                    onChange={(e) =>
                      setForm({ ...form, courseId: e.target.value })
                    }
                    required
                    className="w-full mt-1.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select a course...</option>
                    {myCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                      Start Time
                    </Label>
                    <Input
                      type="datetime-local"
                      value={form.startTime}
                      onChange={(e) =>
                        setForm({ ...form, startTime: e.target.value })
                      }
                      required
                      className="mt-1.5 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                      End Time
                    </Label>
                    <Input
                      type="datetime-local"
                      value={form.endTime}
                      onChange={(e) =>
                        setForm({ ...form, endTime: e.target.value })
                      }
                      required
                      className="mt-1.5 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                    Allowed Radius (metres)
                  </Label>
                  <Input
                    type="number"
                    value={form.radiusMeters}
                    onChange={(e) =>
                      setForm({ ...form, radiusMeters: e.target.value })
                    }
                    min="10"
                    max="500"
                    className="mt-1.5 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                    Classroom GPS Location
                  </Label>
                  <Button
                    type="button"
                    onClick={getLocation}
                    disabled={gettingLocation}
                    variant="outline"
                    className="w-full mt-1.5 h-11 rounded-xl border-gray-200 dark:border-gray-700 font-semibold text-sm"
                  >
                    {gettingLocation ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Getting your location...
                      </span>
                    ) : form.latitude ? (
                      <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        {Number(form.latitude).toFixed(4)},{" "}
                        {Number(form.longitude).toFixed(4)}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Navigation className="w-4 h-4" />
                        Capture My Location
                      </span>
                    )}
                  </Button>
                  {!form.latitude && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                      ⚠️ Location required — students must be within{" "}
                      {form.radiusMeters}m of this point
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={creating || !form.latitude}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl disabled:opacity-50"
                >
                  {creating ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Starting session...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" />
                      Start Session
                    </span>
                  )}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
