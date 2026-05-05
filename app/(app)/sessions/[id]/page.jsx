// app/(app)/sessions/[id]/page.jsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Download,
  RefreshCw,
  Loader2,
  Share2,
  Copy,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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

function AttendanceRow({ record }) {
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

  const studentCode = user?.studentId || "N/A";

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex items-center gap-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback
            className={`text-xs font-bold ${
              isPresent
                ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
            }`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white text-sm">
            {user?.name || "Unknown"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {studentCode}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {record?.latitude && record?.longitude && (
          <div className="hidden sm:block text-xs text-gray-500 dark:text-gray-400 font-mono">
            {record.latitude.toFixed(4)}, {record.longitude.toFixed(4)}
          </div>
        )}
        <Badge
          className={
            isPresent
              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          }
        >
          {isPresent ? "PRESENT" : "ABSENT"}
        </Badge>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
  };

  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        <div
          className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center`}
        >
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function SessionDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch session details - matches backend response structure
  const { data: response, isLoading } = useQuery({
    queryKey: ["session", id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/sessions/${id}`);
      return res.data.data; // { session: {...} }
    },
    enabled: !!id,
    refetchInterval: 10000,
  });

  const session = response?.session;

  const refreshData = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries(["session", id]);
    setRefreshing(false);
    toast.success("Attendance updated");
  };

  const exportAttendance = () => {
    if (!session?.attendance?.length) {
      toast.error("No attendance records to export");
      return;
    }

    const headers = [
      "Student Name",
      "Student Code",
      "Status",
      "Marked At",
      "Latitude",
      "Longitude",
    ];
    const rows = session.attendance.map((record) => [
      record.student?.user?.name || "N/A",
      record.student?.user?.studentId || "N/A",
      record.status,
      new Date(record.markedAt).toLocaleString(),
      record.latitude?.toFixed(6) || "N/A",
      record.longitude?.toFixed(6) || "N/A",
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
    toast.success("Attendance exported");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Session not found</p>
        <Button variant="ghost" onClick={() => router.back()} className="mt-4">
          Go back
        </Button>
      </div>
    );
  }

  const isLive = session.isOpen;
  const attendance = session.attendance || [];
  const presentCount = attendance.filter((a) => a.status === "PRESENT").length;
  const absentCount = attendance.filter((a) => a.status === "ABSENT").length;
  const totalStudents = attendance.length;
  const attendanceRate =
    totalStudents > 0 ? (presentCount / totalStudents) * 100 : 0;

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isLive && (
                <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                  LIVE SESSION
                </Badge>
              )}
              <Badge variant="outline">{session.course?.code}</Badge>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              {session.course?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(session.date).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(session.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {session.radiusMeters}m radius
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={refreshing}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportAttendance}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={copyLink}>
                <Copy className="w-4 h-4 mr-2" /> Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => window.open(window.location.href, "_blank")}
              >
                <Share2 className="w-4 h-4 mr-2" /> Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Present"
          value={presentCount}
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Absent"
          value={absentCount}
          icon={XCircle}
          color="red"
        />
        <StatCard
          title="Attendance Rate"
          value={`${Math.round(attendanceRate)}%`}
          icon={Calendar}
          color="purple"
        />
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">
              Attendance Progress
            </span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {Math.round(attendanceRate)}%
            </span>
          </div>
          <Progress value={attendanceRate} className="h-2" />
        </CardContent>
      </Card>

      {/* Attendance Records */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="all" className="flex-1">
            All ({totalStudents})
          </TabsTrigger>
          <TabsTrigger value="present" className="flex-1">
            Present ({presentCount})
          </TabsTrigger>
          <TabsTrigger value="absent" className="flex-1">
            Absent ({absentCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <Card>
            <CardContent className="p-4">
              {attendance.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">
                    No students have marked attendance yet
                  </p>
                  {isLive && (
                    <p className="text-sm text-gray-400 mt-1">
                      Waiting for students to check in...
                    </p>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {attendance.map((record) => (
                    <AttendanceRow key={record.id} record={record} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="present" className="mt-4">
          <Card>
            <CardContent className="p-4">
              {attendance.filter((a) => a.status === "PRESENT").length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No present students</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {attendance
                    .filter((a) => a.status === "PRESENT")
                    .map((record) => (
                      <AttendanceRow key={record.id} record={record} />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="absent" className="mt-4">
          <Card>
            <CardContent className="p-4">
              {attendance.filter((a) => a.status === "ABSENT").length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No absent students</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {attendance
                    .filter((a) => a.status === "ABSENT")
                    .map((record) => (
                      <AttendanceRow key={record.id} record={record} />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Real-time info card */}
      {isLive && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
              Live session • Auto-refreshes every 10 seconds
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
