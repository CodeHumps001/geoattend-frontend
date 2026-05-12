"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  PlayCircle,
  Plus,
  Search,
  Users,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Trash2,
  Loader2,
  Eye,
  Navigation,
  Star,
  Shield,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import api from "@/lib/axios";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Session Card ──────────────────────────────────────────
function SessionCard({
  session,
  onEnd,
  onDelete,
  onView,
  isCourseRep,
  isAssistantRep,
  index,
}) {
  const isLive = session.isOpen;
  const presentCount =
    session.attendance?.filter((a) => a.status === "PRESENT").length || 0;
  const totalCount = session.attendance?.length || 0;
  const attendanceRate = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;
  const canManage = isCourseRep || isAssistantRep;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2 }}
    >
      <Card
        className={`border-2 transition-all hover:shadow-lg bg-white dark:bg-gray-900 ${
          isLive
            ? "border-emerald-200 dark:border-emerald-800"
            : "border-gray-200 dark:border-gray-800"
        }`}
      >
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div
              className="flex-1 cursor-pointer"
              onClick={() => onView(session.id)}
            >
              {/* Status badge */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {isLive ? (
                  <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0 font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                    LIVE NOW
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Ended
                  </Badge>
                )}
              </div>

              {/* Course info */}
              <h3 className="font-bold text-gray-900 dark:text-white text-base mb-0.5 line-clamp-1">
                {session.course?.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                {session.course?.code}
              </p>
              {session.course?.lecturerName && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {session.course.lecturerName}
                </p>
              )}

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3 mt-2.5 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(session.startTime).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(session.startTime).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {session.endTime && (
                    <>
                      {" "}
                      —{" "}
                      {new Date(session.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </>
                  )}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {session.radiusMeters}m
                </span>
              </div>
            </div>

            {/* Actions dropdown — only for those who can manage */}
            {canManage && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(session.id)}>
                    <Eye className="w-4 h-4 mr-2" /> View Details
                  </DropdownMenuItem>
                  {isLive && (
                    <DropdownMenuItem onClick={() => onEnd(session)}>
                      <XCircle className="w-4 h-4 mr-2" /> End Session
                    </DropdownMenuItem>
                  )}
                  {/* Only main rep can delete */}
                  {isCourseRep && (
                    <DropdownMenuItem
                      onClick={() => onDelete(session)}
                      className="text-red-600 dark:text-red-400 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Attendance progress */}
          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-3.5 h-3.5" />
                <span>{presentCount} present</span>
                <span className="text-gray-400 dark:text-gray-600">
                  / {totalCount} marked
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {Math.round(attendanceRate)}%
              </span>
            </div>
            <Progress value={attendanceRate} className="h-1.5" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Start Session Modal ───────────────────────────────────
function StartSessionModal({
  isOpen,
  onClose,
  onSuccess,
  courses,
  isAssistantRep,
}) {
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [formData, setFormData] = useState({
    courseId: "",
    latitude: "",
    longitude: "",
    radiusMeters: 100,
  });

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));
        toast.success(
          `Location captured! (${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)})`,
        );
        setGettingLocation(false);
      },
      () => {
        toast.error("Could not get location. Please allow location access.");
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      toast.error("Please capture your location first");
      return;
    }
    if (!formData.courseId) {
      toast.error("Please select a course");
      return;
    }
    setLoading(true);
    try {
      await api.post("/api/v1/sessions", {
        courseId: Number(formData.courseId),
        latitude: formData.latitude,
        longitude: formData.longitude,
        radiusMeters: formData.radiusMeters,
      });
      toast.success(
        "Session started! Students can now mark attendance. You've been marked present automatically. ✅",
      );
      onSuccess();
      onClose();
      setFormData({
        courseId: "",
        latitude: "",
        longitude: "",
        radiusMeters: 100,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-emerald-500" />
            Start New Session
            {isAssistantRep && (
              <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-0 text-xs">
                <Star className="w-3 h-3 mr-1" /> As Assistant Rep
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Capture your classroom location to start a live attendance session.
            You'll be automatically marked present.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Course select */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300 font-semibold">
              Course
            </Label>
            <select
              value={formData.courseId}
              onChange={(e) =>
                setFormData({ ...formData, courseId: e.target.value })
              }
              className="w-full mt-1.5 px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors text-sm"
              required
            >
              <option value="">Choose a course...</option>
              {courses?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
            {courses?.length === 0 && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5">
                No courses found. Create a course first.
              </p>
            )}
          </div>

          {/* Radius */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300 font-semibold">
              GPS Radius (metres)
            </Label>
            <Input
              type="number"
              value={formData.radiusMeters}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  radiusMeters: parseInt(e.target.value),
                })
              }
              min="10"
              max="500"
              className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Students must be within this radius to be marked present
            </p>
          </div>

          {/* Location capture */}
          <div>
            <Label className="text-gray-700 dark:text-gray-300 font-semibold">
              Classroom Location
            </Label>
            <Button
              type="button"
              onClick={getLocation}
              disabled={gettingLocation}
              variant="outline"
              className="w-full mt-1.5 h-11 rounded-xl border-gray-200 dark:border-gray-700 font-semibold"
            >
              {gettingLocation ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Getting your location...
                </span>
              ) : formData.latitude ? (
                <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  {Number(formData.latitude).toFixed(4)},{" "}
                  {Number(formData.longitude).toFixed(4)}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Navigation className="w-4 h-4" />
                  Capture My Location
                </span>
              )}
            </Button>
            {!formData.latitude && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5">
                ⚠️ Required — this sets the classroom GPS point
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading || !formData.latitude}
            className="w-full h-11 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl disabled:opacity-50"
          >
            {loading ? (
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
      </DialogContent>
    </Dialog>
  );
}

// ── End Session Dialog ────────────────────────────────────
function EndSessionDialog({ session, isOpen, onClose, onConfirm, loading }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-500" />
            End Session?
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            End{" "}
            <strong className="text-gray-900 dark:text-white">
              {session?.course?.name}
            </strong>
            ? Students will no longer be able to mark attendance.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-3 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-200 dark:border-gray-700"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "End Session"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Sessions List ─────────────────────────────────────────
function SessionsList({
  sessions,
  isLoading,
  onEnd,
  onDelete,
  onView,
  isCourseRep,
  isAssistantRep,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-48 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardContent className="py-14 text-center">
          <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <PlayCircle className="w-7 h-7 text-gray-400 dark:text-gray-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-semibold">
            No sessions here
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Start a session to begin tracking attendance
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sessions.map((session, i) => (
        <SessionCard
          key={session.id}
          session={session}
          index={i}
          onEnd={onEnd}
          onDelete={onDelete}
          onView={onView}
          isCourseRep={isCourseRep}
          isAssistantRep={isAssistantRep}
        />
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function SessionsPage() {
  const { user, isCourseRep, isAssistantRep, canManageSessions } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [showStartModal, setShowStartModal] = useState(false);
  const [sessionToEnd, setSessionToEnd] = useState(null);
  const [endingSession, setEndingSession] = useState(false);

  // Fetch courses for the dropdown
  const { data: coursesResponse } = useQuery({
    queryKey: ["session-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data;
    },
    enabled: canManageSessions,
  });

  const courses = coursesResponse?.courses || [];

  // Fetch all sessions
  const { data: sessionsResponse, isLoading } = useQuery({
    queryKey: ["all-sessions"],
    queryFn: async () => {
      const res = await api.get("/api/v1/sessions");
      return res.data.data;
    },
    refetchInterval: 10000,
    enabled: !!user,
  });

  const allSessions = sessionsResponse?.sessions || [];

  // Filter by search + tab
  const filteredSessions = allSessions.filter((s) => {
    const matchesSearch =
      s.course?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.course?.code?.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "active") return matchesSearch && s.isOpen === true;
    if (activeTab === "ended") return matchesSearch && s.isOpen === false;
    return matchesSearch; // "all"
  });

  // Stats
  const liveSessions = allSessions.filter((s) => s.isOpen).length;
  const endedSessions = allSessions.filter((s) => !s.isOpen).length;

  // End session
  const handleEndSession = async () => {
    if (!sessionToEnd) return;
    setEndingSession(true);
    try {
      await api.patch(`/api/v1/sessions/${sessionToEnd.id}/close`);
      toast.success(`Session ended. Attendance has been recorded.`);
      queryClient.invalidateQueries(["all-sessions"]);
      setSessionToEnd(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to end session");
    } finally {
      setEndingSession(false);
    }
  };

  // Delete session
  const handleDeleteSession = async (session) => {
    if (
      !confirm(
        `Delete "${session.course?.name}" session and all its attendance records? This cannot be undone.`,
      )
    )
      return;
    try {
      await api.delete(`/api/v1/sessions/${session.id}`);
      toast.success("Session deleted.");
      queryClient.invalidateQueries(["all-sessions"]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete session");
    }
  };

  const handleViewSession = (sessionId) => {
    router.push(`/sessions/${sessionId}`);
  };

  if (!isAssistantRep || !isCourseRep) {
    // Moves the browser back one page in history
    window.history.back();
  }
  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white">
            Sessions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {liveSessions > 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {liveSessions} live now
              </span>
            ) : (
              "No active sessions"
            )}
            {endedSessions > 0 && (
              <span className="text-gray-400 dark:text-gray-500">
                {" · "}
                {endedSessions} ended
              </span>
            )}
          </p>
        </div>

        {/* Only rep and assistant can start sessions */}
        {canManageSessions && (
          <div className="flex items-center gap-2">
            {isAssistantRep && !isCourseRep && (
              <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-0">
                <Star className="w-3 h-3 mr-1" />
                Assistant Rep
              </Badge>
            )}
            <Button
              onClick={() => setShowStartModal(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-200 dark:shadow-emerald-900/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              Start Session
            </Button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
        <Input
          placeholder="Search by course name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList className="w-full bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <TabsTrigger
            value="active"
            className="flex-1 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm font-semibold"
          >
            Live
            {liveSessions > 0 && (
              <span className="ml-1.5 bg-emerald-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {liveSessions}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="ended"
            className="flex-1 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm font-semibold"
          >
            Ended
          </TabsTrigger>
          <TabsTrigger
            value="all"
            className="flex-1 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm font-semibold"
          >
            All ({allSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          <SessionsList
            sessions={filteredSessions}
            isLoading={isLoading}
            onEnd={setSessionToEnd}
            onDelete={handleDeleteSession}
            onView={handleViewSession}
            isCourseRep={isCourseRep}
            isAssistantRep={isAssistantRep}
          />
        </TabsContent>
        <TabsContent value="ended" className="mt-4">
          <SessionsList
            sessions={filteredSessions}
            isLoading={isLoading}
            onEnd={setSessionToEnd}
            onDelete={handleDeleteSession}
            onView={handleViewSession}
            isCourseRep={isCourseRep}
            isAssistantRep={isAssistantRep}
          />
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          <SessionsList
            sessions={filteredSessions}
            isLoading={isLoading}
            onEnd={setSessionToEnd}
            onDelete={handleDeleteSession}
            onView={handleViewSession}
            isCourseRep={isCourseRep}
            isAssistantRep={isAssistantRep}
          />
        </TabsContent>
      </Tabs>

      {/* Start Session Modal */}
      <StartSessionModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        onSuccess={() => queryClient.invalidateQueries(["all-sessions"])}
        courses={courses}
        isAssistantRep={isAssistantRep && !isCourseRep}
      />

      {/* End Session Dialog */}
      <EndSessionDialog
        session={sessionToEnd}
        isOpen={!!sessionToEnd}
        onClose={() => setSessionToEnd(null)}
        onConfirm={handleEndSession}
        loading={endingSession}
      />
    </div>
  );
}
