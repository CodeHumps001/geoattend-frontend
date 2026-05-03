"use client";
import { useRouter } from "next/navigation"; // Fixed for App Router
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import {
  BookOpen,
  ChevronRight,
  PlayCircle,
  TrendingUp,
  Users,
  PlusCircle,
} from "lucide-react";
import StatCard from "../courses/StatsCard";
import CourseCard from "../courses/CourseCard";
import { ActivityItem } from "../courses/ActivityItems";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function LecturerDashboard({ user }) {
  const router = useRouter();

  const { data: coursesData } = useQuery({
    queryKey: ["lecturer-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data;
    },
    enabled: !!user,
  });

  const myCourses =
    coursesData?.courses?.filter(
      (c) => c.lecturer?.user?.email === user?.email,
    ) || [];

  const totalStudentsUnderMe = myCourses.reduce(
    (acc, c) => acc + (c.enrollments?.length || 0),
    0,
  );

  return (
    <div className="w-full space-y-8 pb-10">
      {/* Hero Section */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="relative z-10">
          <p className="text-emerald-100 text-sm font-semibold mb-2 uppercase tracking-wider">
            Welcome back 👋
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-2">{user?.name}</h2>
          <p className="text-emerald-100 text-base opacity-90">
            {myCourses.length} course{myCourses.length !== 1 ? "s" : ""} under
            your management
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/sessions")}
              className="bg-white text-emerald-600 font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2 shadow-sm"
            >
              <PlayCircle className="w-4 h-4" /> Start New Session
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/courses/new")}
              className="bg-emerald-500/20 backdrop-blur-md text-white border border-emerald-400/30 font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> New Course
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - 4 Columns on Desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="My Courses"
          value={myCourses.length || "0"}
          icon={BookOpen}
          color="blue"
          delay={1}
        />
        <StatCard
          label="Total Students"
          value={totalStudentsUnderMe}
          icon={Users}
          color="green"
          delay={2}
        />
        <StatCard
          label="Sessions Today"
          value="3"
          icon={PlayCircle}
          color="orange"
          delay={3}
        />
        <StatCard
          label="Avg Attendance"
          value="91.2%"
          icon={TrendingUp}
          color="purple"
          sub="Good"
          delay={4}
        />
      </div>

      {/* Layout Split: Courses & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Course Management - 7 Cols */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 text-xl">My Courses</h3>
            <button
              onClick={() => router.push("/courses")}
              className="text-emerald-600 text-sm font-bold flex items-center gap-1 hover:underline"
            >
              Manage all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {myCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-dashed border-gray-300 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-bold text-lg">
                No courses assigned
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Create a course to begin tracking attendance.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myCourses.slice(0, 3).map((course, i) => (
                <CourseCard key={course.id} course={course} delay={i} />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity - 5 Cols */}
        <div className="lg:col-span-5">
          <h3 className="font-bold text-gray-900 text-xl mb-6">
            Recent Activity
          </h3>
          <div className="bg-white rounded-3xl border border-gray-200 p-2 shadow-sm">
            <ActivityItem
              icon={PlayCircle}
              title="Session started"
              sub="CS301 — Lecture Hall B"
              time="2h ago"
              color="green"
            />
            <ActivityItem
              icon={Users}
              title="28 students present"
              sub="CS301 — Data Structures"
              time="2h ago"
              color="blue"
            />
            <ActivityItem
              icon={BookOpen}
              title="New student enrolled"
              sub="CS302 — Algorithms"
              time="Yesterday"
              color="orange"
            />
            <button className="w-full py-4 text-sm font-bold text-emerald-600 hover:bg-gray-50 rounded-b-2xl transition-colors">
              Full Activity Log
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
