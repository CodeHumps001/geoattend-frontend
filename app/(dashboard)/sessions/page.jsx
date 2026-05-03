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
  LayoutGrid,
  Table as TableIcon,
  TrendingUp,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Session Card Component - Optimized for grid layout
function SessionCard({ session, index }) {
  const router = useRouter();
  const now = new Date();
  const isActive = now < new Date(session.endTime);
  const isLive =
    now >= new Date(session.startTime) && now <= new Date(session.endTime);

  const { data: attendanceData } = useQuery({
    queryKey: ["session-attendance-preview", session.id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/attendance/session/${session.id}`);
      return res.data.data;
    },
  });

  const records = attendanceData?.records || [];
  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const attendanceRate =
    records.length > 0 ? ((presentCount / records.length) * 100).toFixed(0) : 0;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card
        className={`h-full border-2 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden group ${
          isLive
            ? "border-emerald-200 shadow-lg shadow-emerald-100/50 bg-gradient-to-br from-white to-emerald-50/30"
            : "border-gray-100 hover:border-gray-200"
        }`}
        onClick={() => router.push(`/sessions/${session.id}`)}
      >
        {/* Live Indicator Bar */}
        {isLive && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 animate-pulse" />
        )}

        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {isLive ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-xs font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                    LIVE NOW
                  </Badge>
                ) : isActive ? (
                  <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Completed
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1">
                {session.course?.name}
              </CardTitle>
              <CardDescription className="text-xs mt-1 flex items-center gap-2">
                <span className="font-mono">{session.course?.code}</span>
                <span>•</span>
                <span>{session.course?.department}</span>
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-gray-900">
                {presentCount}
              </p>
              <p className="text-xs text-gray-400">present</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 pb-4">
          {/* Session Details */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
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
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              <span>{session.radiusMeters}m radius</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(session.date).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>{records.length} students</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>{presentCount} present</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-gray-400" />
                <span className="text-xs font-semibold text-gray-600">
                  {attendanceRate}%
                </span>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${attendanceRate}%` }}
              />
            </div>
          </div>

          {/* View Details Link */}
          <div className="mt-4 flex items-center justify-end">
            <span className="text-xs font-medium text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              View Details
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Session Row Component (Desktop Table View)
function SessionRow({ session }) {
  const router = useRouter();
  const now = new Date();
  const isLive =
    now >= new Date(session.startTime) && now <= new Date(session.endTime);

  const { data: attendanceData } = useQuery({
    queryKey: ["session-attendance-count", session.id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/attendance/session/${session.id}`);
      return res.data.data;
    },
  });

  const records = attendanceData?.records || [];
  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const attendanceRate =
    records.length > 0 ? ((presentCount / records.length) * 100).toFixed(0) : 0;

  return (
    <TableRow
      className="cursor-pointer hover:bg-gray-50 transition-colors group"
      onClick={() => router.push(`/sessions/${session.id}`)}
    >
      <TableCell className="font-medium">
        <div>
          <p className="font-semibold text-gray-900">{session.course?.name}</p>
          <p className="text-xs text-gray-500">{session.course?.code}</p>
        </div>
      </TableCell>
      <TableCell>
        {isLive ? (
          <Badge className="bg-emerald-100 text-emerald-700 border-0">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
            LIVE
          </Badge>
        ) : (
          <Badge variant="outline">Ended</Badge>
        )}
      </TableCell>
      <TableCell className="text-sm whitespace-nowrap">
        {new Date(session.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="w-3 h-3" />
          {session.radiusMeters}m
        </div>
      </TableCell>
      <TableCell className="text-center">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{presentCount}</span>
          <span className="text-xs text-gray-400">/ {records.length}</span>
          <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
              style={{ width: `${attendanceRate}%` }}
            />
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
      </TableCell>
    </TableRow>
  );
}

export default function SessionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [viewMode, setViewMode] = (useState < "cards") | ("table" > "cards");
  const [form, setForm] = useState({
    courseId: "",
    startTime: "",
    endTime: "",
    latitude: "",
    longitude: "",
    radiusMeters: "100",
  });

  const { data: coursesData } = useQuery({
    queryKey: ["lecturer-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data;
    },
  });

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

  const myCourses = (coursesData?.courses || []).filter(
    (c) => c.lecturer?.user?.email === user?.email,
  );

  const sessions = sessionsData?.sessions || [];

  const getLocation = () => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toString(),
          longitude: pos.coords.longitude.toString(),
        }));
        toast.success("Location captured!");
        setGettingLocation(false);
      },
      () => {
        toast.error("Could not get location. Please allow location access.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true },
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

  // Stats for header
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter((s) => {
    const now = new Date();
    return now >= new Date(s.startTime) && now <= new Date(s.endTime);
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 pt-8 pb-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Sessions
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {totalSessions} total sessions • {activeSessions} active now
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === "cards"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                    viewMode === "table"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  Table
                </button>
              </div>
              <Button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Desktop Table View */}
        {viewMode === "table" && !isLoading && sessions.length > 0 && (
          <Card className="hidden sm:block border-0 shadow-lg">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Course</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Time</TableHead>
                    <TableHead className="font-semibold">Radius</TableHead>
                    <TableHead className="font-semibold text-center">
                      Attendance
                    </TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <SessionRow key={session.id} session={session} />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Grid Card View - Responsive grid for big screens */}
        {(viewMode === "cards" ||
          (typeof window !== "undefined" && window.innerWidth < 640)) && (
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-5">
                      <div className="h-32 bg-gray-100 rounded-lg" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <Card className="text-center py-16 border-0 shadow-lg">
                <CardContent>
                  <PlayCircle className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-semibold text-xl">
                    No sessions yet
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Start your first session to track attendance
                  </p>
                  <Button
                    onClick={() => setShowModal(true)}
                    className="mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Start Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {sessions.map((session, i) => (
                  <SessionCard key={session.id} session={session} index={i} />
                ))}
              </div>
            )}
          </>
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
              className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900">
                    Start Session
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Capture your location to begin
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label className="text-gray-700 font-semibold">Course</Label>
                  <select
                    value={form.courseId}
                    onChange={(e) =>
                      setForm({ ...form, courseId: e.target.value })
                    }
                    required
                    className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
                  >
                    <option value="">Select a course</option>
                    {myCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} — {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">
                    Start Time
                  </Label>
                  <Input
                    type="datetime-local"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({ ...form, startTime: e.target.value })
                    }
                    required
                    className="mt-1.5 bg-gray-50 border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">
                    End Time
                  </Label>
                  <Input
                    type="datetime-local"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({ ...form, endTime: e.target.value })
                    }
                    required
                    className="mt-1.5 bg-gray-50 border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">
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
                    className="mt-1.5 bg-gray-50 border-gray-200 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 font-semibold">
                    Classroom Location
                  </Label>
                  <Button
                    type="button"
                    onClick={getLocation}
                    disabled={gettingLocation}
                    variant="outline"
                    className="w-full mt-1.5 h-11 rounded-xl border-gray-200 font-semibold"
                  >
                    {gettingLocation ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Getting location...
                      </span>
                    ) : form.latitude ? (
                      <span className="flex items-center gap-2 text-emerald-600">
                        <CheckCircle2 className="w-4 h-4" />
                        Location captured
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Navigation className="w-4 h-4" />
                        Capture My Location
                      </span>
                    )}
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={creating}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl mt-2"
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
