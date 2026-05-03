"use client";
import { useRouter } from "next/navigation"; // Fixed for Next.js App Router
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  GraduationCap,
  PlayCircle,
  Users,
} from "lucide-react";
import StatCard from "../courses/StatsCard";
import { ActivityItem } from "../courses/ActivityItems";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function AdminDashboard({ user }) {
  const router = useRouter();

  const { data: studentsData } = useQuery({
    queryKey: ["all-students"],
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

  const totalStudents = studentsData?.total || 0;
  const totalCourses = coursesData?.count || 0;

  return (
    // 'w-full' ensures it fills the layout provided by the DashboardLayout sidebar
    <div className="w-full space-y-8 pb-10">
      {/* Hero Section - Responsive Height */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="relative z-10">
          <p className="text-violet-100 text-sm font-semibold mb-2 uppercase tracking-wider">
            Admin Panel 🛡️
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-2">{user?.name}</h2>
          <p className="text-violet-100 text-base opacity-90">
            Full institution oversight & management
          </p>

          <div className="flex flex-wrap gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/users")}
              className="bg-white text-violet-600 font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2 shadow-sm"
            >
              <Users className="w-4 h-4" /> Manage Users
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/courses")}
              className="bg-white/20 backdrop-blur-md text-white font-bold text-sm px-6 py-3 rounded-2xl flex items-center gap-2 border border-white/30"
            >
              <BookOpen className="w-4 h-4" /> Courses
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - 2 cols on mobile, 4 cols on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={totalStudents}
          icon={GraduationCap}
          color="blue"
          delay={1}
        />
        <StatCard
          label="Total Courses"
          value={totalCourses}
          icon={BookOpen}
          color="green"
          delay={2}
        />
        <StatCard
          label="Active Sessions"
          value="12"
          icon={PlayCircle}
          color="orange"
          sub="Live"
          delay={3}
        />
        <StatCard
          label="Avg Attendance"
          value="88.4%"
          icon={BarChart3}
          color="purple"
          delay={4}
        />
      </div>

      {/* Main Content Split: Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Actions - Spans 7 columns on desktop */}
        <div className="lg:col-span-7">
          <h3 className="font-bold text-gray-900 text-xl mb-5 flex items-center gap-2">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
            {[
              {
                label: "Add Student",
                icon: GraduationCap,
                path: "/users",
                color: "blue",
              },
              {
                label: "Create Course",
                icon: BookOpen,
                path: "/courses",
                color: "green",
              },
              {
                label: "View Reports",
                icon: BarChart3,
                path: "/reports",
                color: "purple",
              },
              {
                label: "All Sessions",
                icon: PlayCircle,
                path: "/sessions",
                color: "orange",
              },
            ].map((action, i) => {
              const Icon = action.icon;
              const colors = {
                blue: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100",
                green:
                  "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
                purple:
                  "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100",
                orange:
                  "bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100",
              };
              return (
                <motion.button
                  key={action.label}
                  variants={fadeUp}
                  custom={i + 4}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(action.path)}
                  className={`p-6 rounded-3xl border text-left ${colors[action.color]} transition-all shadow-sm`}
                >
                  <div className="bg-white p-2 rounded-xl w-fit mb-4 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-base">{action.label}</p>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Recent Activity - Spans 5 columns on desktop */}
        <div className="lg:col-span-5">
          <h3 className="font-bold text-gray-900 text-xl mb-5">
            Recent Activity
          </h3>
          <div className="bg-white rounded-3xl border border-gray-200 p-2 shadow-sm">
            <ActivityItem
              icon={GraduationCap}
              title="New student registered"
              sub="Yaw Fosu — Computer Science"
              time="1h ago"
              color="blue"
            />
            <ActivityItem
              icon={BookOpen}
              title="Course created"
              sub="CS304 — Machine Learning"
              time="3h ago"
              color="green"
            />
            <ActivityItem
              icon={Users}
              title="Student enrolled"
              sub="Ama Serwaa → CS301"
              time="5h ago"
              color="orange"
            />
            <ActivityItem
              icon={PlayCircle}
              title="Session completed"
              sub="CS301 — 28 present"
              time="Yesterday"
              color="green"
            />
            <button className="w-full py-4 text-sm font-bold text-violet-600 hover:bg-gray-50 rounded-b-2xl transition-colors">
              View All Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
