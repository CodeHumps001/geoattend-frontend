// app/(app)/courses/page.jsx
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Users,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

function CourseCard({ course, onEdit, onDelete, isCourseRep }) {
  const router = useRouter();
  const sessionCount = course.sessions?.length || 0;
  const studentCount = course._count?.sessions || 0;

  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ y: -2 }}
      className="cursor-pointer"
    >
      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div
              className="flex-1"
              onClick={() => router.push(`/courses/${course.id}`)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-0">
                  {course.code}
                </Badge>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                {course.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {course.lecturerName || "No lecturer assigned"}
              </p>
            </div>
            {/* Only show edit/delete options for reps */}
            {isCourseRep && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(course)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(course)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{studentCount} sessions</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CreateCourseModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    lecturerName: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/v1/courses", formData);
      toast.success("Course created successfully!");
      onSuccess();
      onClose();
      setFormData({ code: "", name: "", lecturerName: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Course</DialogTitle>
          <DialogDescription>
            Add a new course to your class. Students will be able to see it
            immediately.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label>Course Code</Label>
            <Input
              placeholder="e.g., CS301"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              required
            />
          </div>
          <div>
            <Label>Course Name</Label>
            <Input
              placeholder="e.g., Data Structures"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label>Lecturer Name (Optional)</Label>
            <Input
              placeholder="e.g., Dr. Kwame Mensah"
              value={formData.lecturerName}
              onChange={(e) =>
                setFormData({ ...formData, lecturerName: e.target.value })
              }
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Create Course
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function CoursesPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { user, isCourseRep } = useAuth();

  // Fetch courses
  const { data: response, isLoading } = useQuery({
    queryKey: ["rep-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data; // This contains { courses: [], count: number }
    },
    enabled: !!user,
  });

  // Extract courses array from response
  const courses = response?.courses || [];

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: async (courseId) => {
      await api.delete(`/api/v1/courses/${courseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["rep-courses"]);
      toast.success("Course deleted successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete course");
    },
  });

  const filteredCourses = courses.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.code?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (course) => {
    if (confirm(`Are you sure you want to delete "${course.name}"?`)) {
      deleteMutation.mutate(course.id);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Courses
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {isCourseRep
              ? "Manage all the courses in your class"
              : "Browse all available courses"}
          </p>
        </div>
        {/* Only show New Course button for reps */}
        {isCourseRep && (
          <Button onClick={() => setShowCreateModal(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Course
          </Button>
        )}
      </div>

      {/* Search - visible to everyone */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by course name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Courses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-5">
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-20 mb-3" />
                <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              {search ? "No courses found" : "No courses yet"}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              {search
                ? "Try a different search term"
                : isCourseRep
                  ? "Create your first course to get started"
                  : "Check back later for new courses"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course, i) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={setEditingCourse}
              onDelete={handleDelete}
              isCourseRep={isCourseRep}
            />
          ))}
        </div>
      )}

      {/* Create Modal - Only shown to reps */}
      {isCourseRep && (
        <CreateCourseModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => queryClient.invalidateQueries(["rep-courses"])}
        />
      )}
    </div>
  );
}
