"use client";
import { useRouter } from "next/navigation"; // Fixed for App Router
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  MapPin,
  TrendingUp, // Added missing icon
  Clock, // Added missing icon
  Award, // Added missing icon
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

export default function StudentDashboard({ user }) {
  const router = useRouter();

  const { data: studentData } = useQuery({
    queryKey: ["student-profile", user?.id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/students`);
      return res.data.data;
    },
    enabled: !!user,
  });

  const enrollments =
    studentData?.students?.find((s) => s.userId === user?.id)?.enrollments ||
    [];

  return (
    <div className="w-full space-y-8 pb-10">
      {/* Hero Greeting - Responsive Padding and Text */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg"
      >
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-20 w-24 h-24 bg-white/5 rounded-full translate-y-10" />

        <div className="relative z-10">
          <p className="text-blue-100 text-sm font-semibold mb-2 uppercase tracking-wider">
            Good morning 👋
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-2">{user?.name}</h2>
          <p className="text-blue-100 text-base opacity-90">
            Keep up the great attendance!
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/attendance")}
            className="mt-6 bg-white text-blue-600 font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2 w-fit shadow-sm"
          >
            <MapPin className="w-4 h-4" /> Mark Attendance
          </motion.button>
        </div>
      </motion.div>

      {/* Stats Grid - 2 cols mobile, 4 cols desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Enrolled"
          value={enrollments.length || "0"}
          icon={BookOpen}
          color="blue"
          delay={1}
        />
        <StatCard
          label="Avg Attendance"
          value="87.5%"
          icon={TrendingUp}
          color="green"
          sub="Good"
          delay={2}
        />
        <StatCard
          label="This Week"
          value="8"
          icon={Clock}
          color="orange"
          delay={3}
        />
        <StatCard
          label="Perfect"
          value="3"
          icon={Award}
          color="purple"
          sub="Courses"
          delay={4}
        />
      </div>

      {/* Main Content Split: My Courses & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* My Courses Section - Spans 7 cols */}
        <div className="lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900 text-xl">My Courses</h3>
            <button
              onClick={() => router.push("/courses")}
              className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline"
            >
              See all <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border border-dashed border-gray-300 text-center">
              <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-bold text-lg">No courses yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Ask your admin to enroll you in courses
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              {enrollments.slice(0, 3).map((enrollment, i) => (
                <CourseCard
                  key={enrollment.id}
                  course={enrollment.course}
                  percentage={87.5}
                  delay={i}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity Section - Spans 5 cols */}
        <div className="lg:col-span-5">
          <h3 className="font-bold text-gray-900 text-xl mb-6">
            Recent Activity
          </h3>
          <div className="bg-white rounded-3xl border border-gray-200 p-2 shadow-sm">
            <ActivityItem
              icon={CheckCircle2}
              title="Marked present"
              sub="CS301 — Data Structures"
              time="2h ago"
              color="green"
            />
            <ActivityItem
              icon={CheckCircle2}
              title="Marked present"
              sub="CS302 — Algorithms"
              time="Yesterday"
              color="green"
            />
            <ActivityItem
              icon={AlertCircle}
              title="Marked absent"
              sub="MATH301 — Calculus"
              time="2 days ago"
              color="red"
            />
            <ActivityItem
              icon={BookOpen}
              title="Enrolled in course"
              sub="CS303 — Databases"
              time="Last week"
              color="blue"
            />
            <button className="w-full py-4 text-sm font-bold text-blue-600 hover:bg-gray-50 rounded-b-2xl transition-colors">
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
