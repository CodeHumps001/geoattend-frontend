// app/(app)/sessions/page.jsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Video,
  Plus,
  Search,
  PlayCircle,
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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
    transition: { duration: 0.5, delay: i * 0.05 },
  }),
};

function SessionCard({ session, onEnd, onDelete, onViewDetails }) {
  const now = new Date();
  const start = new Date(session.startTime);
  const end = session.endTime ? new Date(session.endTime) : null;
  const isLive = session.isOpen;
  const isUpcoming = false; // No upcoming since sessions are created as live
  const isEnded = !session.isOpen;

  const presentCount =
    session.attendance?.filter((a) => a.status === "PRESENT").length || 0;
  const totalCount = session.attendance?.length || 0;
  const attendanceRate = totalCount > 0 ? (presentCount / totalCount) * 100 : 0;

  return (
    <motion.div variants={fadeUp} whileHover={{ y: -2 }}>
      <Card
        className={`border-2 transition-all hover:shadow-lg cursor-pointer ${
          isLive
            ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-950/20"
            : "border-gray-200 dark:border-gray-800"
        }`}
      >
        <CardContent className="p-5" onClick={() => onViewDetails(session.id)}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isLive && (
                  <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                    LIVE NOW
                  </Badge>
                )}
                {isEnded && <Badge variant="secondary">Ended</Badge>}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                {session.course?.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {session.course?.code}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
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
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {session.radiusMeters}m radius
                </span>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(session.id);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" /> View Details
                </DropdownMenuItem>
                {isLive && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEnd(session);
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> End Session
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session);
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-3.5 h-3.5" />
                <span>
                  {presentCount}/{totalCount} present
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
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

function StartSessionModal({ isOpen, onClose, onSuccess, courses }) {
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [formData, setFormData] = useState({
    courseId: "",
    latitude: "",
    longitude: "",
    radiusMeters: 100,
  });

  const getLocation = () => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      toast.error("Please capture your location first");
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
      toast.success("Session started! Students can now mark attendance.");
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Start New Session</DialogTitle>
          <DialogDescription>
            Set up a live attendance session for your students.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label>Select Course</Label>
            <select
              value={formData.courseId}
              onChange={(e) =>
                setFormData({ ...formData, courseId: e.target.value })
              }
              className="w-full mt-1.5 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Choose a course...</option>
              {courses?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>GPS Radius (meters)</Label>
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
            />
          </div>
          <div>
            <Label>Classroom Location</Label>
            <Button
              type="button"
              onClick={getLocation}
              disabled={gettingLocation}
              variant="outline"
              className="w-full mt-1.5"
            >
              {gettingLocation ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : formData.latitude ? (
                <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" />
              ) : (
                <MapPin className="w-4 h-4 mr-2" />
              )}
              {gettingLocation
                ? "Getting location..."
                : formData.latitude
                  ? "Location captured"
                  : "Capture my location"}
            </Button>
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Start Session
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EndSessionDialog({ session, isOpen, onClose, onConfirm }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>End Session</DialogTitle>
          <DialogDescription>
            Are you sure you want to end "{session?.course?.name}" session?
            Students will no longer be able to mark attendance.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            End Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SessionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("active");
  const [showStartModal, setShowStartModal] = useState(false);
  const [sessionToEnd, setSessionToEnd] = useState(null);

  // Fetch courses for the dropdown
  const { data: coursesResponse } = useQuery({
    queryKey: ["rep-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data; // { courses: [], count: number }
    },
    enabled: !!user,
  });

  const courses = coursesResponse?.courses || [];

  // Fetch all sessions - FIXED: access data.data.sessions
  const { data: sessionsResponse, isLoading } = useQuery({
    queryKey: ["rep-sessions"],
    queryFn: async () => {
      const res = await api.get("/api/v1/sessions");
      return res.data.data; // { sessions: [], count: number }
    },
    refetchInterval: 10000,
    enabled: !!user,
  });

  // Extract sessions array from response
  const sessions = sessionsResponse?.sessions || [];

  // End session mutation
  const endMutation = useMutation({
    mutationFn: async (sessionId) => {
      await api.patch(`/api/v1/sessions/${sessionId}/close`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["rep-sessions"]);
      toast.success("Session ended successfully");
      setSessionToEnd(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to end session");
    },
  });

  // Delete session mutation (you'll need to add this endpoint or handle differently)
  const deleteMutation = useMutation({
    mutationFn: async (sessionId) => {
      // Note: You may need to add a DELETE endpoint for sessions
      await api.delete(`/api/v1/sessions/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["rep-sessions"]);
      toast.success("Session deleted");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete session");
    },
  });

  const now = new Date();
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.course?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.course?.code?.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "active") {
      return matchesSearch && s.isOpen === true;
    } else if (activeTab === "ended") {
      return matchesSearch && s.isOpen === false;
    } else {
      return matchesSearch;
    }
  });

  const handleViewDetails = (sessionId) => {
    router.push(`/sessions/${sessionId}`);
  };

  const handleEndSession = (session) => {
    setSessionToEnd(session);
  };

  const confirmEndSession = () => {
    if (sessionToEnd) {
      endMutation.mutate(sessionToEnd.id);
    }
  };

  const handleDeleteSession = (session) => {
    if (
      confirm(
        `Delete "${session.course?.name}" session? This action cannot be undone.`,
      )
    ) {
      deleteMutation.mutate(session.id);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sessions
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Start and manage live attendance sessions
          </p>
        </div>
        <Button onClick={() => setShowStartModal(true)} className="gap-2">
          <Video className="w-4 h-4" />
          Start Session
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search sessions by course name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="active" className="flex-1">
            Live
          </TabsTrigger>
          <TabsTrigger value="ended" className="flex-1">
            Ended
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1">
            All
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4">
          {renderSessionList(
            filteredSessions,
            isLoading,
            handleEndSession,
            handleDeleteSession,
            handleViewDetails,
          )}
        </TabsContent>
        <TabsContent value="ended" className="mt-4">
          {renderSessionList(
            filteredSessions,
            isLoading,
            handleEndSession,
            handleDeleteSession,
            handleViewDetails,
          )}
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          {renderSessionList(
            filteredSessions,
            isLoading,
            handleEndSession,
            handleDeleteSession,
            handleViewDetails,
          )}
        </TabsContent>
      </Tabs>

      {/* Start Session Modal */}
      <StartSessionModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        onSuccess={() => queryClient.invalidateQueries(["rep-sessions"])}
        courses={courses}
      />

      {/* End Session Dialog */}
      <EndSessionDialog
        session={sessionToEnd}
        isOpen={!!sessionToEnd}
        onClose={() => setSessionToEnd(null)}
        onConfirm={confirmEndSession}
      />
    </div>
  );
}

function renderSessionList(
  sessions,
  isLoading,
  onEnd,
  onDelete,
  onViewDetails,
) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-5">
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20 mb-3" />
              <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!sessions || sessions.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Video className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">No sessions found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            Start your first session to track attendance
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          onEnd={onEnd}
          onDelete={onDelete}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
