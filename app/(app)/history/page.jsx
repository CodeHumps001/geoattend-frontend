// app/(app)/history/page.jsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Download,
  Search,
  Filter,
  TrendingUp,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

function StatsCard({ title, value, icon: Icon, gradient }) {
  return (
    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {value}
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AttendanceRecordCard({ record }) {
  const router = useRouter();
  const isPresent = record.status === "PRESENT";
  const session = record.session;
  const course = session?.course;

  return (
    <div
      onClick={() => router.push(`/sessions/${session?.id}`)}
      className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-all"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isPresent ? "bg-emerald-500" : "bg-red-500"
          }`}
        >
          {isPresent ? (
            <CheckCircle2 className="w-5 h-5 text-white" />
          ) : (
            <XCircle className="w-5 h-5 text-white" />
          )}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900 dark:text-white">
              {course?.name}
            </p>
            <Badge variant="outline" className="text-xs font-mono">
              {course?.code}
            </Badge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(session?.date).toLocaleDateString()}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(session?.startTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>
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
  );
}

export default function HistoryPage() {
  const { user, isStudent } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetch attendance history
  const { data: attendanceData, isLoading } = useQuery({
    queryKey: ["attendance-history"],
    queryFn: async () => {
      const res = await api.get("/api/v1/attendance/me");
      return res.data.data;
    },
    enabled: !!user,
  });

  const attendance = attendanceData?.attendance || [];
  const stats = attendanceData?.stats || [];
  const totalRecords = attendanceData?.totalRecords || 0;
  const totalPresent = attendanceData?.totalPresent || 0;
  const attendanceRate =
    totalRecords > 0 ? Math.round((totalPresent / totalRecords) * 100) : 0;

  // Get unique courses for filter
  const uniqueCourses = [
    ...new Map(
      stats.map((stat) => [
        stat.courseId,
        { id: stat.courseId, name: stat.courseName, code: stat.courseCode },
      ]),
    ).values(),
  ];

  // Filter records
  const filteredRecords = attendance.filter((record) => {
    const course = record.session?.course;
    const matchesSearch =
      course?.name?.toLowerCase().includes(search.toLowerCase()) ||
      course?.code?.toLowerCase().includes(search.toLowerCase());
    const matchesCourse =
      courseFilter === "all" || course?.id === parseInt(courseFilter);
    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;
    return matchesSearch && matchesCourse && matchesStatus;
  });

  const exportHistory = () => {
    if (filteredRecords.length === 0) {
      toast.error("No records to export");
      return;
    }

    const headers = [
      "Course Name",
      "Course Code",
      "Date",
      "Time",
      "Status",
      "Marked At",
      "Location",
    ];
    const rows = filteredRecords.map((record) => {
      const session = record.session;
      const course = session?.course;
      return [
        course?.name || "N/A",
        course?.code || "N/A",
        new Date(session?.date).toLocaleDateString(),
        new Date(session?.startTime).toLocaleTimeString(),
        record.status,
        new Date(record.markedAt).toLocaleString(),
        record.latitude && record.longitude
          ? `${record.latitude.toFixed(4)}, ${record.longitude.toFixed(4)}`
          : "N/A",
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance_history_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("History exported");
  };

  if (!isStudent) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">This page is only for students</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Attendance History
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          View all your attendance records and track your progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Total Sessions"
          value={totalRecords}
          icon={Calendar}
          gradient="from-blue-500 to-blue-600"
        />
        <StatsCard
          title="Present"
          value={totalPresent}
          icon={CheckCircle2}
          gradient="from-emerald-500 to-emerald-600"
        />
        <StatsCard
          title="Absent"
          value={totalRecords - totalPresent}
          icon={XCircle}
          gradient="from-red-500 to-red-600"
        />
        <StatsCard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={TrendingUp}
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      {/* Progress Overview */}
      {attendanceRate > 0 && (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-0">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Overall Attendance
              </span>
              <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                {attendanceRate}%
              </span>
            </div>
            <Progress value={attendanceRate} className="h-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {totalPresent} out of {totalRecords} sessions attended
            </p>
          </CardContent>
        </Card>
      )}

      {/* Course Stats */}
      {stats.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Course Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {stats.map((stat) => {
              const percentage = parseFloat(stat.percentage);
              const color =
                percentage >= 75
                  ? "emerald"
                  : percentage >= 50
                    ? "amber"
                    : "red";
              return (
                <Card
                  key={stat.courseId}
                  className="border border-gray-200 dark:border-gray-800"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {stat.courseName}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                          {stat.courseCode}
                        </p>
                      </div>
                      <Badge
                        className={
                          percentage >= 75
                            ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                            : percentage >= 50
                              ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                        }
                      >
                        {stat.percentage}
                      </Badge>
                    </div>
                    <Progress value={percentage} className="h-1.5 mb-2" />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{stat.present} present</span>
                      <span>{stat.absent} absent</span>
                      <span>{stat.total} total</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters and Export */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by course name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={courseFilter} onValueChange={setCourseFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by course" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Courses</SelectItem>
            {uniqueCourses.map((course) => (
              <SelectItem key={course.id} value={course.id.toString()}>
                {course.code} - {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PRESENT">Present</SelectItem>
            <SelectItem value="ABSENT">Absent</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={exportHistory}
          disabled={filteredRecords.length === 0}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Records Table - Desktop */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-gray-200 dark:bg-gray-800 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredRecords.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No attendance records found
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {search || courseFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Start marking attendance to see your history"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Marked At</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => {
                  const session = record.session;
                  const course = session?.course;
                  const isPresent = record.status === "PRESENT";
                  return (
                    <TableRow
                      key={record.id}
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      onClick={() => router.push(`/sessions/${session?.id}`)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {course?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                            {course?.code}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(session?.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(session?.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            isPresent
                              ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                          }
                        >
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(record.markedAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-gray-500 font-mono">
                        {record.latitude && record.longitude
                          ? `${record.latitude.toFixed(4)}, ${record.longitude.toFixed(4)}`
                          : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {filteredRecords.map((record) => (
              <AttendanceRecordCard key={record.id} record={record} />
            ))}
          </div>
        </>
      )}

      {/* Summary Card */}
      {filteredRecords.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-0">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Attendance Summary
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  You have attended {totalPresent} out of {totalRecords}{" "}
                  sessions ({attendanceRate}% attendance rate).
                  {attendanceRate >= 75
                    ? " Great job! Keep it up! 🎉"
                    : attendanceRate >= 50
                      ? " You're doing okay, but try to improve your attendance."
                      : " Your attendance is below 50%. Please attend more classes!"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
