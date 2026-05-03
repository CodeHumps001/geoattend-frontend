"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  ArrowLeft,
  PlayCircle,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Calendar,
  Loader2,
  TrendingUp,
  Navigation,
  Download,
  Award,
  Eye,
  Smartphone,
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
const exportToCSV = (records, session) => {
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
    record.status,
    new Date(record.markedAt).toLocaleString(),
    record.latitude?.toFixed(6) || "N/A",
    record.longitude?.toFixed(6) || "N/A",
  ]);

  const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance_${session?.course?.code || "session"}_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Attendance report exported successfully!");
};

// Desktop Table Row Component
function DesktopAttendanceRow({ record }) {
  const isPresent = record.status === "PRESENT";
  const student = record.student;
  const user = student?.user;

  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
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
      <TableCell>{user?.email || "N/A"}</TableCell>
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
        {new Date(record.markedAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </TableCell>
      <TableCell className="text-xs text-gray-500 font-mono">
        {record.latitude?.toFixed(4)}, {record.longitude?.toFixed(4)}
      </TableCell>
    </TableRow>
  );
}

// Mobile Card Component for Attendance
function MobileAttendanceCard({ record, index }) {
  const isPresent = record.status === "PRESENT";
  const student = record.student;
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
      className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
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
          <span className="text-gray-700 text-xs font-mono">
            {user?.email || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs">Marked At</span>
          <span className="text-gray-700 text-xs">
            {new Date(record.markedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
        {record.latitude && record.longitude && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500 text-xs">Location</span>
            <span className="text-gray-700 text-xs font-mono">
              {record.latitude?.toFixed(4)}, {record.longitude?.toFixed(4)}
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
  const [viewMode, setViewMode] = (useState < "mobile") | ("tablet" > "mobile");

  const { data, isLoading, error } = useQuery({
    queryKey: ["session-detail", id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/attendance/session/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    refetchInterval: 15000,
  });

  const records = data?.records || [];
  const session = records[0]?.session || data?.session;
  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const attendanceRate =
    records.length > 0
      ? ((presentCount / records.length) * 100).toFixed(1)
      : "0";

  const now = new Date();
  const isActive = session ? now < new Date(session.endTime) : false;

  const handleExport = () => {
    setExporting(true);
    exportToCSV(records, session);
    setExporting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Failed to load session
            </h2>
            <p className="text-gray-500">Please try again later</p>
            <Button onClick={() => router.back()} className="mt-4">
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 pt-8 pb-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.back()}
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
              <h1 className="text-2xl font-black text-gray-900">
                {session?.course?.name || "Session Details"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {session?.course?.code} • {session?.course?.department}
              </p>
            </div>

            {records.length > 0 && (
              <Button
                onClick={handleExport}
                disabled={exporting}
                variant="outline"
                className="gap-2"
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
          <Card className="border-2 border-gray-100 shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-bold text-gray-900">
                      {session
                        ? new Date(session.date).toLocaleDateString("en-GB", {
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
                      {session
                        ? `${new Date(session.startTime).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )} — ${new Date(session.endTime).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}`
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
                      {session?.radiusMeters || "—"} meters
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Enrolled</p>
                    <p className="text-sm font-bold text-gray-900">
                      {records.length} students
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
              label: "Total Students",
              value: records.length,
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
              <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
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
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Attendance Records
                </CardTitle>
                {isActive && (
                  <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
                    Live updating every 15 seconds
                  </p>
                )}
              </div>
              {records.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={viewMode === "mobile" ? "default" : "outline"}
                    onClick={() => setViewMode("mobile")}
                    className="rounded-full hidden sm:flex"
                  >
                    <Smartphone className="w-3 h-3 mr-1" />
                    Mobile
                  </Button>
                  <Button
                    size="sm"
                    variant={viewMode === "tablet" ? "default" : "outline"}
                    onClick={() => setViewMode("tablet")}
                    className="rounded-full hidden sm:flex"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Table
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent>
              {records.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-semibold text-lg">
                    No attendance records yet
                  </p>
                  {isActive && (
                    <p className="text-gray-400 text-sm mt-2">
                      Students will appear here when they mark attendance
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden sm:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Student Code</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Location</TableHead>
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
                  <div className="sm:hidden space-y-3">
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

        {/* Achievement / Summary Card (if high attendance) */}
        {attendanceRate && parseFloat(attendanceRate) >= 80 && (
          <motion.div
            variants={fadeUp}
            custom={6}
            initial="hidden"
            animate="visible"
            className="mt-6"
          >
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-none">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Great Attendance! 🎉
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {attendanceRate}% attendance rate. Keep up the good work!
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
