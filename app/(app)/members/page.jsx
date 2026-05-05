// app/(app)/members/page.jsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  UserPlus,
  MoreVertical,
  Mail,
  Trash2,
  Download,
  Loader2,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Yeseva_One } from "next/font/google";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05 },
  }),
};

function StudentCard({ student, onRemove, onViewDetails }) {
  const initials =
    student.user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "S";

  const attendanceRate = student.attendanceRate || 0;
  const getStatusColor = () => {
    if (attendanceRate >= 75) return "text-emerald-600 dark:text-emerald-400";
    if (attendanceRate >= 50) return "text-amber-600 dark:text-amber-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusBadge = () => {
    if (attendanceRate >= 75)
      return {
        text: "Good Standing",
        color:
          "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
      };
    if (attendanceRate >= 50)
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

  const status = getStatusBadge();

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2 }}
      className="cursor-pointer"
      onClick={() => onViewDetails(student)}
    >
      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {student.user?.name}
                  </p>
                  <Badge className={status.color}>{status.text}</Badge>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {student.studentCode}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {student.email}
                </p>
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
                    onViewDetails(student);
                  }}
                >
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `mailto:${student.email}`;
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" /> Send Email
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(student);
                  }}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Attendance Rate</span>
              </div>
              <span className={`text-sm font-semibold ${getStatusColor()}`}>
                {attendanceRate}%
              </span>
            </div>
            <Progress value={attendanceRate} className="h-1.5" />
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Joined:{" "}
                {new Date(
                  student.createdAt || student.user?.createdAt,
                ).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StudentDetailModal({ student, isOpen, onClose }) {
  if (!student) return null;

  const attendanceRate = student.attendanceRate || 0;
  const presentCount = student.presentCount || 0;
  const totalSessions = student.totalSessions || 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
          <DialogDescription>
            Complete attendance information for {student.user?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
            <Avatar className="w-12 h-12">
              <AvatarFallback className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-lg">
                {student.user?.name?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {student.user?.name}
              </p>
              <p className="text-sm text-gray-500">{student.studentCode}</p>
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

function AddStudentModal({ isOpen, onClose, onSuccess, classCode }) {
  const [loading, setLoading] = useState(false);
  const [studentCode, setStudentCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/v1/students/enroll", {
        studentCode,
        classCode,
      });
      toast.success("Student enrolled successfully!");
      onSuccess();
      onClose();
      setStudentCode("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to enroll student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Student</DialogTitle>
          <DialogDescription>
            Enroll a student using their student ID or email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label>Student ID or Email</Label>
            <Input
              placeholder="e.g., KsTU/CS/21/001 or student@example.com"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Enroll Student
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function MembersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToRemove, setStudentToRemove] = useState(null);

  // Fetch class space with students
  const { data: classSpace, isLoading } = useQuery({
    queryKey: ["class-students"],
    queryFn: async () => {
      const classSpaceId = user?.courseRep?.classSpaceId;
      if (!classSpaceId) return null;
      const res = await api.get(`/api/v1/class/${classSpaceId}/students`);
      return res.data.data;
    },
    enabled: !!user?.courseRep?.classSpaceId,
  });

  const students = classSpace?.students || [];
  const classCode = classSpace?.classCode;

  // Remove student mutation
  const removeMutation = useMutation({
    mutationFn: async (studentId) => {
      await api.delete(`/api/v1/students/${studentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["class-students"]);
      toast.success("Student removed from class");
      setStudentToRemove(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to remove student");
    },
  });

  const filteredStudents = students.filter(
    (s) =>
      s.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode?.toLowerCase().includes(search.toLowerCase()) ||
      s.user?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const exportData = () => {
    const headers = [
      "Name",
      "Student Code",
      "Email",
      "Attendance Rate",
      "Joined Date",
    ];
    const rows = students.map((s) => [
      s.user?.name,
      s.studentCode,
      s.user?.email,
      `${s.attendanceRate || 0}%`,
      new Date(s.createdAt || s.user?.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `students_${classCode}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Students exported");
  };

  const stats = {
    total: students.length,
    active: students.filter((s) => (s.attendanceRate || 0) >= 75).length,
    atRisk: students.filter(
      (s) => (s.attendanceRate || 0) >= 50 && (s.attendanceRate || 0) < 75,
    ).length,
    critical: students.filter((s) => (s.attendanceRate || 0) < 50).length,
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Class Members
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage students in your class
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="gap-2">
            <UserPlus className="w-4 h-4" />
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Good Standing</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {stats.active}
                </p>
              </div>
              <Award className="w-5 h-5 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">At Risk</p>
                <p className="text-2xl font-bold text-amber-600">
                  {stats.atRisk}
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Critical</p>
                <p className="text-2xl font-bold text-red-600">
                  {stats.critical}
                </p>
              </div>
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name, student ID, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Students List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-full" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-2" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                  </div>
                </div>
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
                : "Share your class code to get started"}
            </p>
            {classCode && !search && (
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg inline-block">
                <p className="text-xs text-gray-500">Class Code</p>
                <code className="text-sm font-mono font-bold">{classCode}</code>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStudents.map((student, i) => (
            <StudentCard
              key={student.id}
              student={student}
              onRemove={setStudentToRemove}
              onViewDetails={setSelectedStudent}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddStudentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => queryClient.invalidateQueries(["class-students"])}
        classCode={classCode}
      />

      <StudentDetailModal
        student={selectedStudent}
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />

      <Dialog
        open={!!studentToRemove}
        onOpenChange={() => setStudentToRemove(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Remove Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove "{studentToRemove?.user?.name}"
              from the class? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setStudentToRemove(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => removeMutation.mutate(studentToRemove?.id)}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
