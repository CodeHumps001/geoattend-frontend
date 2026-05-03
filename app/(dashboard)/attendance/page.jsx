"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
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
  Eye,
  Download,
  Users,
  Calendar,
  ChevronRight,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Session Row Component for Table
function SessionRow({
  session,
  onViewDetails,
  onMark,
  marking,
  alreadyMarked,
}) {
  const now = new Date();
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  const isActive = now >= start && now <= end;
  const isFuture = now < start;

  return (
    <TableRow className="hover:bg-gray-50 transition-colors">
      <TableCell className="font-medium">
        <div>
          <p className="font-semibold text-gray-900">{session.course?.name}</p>
          <p className="text-xs text-gray-500">{session.course?.code}</p>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant={isActive ? "default" : isFuture ? "secondary" : "outline"}
          className={isActive ? "bg-emerald-500" : ""}
        >
          {isActive ? "LIVE" : isFuture ? "Upcoming" : "Ended"}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {new Date(session.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
        {" - "}
        {new Date(session.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1 text-sm">
          <MapPin className="w-3 h-3" />
          <span>{session.radiusMeters}m</span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewDetails(session)}
            className="h-8 px-2"
          >
            <Eye className="w-4 h-4" />
          </Button>
          {!alreadyMarked && isActive && (
            <Button
              size="sm"
              onClick={() => onMark(session.id)}
              disabled={marking === session.id}
              className="h-8 bg-blue-600 hover:bg-blue-700"
            >
              {marking === session.id ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Navigation className="w-3 h-3" />
              )}
              <span className="ml-1">Mark</span>
            </Button>
          )}
          {alreadyMarked && (
            <Badge
              variant="outline"
              className="bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Marked
            </Badge>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// Attendance Details Modal
function AttendanceDetailsModal({ session, isOpen, onClose }) {
  const [exporting, setExporting] = useState(false);

  // Fetch attendance records for this session
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["session-attendance", session?.id],
    queryFn: async () => {
      if (!session?.id) return null;
      const res = await api.get(`/api/v1/attendance/session/${session.id}`);
      return res.data.data;
    },
    enabled: !!session?.id && isOpen,
  });

  const exportToCSV = () => {
    if (!attendanceData?.records?.length) return;

    setExporting(true);

    // Prepare CSV data
    const headers = [
      "Student Name",
      "Email",
      "Status",
      "Marked At",
      "Latitude",
      "Longitude",
    ];
    const rows = attendanceData.records.map((record) => [
      record.student?.user?.name || "N/A",
      record.student?.user?.email || "N/A",
      record.status,
      new Date(record.markedAt).toLocaleString(),
      record.latitude,
      record.longitude,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_${session.course?.code}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    setExporting(false);
    toast.success("Attendance report exported successfully!");
  };

  const presentCount =
    attendanceData?.records?.filter((r) => r.status === "PRESENT").length || 0;
  const absentCount =
    attendanceData?.records?.filter((r) => r.status === "ABSENT").length || 0;
  const totalCount = attendanceData?.records?.length || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Attendance Details - {session?.course?.name}
          </DialogTitle>
          <DialogDescription>
            {session?.course?.code} •{" "}
            {new Date(session?.startTime).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 my-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{totalCount}</p>
              <p className="text-xs text-gray-500">Total Students</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-emerald-600">
                {presentCount}
              </p>
              <p className="text-xs text-gray-500">Present</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-xs text-gray-500">Absent</p>
            </CardContent>
          </Card>
        </div>

        {/* Export Button */}
        <div className="flex justify-end mb-4">
          <Button
            onClick={exportToCSV}
            disabled={exporting || !attendanceData?.records?.length}
            variant="outline"
          >
            <Download className="w-4 h-4 mr-2" />
            {exporting ? "Exporting..." : "Export to CSV"}
          </Button>
        </div>

        {/* Attendance Table */}
        {isLoading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto" />
            <p className="text-gray-500 mt-2">Loading attendance records...</p>
          </div>
        ) : attendanceData?.records?.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No attendance records yet</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Marked At</TableHead>
                <TableHead>Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData?.records?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.student?.user?.name || "N/A"}
                  </TableCell>
                  <TableCell>{record.student?.user?.email || "N/A"}</TableCell>
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
                    {new Date(record.markedAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {record.latitude.toFixed(4)}, {record.longitude.toFixed(4)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function AttendancePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [marking, setMarking] = useState(null);
  const [markedSessions, setMarkedSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showLocationDebug, setShowLocationDebug] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

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

  // Get all sessions
  const {
    data: sessionsData,
    isLoading: sessionsLoading,
    refetch: refetchSessions,
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

  // Test GPS location
  const testLocation = async () => {
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

      setCurrentLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });

      toast.success(
        `Location captured: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
      );
    } catch (err) {
      toast.error(`Location error: ${err.message}`);
    }
  };

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

      const { latitude, longitude, accuracy } = position.coords;

      console.log("📍 Location Debug:", { latitude, longitude, accuracy });

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
      refetchSessions();
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
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 pt-12 pb-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-black text-gray-900">
            Attendance Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {hasEnrolledCourses
              ? "View and mark attendance for your enrolled courses"
              : "You are not enrolled in any courses yet"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* GPS Info Banner with Test Button */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start justify-between mb-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
              <Wifi className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-blue-800 font-bold text-sm">GPS Required</p>
              <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
                Your location will be checked when you mark attendance. You must
                be within the allowed radius of your classroom.
              </p>
              {currentLocation && (
                <p className="text-blue-500 text-xs mt-2 font-mono">
                  Current: {currentLocation.lat.toFixed(4)},{" "}
                  {currentLocation.lng.toFixed(4)}
                  (accuracy: {Math.round(currentLocation.accuracy)}m)
                </p>
              )}
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={testLocation}
            className="bg-white"
          >
            <Navigation className="w-4 h-4 mr-2" />
            Test GPS
          </Button>
        </motion.div>

        {/* Sessions Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-16 bg-gray-100 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !hasEnrolledCourses ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold text-lg">
                No enrolled courses
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Ask your admin to enroll you in courses
              </p>
            </CardContent>
          </Card>
        ) : enrolledSessions.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-semibold text-lg">
                No sessions available
              </p>
              <p className="text-gray-400 text-sm mt-1">
                When a lecturer starts a session for your courses, it will
                appear here
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Active Sessions
              </CardTitle>
              <CardDescription>
                Mark your attendance for live sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Radius</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrolledSessions.map((session, i) => (
                    <SessionRow
                      key={session.id}
                      session={session}
                      onViewDetails={setSelectedSession}
                      onMark={markAttendance}
                      marking={marking}
                      alreadyMarked={markedSessions.includes(session.id)}
                    />
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Attendance Details Modal */}
      <AttendanceDetailsModal
        session={selectedSession}
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </div>
  );
}
