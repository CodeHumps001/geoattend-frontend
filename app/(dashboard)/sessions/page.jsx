"use client";

import { useState, useRef } from "react";
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
  Download,
  Eye,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronUp,
  Smartphone,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Export to CSV function
const exportToCSV = (records, sessionName) => {
  const headers = [
    "Student Name",
    "Student Code",
    "Email",
    "Status",
    "Marked At",
    "Distance",
    "Latitude",
    "Longitude",
  ];
  const rows = records.map((record) => [
    record.student?.user?.name || "N/A",
    record.student?.studentCode || "N/A",
    record.student?.user?.email || "N/A",
    record.status,
    new Date(record.markedAt).toLocaleString(),
    `${Math.round(record.distanceFromClass || 0)}m`,
    record.latitude?.toFixed(6) || "N/A",
    record.longitude?.toFixed(6) || "N/A",
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance_${sessionName}_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Attendance report exported successfully!");
};

// Attendance Details Modal (Full-screen on mobile)
function AttendanceDetailsModal({ session, isOpen, onClose }) {
  const [view, setView] = useState("list"); // list or stats
  const [exporting, setExporting] = useState(false);

  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["session-attendance", session?.id],
    queryFn: async () => {
      if (!session?.id) return null;
      const res = await api.get(`/api/v1/attendance/session/${session.id}`);
      return res.data.data;
    },
    enabled: !!session?.id && isOpen,
  });

  const records = attendanceData?.records || [];
  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const totalCount = records.length;
  const attendanceRate =
    totalCount > 0 ? ((presentCount / totalCount) * 100).toFixed(1) : 0;

  const handleExport = () => {
    setExporting(true);
    exportToCSV(records, session?.course?.name || "session");
    setExporting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0 sm:p-6">
        <DialogHeader className="p-4 sm:p-0">
          <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <span>{session?.course?.name}</span>
            <Badge variant="outline" className="text-xs">
              {session?.course?.code}
            </Badge>
          </DialogTitle>
          <DialogDescription className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(session?.startTime).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(session?.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              {" - "}
              {new Date(session?.endTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {session?.radiusMeters}m radius
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* View Toggle */}
        <div className="flex items-center justify-between px-4 sm:px-0 mt-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={view === "list" ? "default" : "outline"}
              onClick={() => setView("list")}
              className="rounded-full"
            >
              <Users className="w-3 h-3 mr-1" />
              List View
            </Button>
            <Button
              size="sm"
              variant={view === "stats" ? "default" : "outline"}
              onClick={() => setView("stats")}
              className="rounded-full"
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              Statistics
            </Button>
          </div>
          {records.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleExport}
              disabled={exporting}
              className="rounded-full"
            >
              <Download className="w-3 h-3 mr-1" />
              {exporting ? "Exporting..." : "Export CSV"}
            </Button>
          )}
        </div>

        {/* Stats View */}
        {view === "stats" && (
          <div className="p-4 sm:p-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{totalCount}</p>
                  <p className="text-xs text-gray-500">Total Students</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-600">
                    {presentCount}
                  </p>
                  <p className="text-xs text-gray-500">Present</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <XCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">
                    {absentCount}
                  </p>
                  <p className="text-xs text-gray-500">Absent</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Award className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold">{attendanceRate}%</p>
                  <p className="text-xs text-gray-500">Attendance Rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Attendance Chart placeholder */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    Attendance Overview
                  </span>
                  <span className="text-xs text-gray-500">
                    {presentCount}/{totalCount} students
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${attendanceRate}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* List View */}
        {view === "list" && (
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No attendance records yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Students will appear here when they mark attendance
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Student Code</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Marked At</TableHead>
                        <TableHead>Distance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {records.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">
                            {record.student?.user?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            {record.student?.studentCode || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                record.status === "PRESENT"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(record.markedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </TableCell>
                          <TableCell className="text-sm">
                            {Math.round(record.distanceFromClass || 0)}m
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden space-y-3">
                  {records.map((record) => (
                    <Card key={record.id} className="border border-gray-100">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${record.status === "PRESENT" ? "bg-emerald-100" : "bg-red-100"}`}
                            >
                              {record.status === "PRESENT" ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-sm">
                                {record.student?.user?.name || "N/A"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {record.student?.studentCode || "N/A"}
                              </p>
                            </div>
                          </div>
                          <Badge
                            className={
                              record.status === "PRESENT"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {record.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(record.markedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {Math.round(record.distanceFromClass || 0)}m away
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Session Card Component (Mobile/Tablet view)
function SessionCard({ session, index, onViewDetails }) {
  const [expanded, setExpanded] = useState(false);
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
    enabled: expanded,
  });

  const records = attendanceData?.records || [];
  const presentCount = records.filter((r) => r.status === "PRESENT").length;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
    >
      <Card
        className={`border-2 transition-all ${isLive ? "border-emerald-200 shadow-lg shadow-emerald-50" : "border-gray-100"}`}
      >
        <CardHeader
          className="pb-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
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
              <CardTitle className="text-base font-bold text-gray-900">
                {session.course?.name}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {session.course?.code} • {session.course?.department}
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-gray-900">
                {presentCount}
              </p>
              <p className="text-xs text-gray-400">present</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 flex-wrap">
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
        </CardHeader>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="pt-0 border-t border-gray-100">
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Recent Activity ({Math.min(3, records.length)} of{" "}
                    {records.length})
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewDetails(session);
                    }}
                    className="h-7 text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View All
                  </Button>
                </div>
                {records.slice(0, 3).map((record) => (
                  <div key={record.id} className="flex items-center gap-3 py-2">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${record.status === "PRESENT" ? "bg-emerald-100" : "bg-red-100"}`}
                    >
                      {record.status === "PRESENT" ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-800">
                        {record.student?.user?.name?.split(" ")[0] || "Student"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {Math.round(record.distanceFromClass || 0)}m away
                      </p>
                    </div>
                    <Badge
                      className={`text-xs ${record.status === "PRESENT" ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
                    >
                      {record.status}
                    </Badge>
                  </div>
                ))}
                {records.length === 0 && (
                  <p className="text-gray-400 text-xs text-center py-4">
                    No attendance records yet
                  </p>
                )}
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}

// Session Row Component (Desktop Table View)
function SessionRow({ session, onViewDetails }) {
  const now = new Date();
  const isLive =
    now >= new Date(session.startTime) && now <= new Date(session.endTime);
  const [previewCount, setPreviewCount] = useState(0);

  // Fetch preview count
  useQuery({
    queryKey: ["session-attendance-count", session.id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/attendance/session/${session.id}`);
      const count =
        res.data.data.records?.filter((r) => r.status === "PRESENT").length ||
        0;
      setPreviewCount(count);
      return count;
    },
  });

  return (
    <TableRow
      className="cursor-pointer hover:bg-gray-50"
      onClick={() => onViewDetails(session)}
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
      <TableCell className="text-sm">
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
      <TableCell className="font-semibold text-center">
        {previewCount}
      </TableCell>
      <TableCell className="text-right">
        <Button size="sm" variant="ghost" className="h-8">
          <Eye className="w-4 h-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function SessionsPage() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [viewMode, setViewMode] = useState("cards"); // cards or table
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 pt-8 pb-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Sessions</h1>
              <p className="text-gray-400 text-sm mt-1">
                Manage and track attendance for your course sessions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === "cards"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  Cards
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    viewMode === "table"
                      ? "bg-white shadow-sm text-gray-900"
                      : "text-gray-500"
                  }`}
                >
                  Table
                </button>
              </div>
              <Button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200"
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
          <Card className="hidden sm:block">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Radius</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session) => (
                    <SessionRow
                      key={session.id}
                      session={session}
                      onViewDetails={setSelectedSession}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Mobile/Tablet Card View */}
        {(viewMode === "cards" || window.innerWidth < 640) && (
          <div className="space-y-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-5">
                      <div className="h-4 bg-gray-100 rounded w-20 mb-3" />
                      <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : sessions.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <PlayCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-semibold text-lg">
                    No sessions yet
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Start your first session to track attendance
                  </p>
                  <Button
                    onClick={() => setShowModal(true)}
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Start Session
                  </Button>
                </CardContent>
              </Card>
            ) : (
              sessions.map((session, i) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  index={i}
                  onViewDetails={setSelectedSession}
                />
              ))
            )}
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
              className="bg-white rounded-3xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
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
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
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
                    className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-blue-400 transition-colors"
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
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl mt-2"
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

      {/* Attendance Details Modal */}
      <AttendanceDetailsModal
        session={selectedSession}
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </div>
  );
}
