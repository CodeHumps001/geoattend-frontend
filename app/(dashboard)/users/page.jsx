"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

const roleConfig = {
  STUDENT: { color: "bg-blue-100 text-blue-700", icon: GraduationCap },
  LECTURER: { color: "bg-emerald-100 text-emerald-700", icon: UserCheck },
  ADMIN: { color: "bg-violet-100 text-violet-700", icon: Shield },
};

function UserCard({ user, index, onEnroll }) {
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
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -1 }}
    >
      <Card className="border border-gray-100 shadow-sm hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-11 h-11 flex-shrink-0">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-gray-900 text-sm truncate">
                  {user.name}
                </p>
                <Badge
                  className={`text-xs border-0 font-bold flex-shrink-0 ${config.color}`}
                >
                  {user.role}
                </Badge>
              </div>
              <p className="text-gray-400 text-xs truncate">{user.email}</p>
              {user.student && (
                <p className="text-gray-400 text-xs mt-0.5">
                  {user.student.studentCode} · Level {user.student.level}
                </p>
              )}
              {user.lecturer && (
                <p className="text-gray-400 text-xs mt-0.5">
                  {user.lecturer.staffCode} · {user.lecturer.department}
                </p>
              )}
            </div>

            {user.role === "STUDENT" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEnroll(user)}
                className="flex-shrink-0 h-8 text-xs font-bold border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <Plus className="w-3 h-3 mr-1" />
                Enroll
              </Button>
            )}
          </div>

          {user.student?.enrollments?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-50">
              <p className="text-xs text-gray-400 mb-2">Enrolled courses</p>
              <div className="flex flex-wrap gap-1.5">
                {user.student.enrollments.map((e) => (
                  <span
                    key={e.id}
                    className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium"
                  >
                    {e.course?.code}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [enrollTarget, setEnrollTarget] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");

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

  const { data: coursesData } = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data;
    },
  });

  const students = studentsData?.students || [];
  const courses = coursesData?.courses || [];

  // Build user list from students
  const allUsers = students.map((s) => ({
    ...s.user,
    student: s,
  }));

  const filtered = allUsers.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.student?.studentCode?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleEnroll = async () => {
    if (!selectedCourseId) {
      toast.error("Please select a course");
      return;
    }
    setEnrolling(true);
    try {
      await api.post("/api/v1/courses/enroll", {
        studentId: enrollTarget.student.id,
        courseId: Number(selectedCourseId),
      });
      toast.success(`${enrollTarget.name} enrolled successfully!`);
      setEnrollTarget(null);
      setSelectedCourseId("");
      refetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Users</h1>
            <p className="text-gray-400 text-sm">
              {allUsers.length} registered users
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, student code..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
      </div>

      <div className="px-5 py-5 max-w-lg mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "Students",
              value: allUsers.filter((u) => u.role === "STUDENT").length,
              color: "blue",
              icon: GraduationCap,
            },
            {
              label: "Lecturers",
              value: allUsers.filter((u) => u.role === "LECTURER").length,
              color: "emerald",
              icon: UserCheck,
            },
            {
              label: "Admins",
              value: allUsers.filter((u) => u.role === "ADMIN").length,
              color: "violet",
              icon: Shield,
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center"
              >
                <p className="text-2xl font-black text-gray-900">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Users List */}
        {loadingStudents ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gray-100" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-100 rounded w-32 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-48" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold">No users found</p>
            <p className="text-gray-400 text-sm mt-1">
              {search ? "Try a different search" : "No students registered yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((user, i) => (
              <UserCard
                key={user.id}
                user={user}
                index={i}
                onEnroll={setEnrollTarget}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enroll Modal */}
      <AnimatePresence>
        {enrollTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setEnrollTarget(null)
            }
          >
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              className="bg-white rounded-3xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-black text-gray-900">
                    Enroll Student
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Enrolling{" "}
                    <span className="font-semibold text-gray-700">
                      {enrollTarget.name}
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setEnrollTarget(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              {/* Already enrolled */}
              {enrollTarget.student?.enrollments?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Already enrolled in
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {enrollTarget.student.enrollments.map((e) => (
                      <span
                        key={e.id}
                        className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-semibold"
                      >
                        {e.course?.code} — {e.course?.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <Label className="text-gray-700 font-semibold">
                    Select Course
                  </Label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full mt-1.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-blue-400 transition-colors"
                  >
                    <option value="">Choose a course...</option>
                    {courses
                      .filter(
                        (c) =>
                          !enrollTarget.student?.enrollments?.some(
                            (e) => e.courseId === c.id,
                          ),
                      )
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.code} — {c.name}
                        </option>
                      ))}
                  </select>
                </div>

                <Button
                  onClick={handleEnroll}
                  disabled={enrolling || !selectedCourseId}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
