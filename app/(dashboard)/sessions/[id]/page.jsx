"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Calendar,
  Loader2,
  TrendingUp,
  Download,
  Award,
  UserCheck,
  Navigation,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Export to CSV function
const exportToCSV = (records, sessionName) => {
  if (!records || records.length === 0) {
    toast.error("No records to export");
    return;
  }

  const headers = [
    "Student Name",
    "Student Code",
    "Email",
    "Status",
    "Marked At",
    "Latitude",
    "Longitude",
  ];

  const rows = records.map((record) => [
    record.student?.user?.name || "N/A",
    record.student?.studentCode || "N/A",
    record.student?.user?.email || "N/A",
    record.status || "N/A",
    record.markedAt ? new Date(record.markedAt).toLocaleString() : "N/A",
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

// Desktop Table Row Component
function DesktopAttendanceRow({ record }) {
  const isPresent = record?.status === "PRESENT";
  const student = record?.student;
  const user = student?.user;

  return (
    <TableRow className="hover:bg-gray-50 transition-colors">
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback
              className={`text-xs font-bold ${
                isPresent
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {user?.name?.charAt(0) || "S"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900">{user?.name || "N/A"}</p>
            <p className="text-xs text-gray-500">
              {student?.studentCode || "N/A"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>{student?.studentCode || "N/A"}</TableCell>
      <TableCell className="text-sm">{user?.email || "N/A"}</TableCell>
      <TableCell>
        <Badge
          className={`text-xs font-bold border-0 ${
            isPresent
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {isPresent ? (
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              PRESENT
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              ABSENT
            </span>
          )}
        </Badge>
      </TableCell>
      <TableCell className="text-sm whitespace-nowrap">
        {record?.markedAt
          ? new Date(record.markedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A"}
      </TableCell>
      <TableCell className="text-xs text-gray-500 font-mono">
        {record?.latitude
          ? `${record.latitude.toFixed(4)}, ${record.longitude?.toFixed(4)}`
          : "N/A"}
      </TableCell>
    </TableRow>
  );
}

// Mobile Card Component for Attendance
function MobileAttendanceCard({ record, index }) {
  const isPresent = record?.status === "PRESENT";
  const student = record?.student;
  const user = student?.user;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "S";

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarFallback
              className={`font-bold text-xs ${
                isPresent
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {user?.name || "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              {student?.studentCode || "N/A"}
            </p>
          </div>
        </div>
        <Badge
          className={`text-xs font-bold border-0 ${
            isPresent
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {isPresent ? "PRESENT" : "ABSENT"}
        </Badge>
      </div>

      <Separator className="my-2" />

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs">Email</span>
          <span className="text-gray-700 text-xs font-mono truncate max-w-[180px]">
            {user?.email || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs">Marked At</span>
          <span className="text-gray-700 text-xs">
            {record?.markedAt
              ? new Date(record.markedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"}
          </span>
        </div>
        {record?.latitude && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">Location</span>
            <span className="text-gray-700 text-xs font-mono">
              {record.latitude.toFixed(4)}, {record.longitude?.toFixed(4)}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SessionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [exporting, setExporting] = useState(false);

  // Fetch session details first
  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ["session-info", id],
    queryFn: async () => {
      // Try to get session info from the attendance endpoint first
      const res = await api.get(`/api/v1/attendance/session/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  // Fetch attendance records
  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ["session-attendance", id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/attendance/session/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    refetchInterval: 15000,
  });

  const records = attendanceData?.records || [];
  const sessionInfo = sessionData?.session || attendanceData?.session;

  // Calculate stats
  const presentCount = records.filter((r) => r?.status === "PRESENT").length;
  const absentCount = records.filter((r) => r?.status === "ABSENT").length;
  const totalStudents = records.length;
  const attendanceRate =
    totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : "0";

  // Session details from the session object
  const courseName = sessionInfo?.course?.name || "Session Details";
  const courseCode = sessionInfo?.course?.code || "";
  const department = sessionInfo?.course?.department || "";
  const sessionDate = sessionInfo?.date ? new Date(sessionInfo.date) : null;
  const startTime = sessionInfo?.startTime
    ? new Date(sessionInfo.startTime)
    : null;
  const endTime = sessionInfo?.endTime ? new Date(sessionInfo.endTime) : null;
  const radius = sessionInfo?.radiusMeters || 100;
  const isActive = endTime ? new Date() < endTime : false;

  const handleExport = () => {
    if (records.length === 0) {
      toast.error("No attendance records to export");
      return;
    }
    setExporting(true);
    exportToCSV(records, `${courseCode || "session"}_${id}`);
    setExporting(false);
  };

  const isLoading = sessionLoading || attendanceLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading session details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 pt-8 pb-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/sessions")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Sessions</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {isActive ? (
                  <Badge className="bg-emerald-100 text-emerald-700 border-0 font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                    LIVE SESSION
                  </Badge>
                ) : (
                  <Badge variant="secondary">COMPLETED</Badge>
                )}
              </div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {courseName}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {courseCode} • {department}
              </p>
            </div>

            {records.length > 0 && (
              <Button
                onClick={handleExport}
                disabled={exporting}
                variant="outline"
                className="gap-2 border-gray-200 hover:border-blue-200"
              >
                <Download className="w-4 h-4" />
                {exporting ? "Exporting..." : "Export CSV"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Session Info Card */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-gray-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-bold text-gray-900">
                      {sessionDate
                        ? sessionDate.toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Time</p>
                    <p className="text-sm font-bold text-gray-900">
                      {startTime && endTime
                        ? `${startTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} — ${endTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">GPS Radius</p>
                    <p className="text-sm font-bold text-gray-900">
                      {radius} meters
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Recorded</p>
                    <p className="text-sm font-bold text-gray-900">
                      {totalStudents} students
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Recorded",
              value: totalStudents,
              icon: Users,
              color: "blue",
              delay: 1,
            },
            {
              label: "Present",
              value: presentCount,
              icon: CheckCircle2,
              color: "emerald",
              delay: 2,
            },
            {
              label: "Absent",
              value: absentCount,
              icon: XCircle,
              color: "red",
              delay: 3,
            },
            {
              label: "Attendance Rate",
              value: `${attendanceRate}%`,
              icon: TrendingUp,
              color: "purple",
              delay: 4,
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={stat.delay}
              initial="hidden"
              animate="visible"
            >
              <Card className="border border-gray-100 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center`}
                    >
                      <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                    </div>
                  </div>
                  {stat.label === "Attendance Rate" && totalStudents > 0 && (
                    <div className="mt-3">
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                          style={{ width: `${attendanceRate}%` }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Attendance Records Section */}
        <motion.div
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="visible"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Attendance Records
                </CardTitle>
                <p className="text-xs text-gray-500 mt-1">
                  {totalStudents} student{totalStudents !== 1 ? "s" : ""}{" "}
                  recorded attendance
                </p>
              </div>
            </CardHeader>

            <CardContent>
              {records.length === 0 ? (
                <div className="py-16 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-semibold text-lg">
                    No attendance records yet
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Students will appear here when they mark attendance
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">
                            Student
                          </TableHead>
                          <TableHead className="font-semibold">
                            Student Code
                          </TableHead>
                          <TableHead className="font-semibold">Email</TableHead>
                          <TableHead className="font-semibold">
                            Status
                          </TableHead>
                          <TableHead className="font-semibold">Time</TableHead>
                          <TableHead className="font-semibold">
                            Location
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {records.map((record) => (
                          <DesktopAttendanceRow
                            key={record.id}
                            record={record}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-3">
                    {records.map((record, i) => (
                      <MobileAttendanceCard
                        key={record.id}
                        record={record}
                        index={i}
                      />
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Achievement / Summary Card */}
        {totalStudents > 0 && parseFloat(attendanceRate) >= 80 && (
          <motion.div
            variants={fadeUp}
            custom={6}
            initial="hidden"
            animate="visible"
            className="mt-6"
          >
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-none shadow-md">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      Great Attendance! 🎉
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {attendanceRate}% attendance rate for this session.
                      {presentCount} out of {totalStudents} students were
                      present.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
