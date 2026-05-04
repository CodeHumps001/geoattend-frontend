"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  Search,
  Users,
  GraduationCap,
  UserCheck,
  Shield,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Plus,
  X,
  Loader2,
  Mail,
  Hash,
  Building,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const roleConfig = {
  STUDENT: {
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  },
  LECTURER: {
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300",
    badge:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  },
  ADMIN: {
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-100 dark:bg-violet-900/30",
    text: "text-violet-700 dark:text-violet-300",
    badge:
      "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
  },
};

// User Detail Modal
function UserDetailModal({ user, isOpen, onClose }) {
  if (!user) return null;

  const config = roleConfig[user.role] || roleConfig.STUDENT;
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Avatar className="w-10 h-10">
              <AvatarFallback
                className={`bg-gradient-to-br ${config.color} text-white`}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            {user.name}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Detailed information about {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-sm font-semibold text-gray-900 dark:text-white">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Email
                  </p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Role
                  </p>
                  <Badge className={`mt-1 ${config.badge}`}>{user.role}</Badge>
                </div>
                {user.student?.studentCode && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Student Code
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.student.studentCode}
                    </p>
                  </div>
                )}
                {user.student?.department && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Department
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.student.department}
                    </p>
                  </div>
                )}
                {user.student?.level && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Level
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Level {user.student.level}
                    </p>
                  </div>
                )}
                {user.lecturer?.staffCode && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Staff Code
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.lecturer.staffCode}
                    </p>
                  </div>
                )}
                {user.lecturer?.department && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Department
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.lecturer.department}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {user.student?.enrollments?.length > 0 && (
            <Card className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2 text-gray-900 dark:text-white">
                  <BookOpen className="w-4 h-4" />
                  Enrolled Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.student.enrollments.map((e) => (
                    <div
                      key={e.id}
                      className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {e.course?.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {e.course?.code} • {e.course?.department}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
                      >
                        Enrolled
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Enroll Modal
function EnrollModal({ student, isOpen, onClose, onSuccess }) {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [enrolling, setEnrolling] = useState(false);

  const { data: coursesData } = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data;
    },
  });

  const courses = coursesData?.courses || [];
  const enrolledCourseIds =
    student?.student?.enrollments?.map((e) => e.courseId) || [];
  const availableCourses = courses.filter(
    (c) => !enrolledCourseIds.includes(c.id),
  );

  const handleEnroll = async () => {
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }
    if (!student || !student.student) {
      toast.error("Student information not available");
      return;
    }

    setEnrolling(true);
    try {
      await api.post("/api/v1/courses/enroll", {
        studentId: student.student.id,
        courseId: Number(selectedCourseId),
      });
      toast.success(`${student.name} enrolled successfully!`);
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            Enroll Student
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            Enroll {student?.name || "Student"} in a course
          </DialogDescription>
        </DialogHeader>

        {student?.student?.enrollments?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Currently enrolled in:
            </p>
            <div className="flex flex-wrap gap-2">
              {student.student.enrollments.map((e) => (
                <span
                  key={e.id}
                  className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full"
                >
                  {e.course?.code}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label className="text-gray-700 dark:text-gray-300 font-semibold">
              Select Course
            </Label>
            <Select
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Choose a course..." />
              </SelectTrigger>
              <SelectContent>
                {availableCourses.length === 0 ? (
                  <SelectItem value="none" disabled>
                    No available courses
                  </SelectItem>
                ) : (
                  availableCourses.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.code} — {c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleEnroll}
            disabled={enrolling || !selectedCourseId}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
          >
            {enrolling ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Enrolling...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Enroll in Course
              </span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [enrollTarget, setEnrollTarget] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {
    data: studentsData,
    isLoading: loadingStudents,
    refetch: refetchStudents,
  } = useQuery({
    queryKey: ["all-students-full"],
    queryFn: async () => {
      const res = await api.get("/api/v1/students");
      return res.data.data;
    },
  });

  const students = studentsData?.students || [];
  const allUsers = students.map((s) => ({
    ...s.user,
    student: s,
  }));

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.student?.studentCode?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleEnrollSuccess = () => {
    refetchStudents();
    queryClient.invalidateQueries({ queryKey: ["all-students-full"] });
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const getRoleBadge = (role) => {
    if (role === "STUDENT")
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300";
    if (role === "LECTURER")
      return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300";
    return "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header - Clean and simple */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="px-4 py-4">
          <h1 className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
            Manage students, lecturers, and administrators
          </p>
        </div>
      </div>

      {/* Search and Filter - Full width */}
      <div className="sticky top-[73px] z-30 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or student code..."
              className="pl-9 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl h-10 text-sm"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="LECTURER">Lecturers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {/* Users List - Full width, main content */}
      <div className="px-4 py-4">
        {loadingStudents ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-semibold">
              No users found
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {search
                ? "Try a different search term"
                : "No users registered yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View - Full width cards */}
            <div className="md:hidden space-y-3">
              {paginatedUsers.map((user) => (
                <Card
                  key={user.id}
                  className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="flex items-center gap-3 flex-1"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <Badge className={getRoleBadge(user.role)}>
                        {user.role === "STUDENT"
                          ? "Student"
                          : user.role === "LECTURER"
                            ? "Lecturer"
                            : "Admin"}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {user.student?.studentCode ||
                        user.lecturer?.staffCode ||
                        "-"}
                    </div>

                    <div className="flex gap-2">
                      {user.role === "STUDENT" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEnrollTarget(user)}
                          className="flex-1 h-9 text-xs border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Enroll
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedUser(user)}
                        className="flex-1 h-9 text-xs"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                    <TableHead className="font-semibold">User</TableHead>
                    <TableHead className="font-semibold">Email</TableHead>
                    <TableHead className="font-semibold">Role</TableHead>
                    <TableHead className="font-semibold">Details</TableHead>
                    <TableHead className="font-semibold text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    >
                      <TableCell onClick={() => setSelectedUser(user)}>
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell
                        onClick={() => setSelectedUser(user)}
                        className="text-gray-600 dark:text-gray-400"
                      >
                        {user.email}
                      </TableCell>
                      <TableCell onClick={() => setSelectedUser(user)}>
                        <Badge className={getRoleBadge(user.role)}>
                          {user.role === "STUDENT"
                            ? "Student"
                            : user.role === "LECTURER"
                              ? "Lecturer"
                              : "Admin"}
                        </Badge>
                      </TableCell>
                      <TableCell
                        onClick={() => setSelectedUser(user)}
                        className="text-sm text-gray-500 dark:text-gray-400"
                      >
                        {user.student?.studentCode ||
                          user.lecturer?.staffCode ||
                          "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {user.role === "STUDENT" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEnrollTarget(user);
                            }}
                            className="h-8 px-3 text-xs border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Enroll
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedUser(user)}
                          className="h-8 px-3 ml-1"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination - Compact */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {filteredUsers.length} total
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <UserDetailModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
      />
      <EnrollModal
        student={enrollTarget}
        isOpen={!!enrollTarget}
        onClose={() => setEnrollTarget(null)}
        onSuccess={handleEnrollSuccess}
      />
    </div>
  );
}
