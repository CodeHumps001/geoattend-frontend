// app/(app)/members/page.jsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  Mail,
  MoreVertical,
  UserX,
  UserCheck,
  Calendar,
  TrendingUp,
  Award,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Progress } from "@/components/ui/progress";
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

function StatsCard({ title, value, icon: Icon, color }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {value}
            </p>
          </div>
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StudentDetailModal({ student, isOpen, onClose }) {
  if (!student) return null;

  const attendanceRate = student.attendanceRate || 0;
  const totalSessions = student.totalSessions || 0;
  const presentCount = student.presentCount || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
          <DialogDescription>
            Complete information about {student.user?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg font-bold">
                {student.user?.name?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {student.user?.name}
              </p>
              <p className="text-sm text-gray-500">{student.user?.studentId}</p>
              <p className="text-xs text-gray-400">{student.user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {attendanceRate}%
              </p>
              <p className="text-xs text-gray-500">Attendance Rate</p>
            </div>
            <div className="p-3 text-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {presentCount}/{totalSessions}
              </p>
              <p className="text-xs text-gray-500">Sessions Attended</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">
                Overall Progress
              </span>
              <span className="font-semibold">{attendanceRate}%</span>
            </div>
            <Progress value={attendanceRate} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function MembersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch class space with students
  const { data: response, isLoading } = useQuery({
    queryKey: ["class-members"],
    queryFn: async () => {
      const res = await api.get("/api/v1/class/me");
      return res.data.data; // { classSpace: {...} }
    },
    enabled: !!user,
  });

  const classSpace = response?.classSpace;
  const students = classSpace?.students || [];

  // Calculate attendance stats for each student
  const studentsWithStats = students.map((student) => {
    const attendanceRecords = student.attendance || [];
    const totalSessions = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(
      (a) => a.status === "PRESENT",
    ).length;
    const attendanceRate =
      totalSessions > 0 ? Math.round((presentCount / totalSessions) * 100) : 0;

    return {
      ...student,
      attendanceRate,
      presentCount,
      totalSessions,
    };
  });

  // Filter students by search
  const filteredStudents = studentsWithStats.filter(
    (s) =>
      s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.user?.studentId?.toLowerCase().includes(search.toLowerCase()),
  );

  const totalStudents = students.length;
  const avgAttendance =
    studentsWithStats.length > 0
      ? Math.round(
          studentsWithStats.reduce((acc, s) => acc + s.attendanceRate, 0) /
            studentsWithStats.length,
        )
      : 0;
  const goodStanding = studentsWithStats.filter(
    (s) => s.attendanceRate >= 75,
  ).length;
  const atRisk = studentsWithStats.filter(
    (s) => s.attendanceRate >= 50 && s.attendanceRate < 75,
  ).length;
  const critical = studentsWithStats.filter(
    (s) => s.attendanceRate < 50,
  ).length;

  const getStatusBadge = (rate) => {
    if (rate >= 75)
      return {
        text: "Good",
        color:
          "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
      };
    if (rate >= 50)
      return {
        text: "At Risk",
        color:
          "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
      };
    return {
      text: "Critical",
      color: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    };
  };

  const sendEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Class Members
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Manage and monitor all students in your class
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Avg Attendance"
          value={`${avgAttendance}%`}
          icon={TrendingUp}
          color="emerald"
        />
        <StatsCard
          title="Good Standing"
          value={goodStanding}
          icon={Award}
          color="purple"
        />
        <StatsCard
          title="At Risk"
          value={atRisk}
          icon={AlertCircle}
          color="orange"
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name, email, or student ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              {search ? "No students found" : "No students yet"}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {search
                ? "Try a different search term"
                : "Share your class code to get students to join"}
            </p>
            {classSpace?.classCode && !search && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg inline-block">
                <p className="text-xs text-gray-500">Class Code</p>
                <code className="text-sm font-mono font-bold">
                  {classSpace.classCode}
                </code>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const status = getStatusBadge(student.attendanceRate);
                return (
                  <TableRow
                    key={student.id}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold">
                            {student.user?.name?.charAt(0) || "S"}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {student.user?.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {student.user?.studentId || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {student.user?.email}
                    </TableCell>
                    <TableCell>
                      <Badge className={status.color}>{status.text}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                          {student.attendanceRate}%
                        </span>
                        <div className="w-16">
                          <Progress
                            value={student.attendanceRate}
                            className="h-1.5"
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          asChild
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudent(student);
                            }}
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              sendEmail(student.user?.email);
                            }}
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Student Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
