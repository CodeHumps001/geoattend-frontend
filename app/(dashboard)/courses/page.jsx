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
} from "lucide-react";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

function CourseCard({ course, role, index }) {
  const router = useRouter();
  const enrolledCount = course.enrollments?.length || 0;
  const sessionCount = course.sessions?.length || 0;

  const colors = ["blue", "emerald", "violet", "orange", "pink", "teal"];
  const color = colors[index % colors.length];

  const colorMap = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
    violet: "bg-violet-50 text-violet-700 border-violet-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    pink: "bg-pink-50 text-pink-700 border-pink-100",
    teal: "bg-teal-50 text-teal-700 border-teal-100",
  };

  const dotMap = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    violet: "bg-violet-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    teal: "bg-teal-500",
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2 }}
      onClick={() => router.push(`/courses/${course.id}`)}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
    >
      {/* Color accent bar */}
      <div className={`h-1 w-full ${dotMap[color]}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${colorMap[color]}`}
              >
                {course.code}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">
              {course.name}
            </h3>
            <p className="text-gray-400 text-xs mt-1">{course.department}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 mt-1" />
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
          <span className="bg-gray-100 px-2 py-0.5 rounded-full">
            {course.semester}
          </span>
        </div>

        <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
          {role !== "STUDENT" && (
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <Users className="w-3.5 h-3.5" />
              <span>{enrolledCount} students</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <PlayCircle className="w-3.5 h-3.5" />
            <span>{sessionCount} sessions</span>
          </div>
          {role !== "STUDENT" && course.lecturer && (
            <div className="flex items-center gap-1.5 text-gray-500 text-xs ml-auto">
              <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                {course.lecturer?.user?.name?.[0] || "L"}
              </div>
              <span className="truncate max-w-[80px]">
                {course.lecturer?.user?.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function CoursesPage() {
  const { user, isStudent, isLecturer, isAdmin } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
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

  const filtered = visibleCourses.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.code?.toLowerCase().includes(search.toLowerCase()) ||
      c.department?.toLowerCase().includes(search.toLowerCase()),
  );

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Courses</h1>
            <p className="text-gray-400 text-sm">
              {filtered.length} course{filtered.length !== 1 ? "s" : ""}
              {isLecturer
                ? " you teach"
                : isStudent
                  ? " you're enrolled in"
                  : " total"}
            </p>
          </div>
          {(isAdmin || isLecturer) && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200"
            >
              <Plus className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5 max-w-lg mx-auto">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
              >
                <div className="h-4 bg-gray-100 rounded w-20 mb-3" />
                <div className="h-5 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold text-lg">
              {search ? "No courses found" : "No courses yet"}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {search
                ? "Try a different search term"
                : isAdmin || isLecturer
                  ? "Create your first course"
                  : "Ask your admin to enroll you"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((course, i) => (
              <CourseCard
                key={course.id}
                course={course}
                role={user?.role}
                index={i}
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
              className="bg-white rounded-3xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-gray-900">
                  Create Course
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {[
                  { key: "code", label: "Course Code", placeholder: "CS301" },
                  {
                    key: "name",
                    label: "Course Name",
                    placeholder: "Data Structures",
                  },
                  {
                    key: "department",
                    label: "Department",
                    placeholder: "Computer Science",
                  },
                  {
                    key: "semester",
                    label: "Semester",
                    placeholder: "2025/2026 Semester 1",
                  },
                  {
                    key: "lecturerId",
                    label: "Lecturer ID",
                    placeholder: "1",
                    type: "number",
                  },
                ].map(({ key, label, placeholder, type }) => (
                  <div key={key}>
                    <label className="block text-gray-700 text-sm font-semibold mb-1.5">
                      {label}
                    </label>
                    <input
                      value={form[key]}
                      onChange={(e) =>
                        setForm({ ...form, [key]: e.target.value })
                      }
                      type={type || "text"}
                      placeholder={placeholder}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400 transition-colors"
                    />
                  </div>
                ))}

                <motion.button
                  type="submit"
                  disabled={creating}
                  className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                  whileHover={!creating ? { scale: 1.02 } : {}}
                  whileTap={!creating ? { scale: 0.98 } : {}}
                >
                  {creating ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Create Course
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
