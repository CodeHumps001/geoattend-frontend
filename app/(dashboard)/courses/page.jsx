"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Search,
  Plus,
  ChevronRight,
  Users,
  PlayCircle,
  Filter,
  GraduationCap,
  X,
  LayoutGrid,
  List,
  Clock,
  Award,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Modern Course Card Component
function CourseCard({ course, role, index, viewMode }) {
  const router = useRouter();
  const enrolledCount = course.enrollments?.length || 0;
  const sessionCount = course.sessions?.length || 0;
  const lecturerName = course.lecturer?.user?.name || "Not assigned";

  const colors = ["blue", "emerald", "violet", "amber", "rose", "teal"];
  const color = colors[index % colors.length];

  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    violet: "from-violet-500 to-violet-600",
    amber: "from-amber-500 to-amber-600",
    rose: "from-rose-500 to-rose-600",
    teal: "from-teal-500 to-teal-600",
  };

  const badgeMap = {
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    emerald:
      "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    violet:
      "bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800",
    amber:
      "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    rose: "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    teal: "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200 dark:border-teal-800",
  };

  if (viewMode === "list") {
    return (
      <motion.div
        variants={fadeUp}
        custom={index}
        initial="hidden"
        animate="visible"
        whileHover={{ x: 4 }}
        onClick={() => router.push(`/courses/${course.id}`)}
        className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all cursor-pointer p-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${badgeMap[color]}`}
              >
                {course.code}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {course.semester}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              {course.name}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
              {course.department}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {enrolledCount}
              </span>
              <span className="flex items-center gap-1">
                <PlayCircle className="w-3.5 h-3.5" />
                {sessionCount}
              </span>
              {role !== "STUDENT" && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {lecturerName.split(" ")[0]}
                </span>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-600 flex-shrink-0" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4 }}
      onClick={() => router.push(`/courses/${course.id}`)}
      className="h-full cursor-pointer"
    >
      <Card className="h-full border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group bg-white dark:bg-gray-900">
        <div className={`h-1.5 bg-gradient-to-r ${colorMap[color]}`} />
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge
                  variant="secondary"
                  className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  {course.code}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs border-gray-200 dark:border-gray-700"
                >
                  {course.semester}
                </Badge>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1 line-clamp-1">
                {course.name}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {course.department}
              </p>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Students
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {enrolledCount}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center">
                  <PlayCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Sessions
                  </p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {sessionCount}
                  </p>
                </div>
              </div>
            </div>

            {role !== "STUDENT" && (
              <div className="mt-3 flex items-center gap-2 pt-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400">
                    {lecturerName.charAt(0)}
                  </span>
                </div>
                <span className="truncate">Lecturer: {lecturerName}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Stats Card Component
function StatsCard({ title, value, icon: Icon, gradient, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group bg-white dark:bg-gray-900">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {value}
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function CoursesPage() {
  const { user, isStudent, isLecturer, isAdmin } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    code: "",
    name: "",
    department: "",
    semester: "",
    lecturerId: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data;
    },
  });

  const allCourses = data?.courses || [];

  // Filter courses based on role
  const visibleCourses = allCourses.filter((course) => {
    if (isLecturer) return course.lecturer?.user?.email === user?.email;
    return true;
  });

  // Get unique departments for filter
  const departments = [
    "all",
    ...new Set(visibleCourses.map((c) => c.department)),
  ];

  const filtered = visibleCourses.filter((c) => {
    const matchesSearch =
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.code?.toLowerCase().includes(search.toLowerCase()) ||
      c.department?.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || c.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  // Stats
  const totalCourses = filtered.length;
  const totalStudents = filtered.reduce(
    (acc, c) => acc + (c.enrollments?.length || 0),
    0,
  );
  const totalSessions = filtered.reduce(
    (acc, c) => acc + (c.sessions?.length || 0),
    0,
  );
  const activeCourses = filtered.filter((c) => c.sessions?.length > 0).length;

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post("/api/v1/courses", {
        ...form,
        lecturerId: Number(form.lecturerId),
      });
      toast.success("Course created successfully!");
      setShowCreateModal(false);
      setForm({
        code: "",
        name: "",
        department: "",
        semester: "",
        lecturerId: "",
      });
      refetch();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-6 pt-8 pb-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                Courses
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Manage and explore all available courses
              </p>
            </div>
            {(isAdmin || isLecturer) && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md shadow-blue-200 dark:shadow-blue-900/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Course
              </Button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Total Courses"
              value={totalCourses}
              icon={BookOpen}
              gradient="from-blue-500 to-blue-600"
              delay={0}
            />
            <StatsCard
              title="Enrolled Students"
              value={totalStudents}
              icon={Users}
              gradient="from-emerald-500 to-emerald-600"
              delay={1}
            />
            <StatsCard
              title="Total Sessions"
              value={totalSessions}
              icon={PlayCircle}
              gradient="from-purple-500 to-purple-600"
              delay={2}
            />
            <StatsCard
              title="Active Courses"
              value={activeCourses}
              icon={TrendingUp}
              gradient="from-orange-500 to-orange-600"
              delay={3}
            />
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses by name, code, or department..."
                className="pl-10 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </option>
                ))}
              </select>

              {/* View Toggle */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="animate-pulse bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"
              >
                <CardContent className="p-5">
                  <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="text-center py-16 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
            <CardContent>
              <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">
                {search || departmentFilter !== "all"
                  ? "No courses found"
                  : "No courses yet"}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
                {search || departmentFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : isAdmin || isLecturer
                    ? "Create your first course to get started"
                    : "Ask your admin to enroll you in courses"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                : "space-y-3"
            }
          >
            {filtered.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course}
                role={user?.role}
                index={i}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
            onClick={(e) =>
              e.target === e.currentTarget && setShowCreateModal(false)
            }
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Create Course
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Add a new course to the system
                  </p>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">
                    Course Code
                  </Label>
                  <Input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value })}
                    placeholder="e.g., CS301"
                    required
                    className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">
                    Course Name
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Data Structures"
                    required
                    className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">
                    Department
                  </Label>
                  <Input
                    value={form.department}
                    onChange={(e) =>
                      setForm({ ...form, department: e.target.value })
                    }
                    placeholder="e.g., Computer Science"
                    required
                    className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>

                <div>
                  <Label className="text-gray-700 dark:text-gray-300 font-semibold">
                    Semester
                  </Label>
                  <Input
                    value={form.semester}
                    onChange={(e) =>
                      setForm({ ...form, semester: e.target.value })
                    }
                    placeholder="e.g., 2025/2026 Semester 1"
                    required
                    className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>

                {isAdmin && (
                  <div>
                    <Label className="text-gray-700 dark:text-gray-300 font-semibold">
                      Lecturer ID
                    </Label>
                    <Input
                      type="number"
                      value={form.lecturerId}
                      onChange={(e) =>
                        setForm({ ...form, lecturerId: e.target.value })
                      }
                      placeholder="Enter lecturer ID"
                      required={isAdmin}
                      className="mt-1.5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={creating}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl mt-4"
                >
                  {creating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Course
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
