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
        {record?.markedAt
          ? new Date(record.markedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
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
                  second: "2-digit",
                })
              : "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs">Location</span>
          <span className="text-gray-700 text-xs font-mono">
            {record?.latitude
              ? `${record.latitude.toFixed(4)}, ${record.longitude?.toFixed(4)}`
              : "N/A"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function SessionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [exporting, setExporting] = useState(false);

  // Fetch attendance records for this session
  const { data, isLoading, error } = useQuery({
    queryKey: ["session-detail", id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/attendance/session/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    refetchInterval: 15000,
  });

  // Extract records from the response
  const records = data?.records || [];
  const sessionId = data?.sessionId || id;
  const count = data?.count || 0;

  // Since the session info (course name, code, etc.) is not in this response,
  // we need to get it from the first record or fetch separately
  // For now, we'll extract what we can from the records
  const firstRecord = records[0];
  const courseName = firstRecord?.student?.course?.name || "Session";
  const courseCode = firstRecord?.student?.course?.code || "";

  // Calculate stats
  const presentCount = records.filter((r) => r?.status === "PRESENT").length;
  const absentCount = records.filter((r) => r?.status === "ABSENT").length;
  const attendanceRate =
    records.length > 0
      ? ((presentCount / records.length) * 100).toFixed(1)
      : "0";

  // Since we don't have session info with dates, we'll use placeholder or fetch separately
  const handleExport = () => {
    if (records.length === 0) {
      toast.error("No attendance records to export");
      return;
    }
    setExporting(true);
    exportToCSV(records, `session_${sessionId}`);
    setExporting(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Failed to load session
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Please try again later.
            </p>
            <Button onClick={() => router.push("/sessions")}>
              Back to Sessions
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
            onClick={() => router.push("/sessions")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Sessions</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Session #{sessionId}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {count} student{count !== 1 ? "s" : ""} recorded attendance
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
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Recorded",
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
            <CardHeader>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Attendance Records
                </CardTitle>
                <p className="text-xs text-gray-500 mt-1">
                  Students who have marked attendance for this session
                </p>
              </div>
            </CardHeader>

            <CardContent>
              {records.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
        {records.length > 0 && parseFloat(attendanceRate) >= 80 && (
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
                      {attendanceRate}% attendance rate for this session.
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
