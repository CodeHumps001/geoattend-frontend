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
import { Skeleton } from "@/components/ui/skeleton";
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

const exportToCSV = (records, label) => {
  if (!records?.length) {
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
  const rows = records.map((r) => [
    r.student?.user?.name || "N/A",
    r.student?.studentCode || "N/A",
    r.student?.user?.email || "N/A",
    r.status || "N/A",
    r.markedAt ? new Date(r.markedAt).toLocaleString() : "N/A",
    r.latitude?.toFixed(6) || "N/A",
    r.longitude?.toFixed(6) || "N/A",
  ]);
  const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance_${label}_${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Attendance exported!");
};

function MobileAttendanceCard({ record, index }) {
  const isPresent = record?.status === "PRESENT";
  const user = record?.student?.user;
  const student = record?.student;
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
      className={`rounded-2xl border-2 p-4 transition-all ${
        isPresent
          ? "border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20"
          : "border-red-100 dark:border-red-900/50 bg-red-50/30 dark:bg-red-950/20"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarFallback
              className={`font-bold text-xs ${
                isPresent
                  ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
              }`}
            >
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {student?.studentCode}
            </p>
          </div>
        </div>
        <Badge
          className={`text-xs font-bold border-0 ${
            isPresent
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
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
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-gray-400 dark:text-gray-500">Marked at</p>
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            {record?.markedAt
              ? new Date(record.markedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })
              : "—"}
          </p>
        </div>
        {record?.latitude && (
          <div>
            <p className="text-gray-400 dark:text-gray-500">Location</p>
            <p className="text-gray-700 dark:text-gray-300 font-mono">
              {record.latitude.toFixed(4)}, {record.longitude?.toFixed(4)}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SessionDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  // Single API call — returns both session and records
  const { data, isLoading } = useQuery({
    queryKey: ["session-detail", id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/attendance/session/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    refetchInterval: 15000,
  });

  const records = data?.records || [];
  const session = data?.session;

  const presentCount = records.filter((r) => r?.status === "PRESENT").length;
  const absentCount = records.filter((r) => r?.status === "ABSENT").length;
  const attendanceRate =
    records.length > 0
      ? ((presentCount / records.length) * 100).toFixed(1)
      : "0";

  const now = new Date();
  const isLive = session
    ? now >= new Date(session.startTime) && now <= new Date(session.endTime)
    : false;

  const courseLabel = `${session?.course?.code || "session"}_${id}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 pt-10 sm:pt-12 pb-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push("/sessions")}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Sessions</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                {isLive ? (
                  <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0 font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                    LIVE SESSION
                  </Badge>
                ) : (
                  <Badge variant="secondary">COMPLETED</Badge>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                {session?.course?.name || "Session Details"}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                {session?.course?.code}
                {session?.course?.department &&
                  ` · ${session.course.department}`}
              </p>
            </div>
            {records.length > 0 && (
              <Button
                onClick={() => exportToCSV(records, courseLabel)}
                variant="outline"
                size="sm"
                className="gap-2 border-gray-200 dark:border-gray-700 self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-5 sm:space-y-6">
        {/* Session Info */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
            <CardContent className="p-5 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    icon: Calendar,
                    label: "Date",
                    value: session?.date
                      ? new Date(session.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—",
                    color: "blue",
                  },
                  {
                    icon: Clock,
                    label: "Time",
                    value:
                      session?.startTime && session?.endTime
                        ? `${new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} — ${new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                        : "—",
                    color: "orange",
                  },
                  {
                    icon: MapPin,
                    label: "GPS Radius",
                    value: session?.radiusMeters
                      ? `${session.radiusMeters} metres`
                      : "—",
                    color: "emerald",
                  },
                  {
                    icon: UserCheck,
                    label: "Recorded",
                    value: `${records.length} students`,
                    color: "violet",
                  },
                ].map(({ icon: Icon, label, value, color }) => {
                  const colorMap = {
                    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
                    orange:
                      "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
                    emerald:
                      "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
                    violet:
                      "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
                  };
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[color]}`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {label}
                        </p>
                        <p className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white leading-tight">
                          {value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {[
            {
              label: "Total",
              value: records.length,
              gradient: "from-blue-500 to-blue-600",
              icon: Users,
              delay: 1,
            },
            {
              label: "Present",
              value: presentCount,
              gradient: "from-emerald-500 to-emerald-600",
              icon: CheckCircle2,
              delay: 2,
            },
            {
              label: "Absent",
              value: absentCount,
              gradient: "from-red-500 to-red-600",
              icon: XCircle,
              delay: 3,
            },
            {
              label: "Rate",
              value: `${attendanceRate}%`,
              gradient: "from-violet-500 to-violet-600",
              icon: TrendingUp,
              delay: 4,
            },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={stat.delay}
                initial="hidden"
                animate="visible"
              >
                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-md transition-all">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {stat.label}
                        </p>
                        <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white mt-0.5">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-md`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                    </div>
                    {stat.label === "Rate" && records.length > 0 && (
                      <div className="mt-2 w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full"
                          style={{ width: `${attendanceRate}%` }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Attendance Records */}
        <motion.div
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="visible"
        >
          <Card className="border-0 shadow-lg bg-white dark:bg-gray-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                  Attendance Records
                  <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
                    ({records.length})
                  </span>
                </CardTitle>
                {isLive && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Live updating
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {records.length === 0 ? (
                <div className="py-14 text-center">
                  <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-7 h-7 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-semibold">
                    No attendance records yet
                  </p>
                  {isLive && (
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                      Students will appear here as they mark in · auto-refreshes
                      every 15s
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                          {[
                            "Student",
                            "Code",
                            "Email",
                            "Status",
                            "Time",
                            "GPS Location",
                          ].map((h) => (
                            <TableHead
                              key={h}
                              className="font-semibold text-gray-700 dark:text-gray-300 text-xs"
                            >
                              {h}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {records.map((record) => {
                          const isPresent = record?.status === "PRESENT";
                          const user = record?.student?.user;
                          const student = record?.student;
                          const initials =
                            user?.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2) || "S";
                          return (
                            <TableRow
                              key={record.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                            >
                              <TableCell>
                                <div className="flex items-center gap-2.5">
                                  <Avatar className="w-8 h-8">
                                    <AvatarFallback
                                      className={`text-xs font-bold ${isPresent ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}
                                    >
                                      {initials}
                                    </AvatarFallback>
                                  </Avatar>
                                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                    {user?.name}
                                  </p>
                                </div>
                              </TableCell>
                              <TableCell className="text-xs font-mono text-gray-600 dark:text-gray-300">
                                {student?.studentCode}
                              </TableCell>
                              <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                                {user?.email}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  className={`text-xs font-bold border-0 ${isPresent ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400" : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"}`}
                                >
                                  {isPresent ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                      PRESENT
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="w-3 h-3 mr-1" />
                                      ABSENT
                                    </>
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap">
                                {record?.markedAt
                                  ? new Date(
                                      record.markedAt,
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      second: "2-digit",
                                    })
                                  : "—"}
                              </TableCell>
                              <TableCell className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                {record?.latitude
                                  ? `${record.latitude.toFixed(4)}, ${record.longitude?.toFixed(4)}`
                                  : "—"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards */}
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

        {/* Achievement card */}
        {records.length > 0 && parseFloat(attendanceRate) >= 75 && (
          <motion.div
            variants={fadeUp}
            custom={6}
            initial="hidden"
            animate="visible"
          >
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-none shadow-md">
              <CardContent className="p-4 sm:p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">
                    Great Session Attendance! 🎉
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                    {attendanceRate}% attendance — {presentCount} of{" "}
                    {records.length} students were present.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
