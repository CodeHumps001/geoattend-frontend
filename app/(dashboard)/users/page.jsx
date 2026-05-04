"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  Search,
  Users,
  GraduationCap,
  UserCheck,
  Shield,
  ChevronRight,
  BookOpen,
  Plus,
  X,
  Loader2,
  Mail,
  Hash,
  Building,
  Filter,
  UserPlus,
  Clock,
  Award,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
    border: "border-blue-200 dark:border-blue-800",
    icon: GraduationCap,
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
  },
  LECTURER: {
    color: "from-emerald-500 to-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-800",
    icon: UserCheck,
    badge:
      "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
  },
  ADMIN: {
    color: "from-violet-500 to-violet-600",
    bg: "bg-violet-100 dark:bg-violet-900/30",
    text: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-800",
    icon: Shield,
    badge:
      "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300",
  },
};

function StatsCard({ title, value, icon: Icon, gradient, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="relative overflow-hidden border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
            </div>
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function UserCard({ user, index, onEnroll, onViewDetails }) {
  const config = roleConfig[user.role] || roleConfig.STUDENT;
  const Icon = config.icon;
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  const courseCount = user.student?.enrollments?.length || 0;

  const attendanceRate = user.student?.attendanceRate || 0;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2 }}
    >
      <Card className="border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white dark:bg-gray-900">
        <CardContent className="p-5" onClick={() => onViewDetails(user)}>
          <div className="flex items-start gap-4">
            <Avatar className="w-14 h-14 flex-shrink-0 ring-2 ring-offset-2 ring-indigo-100 dark:ring-indigo-900">
              <AvatarFallback
                className={`bg-gradient-to-br ${config.color} text-white font-bold text-base`}
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-1">
                <p className="font-bold text-gray-900 dark:text-white text-base truncate">
                  {user.name}
                </p>
                <Badge className={`text-xs font-bold border-0 ${config.badge}`}>
                  <Icon className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {user.email}
                </span>
                {user.student?.studentCode && (
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {user.student.studentCode}
                  </span>
                )}
                {user.lecturer?.staffCode && (
                  <span className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    {user.lecturer.staffCode}
                  </span>
                )}
              </div>

              {user.student && (
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {courseCount} Course{courseCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {attendanceRate}% Attendance
                    </span>
                  </div>
                  <div className="h-2 w-16 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                      style={{ width: `${attendanceRate}%` }}
                    />
                  </div>
                </div>
              )}

              {user.lecturer && (
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {user.lecturer.department}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    Staff Member
                  </span>
                </div>
              )}
            </div>

            {user.role === "STUDENT" && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onEnroll(user);
                }}
                className="flex-shrink-0 h-9 px-3 text-xs font-semibold border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Enroll
              </Button>
            )}
          </div>

          {user.student?.enrollments?.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Enrolled Courses
              </p>
              <div className="flex flex-wrap gap-2">
                {user.student.enrollments.slice(0, 3).map((e) => (
                  <span
                    key={e.id}
                    className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full font-medium"
                  >
                    {e.course?.code}
                  </span>
                ))}
                {user.student.enrollments.length > 3 && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full font-medium">
                    +{user.student.enrollments.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function UserDetailModal({ user, isOpen, onClose }) {
  if (!user) return null;

  const config = roleConfig[user.role] || roleConfig.STUDENT;
  const Icon = config.icon;
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
                  <Badge className={`mt-1 ${config.badge}`}>
                    <Icon className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
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

  const stats = {
    total: allUsers.length,
    students: allUsers.filter((u) => u.role === "STUDENT").length,
    lecturers: allUsers.filter((u) => u.role === "LECTURER").length,
    admins: allUsers.filter((u) => u.role === "ADMIN").length,
  };

  const handleEnrollSuccess = () => {
    refetchStudents();
    queryClient.invalidateQueries({ queryKey: ["all-students-full"] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 pt-8 pb-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Manage students, lecturers, and administrators
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total Users"
              value={stats.total}
              icon={Users}
              gradient="from-gray-500 to-gray-600"
              delay={0}
            />
            <StatsCard
              title="Students"
              value={stats.students}
              icon={GraduationCap}
              gradient="from-blue-500 to-blue-600"
              delay={1}
            />
            <StatsCard
              title="Lecturers"
              value={stats.lecturers}
              icon={UserCheck}
              gradient="from-emerald-500 to-emerald-600"
              delay={2}
            />
            <StatsCard
              title="Admins"
              value={stats.admins}
              icon={Shield}
              gradient="from-violet-500 to-violet-600"
              delay={3}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, or student code..."
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-400 dark:focus:ring-blue-500 transition-all"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-blue-400 dark:focus:border-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="LECTURER">Lecturers</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {loadingStudents ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="animate-pulse border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800" />
                    <div className="flex-1">
                      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded w-48 mb-2" />
                      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-64" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="text-center py-16 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardContent>
              <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">
                No users found
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                {search
                  ? "Try a different search term"
                  : "No users registered yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user, i) => (
              <UserCard
                key={user.id}
                user={user}
                index={i}
                onEnroll={setEnrollTarget}
                onViewDetails={setSelectedUser}
              />
            ))}
          </div>
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
