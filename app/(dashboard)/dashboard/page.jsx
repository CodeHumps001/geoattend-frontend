"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  MapPin,
  PlayCircle,
  AlertCircle,
  ChevronRight,
  GraduationCap,
  BarChart3,
  Zap,
  Award,
} from "lucide-react";
import { useRouter } from "next/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Stat Card ──────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, sub, delay }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {sub && (
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
            {sub}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900 mb-0.5">{value}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </motion.div>
  );
}

// ── Course Card ────────────────────────────────────────────────
function CourseCard({ course, percentage, delay }) {
  const router = useRouter();
  const pct = percentage ?? 0;
  const color = pct >= 75 ? "emerald" : pct >= 50 ? "orange" : "red";
  const colorMap = {
    emerald: "bg-emerald-500",
    orange: "bg-orange-400",
    red: "bg-red-500",
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2 }}
      onClick={() => router.push(`/courses/${course.id}`)}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            {course.code}
          </span>
          <h3 className="font-bold text-gray-900 mt-2 text-sm">
            {course.name}
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">{course.department}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
      </div>

      {percentage !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">Attendance</span>
            <span className={`text-xs font-bold text-${color}-600`}>
              {pct.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${colorMap[color]}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {pct < 75 && (
            <p className="text-xs text-orange-500 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Below recommended threshold
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Activity Item ──────────────────────────────────────────────
function ActivityItem({ icon: Icon, title, sub, time, color }) {
  const colors = {
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
    </div>
  );
}

// ── Student Dashboard ──────────────────────────────────────────
function StudentDashboard({ user }) {
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
    <div className="space-y-6">
      {/* Hero greeting */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-20 w-20 h-20 bg-white/5 rounded-full translate-y-8" />
        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-medium mb-1">
            Good morning 👋
          </p>
          <h2 className="text-2xl font-black mb-1">{user?.name}</h2>
          <p className="text-blue-200 text-sm">Keep up the great attendance!</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/attendance")}
            className="mt-4 bg-white text-blue-600 font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 w-fit"
          >
            <MapPin className="w-4 h-4" />
            Mark Attendance
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Enrolled Courses"
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
          label="Sessions This Week"
          value="8"
          icon={Clock}
          color="orange"
          delay={3}
        />
        <StatCard
          label="Perfect Attendance"
          value="3"
          icon={Award}
          color="purple"
          sub="Courses"
          delay={4}
        />
      </div>

      {/* My Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">My Courses</h3>
          <button
            onClick={() => router.push("/courses")}
            className="text-blue-600 text-sm font-semibold flex items-center gap-1"
          >
            See all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {enrollments.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No courses yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Ask your admin to enroll you in courses
            </p>
          </div>
        ) : (
          <div className="space-y-3">
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

      {/* Recent Activity */}
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-4">
          Recent Activity
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 px-4 shadow-sm">
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
        </div>
      </div>
    </div>
  );
}

// ── Lecturer Dashboard ─────────────────────────────────────────
function LecturerDashboard({ user }) {
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

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="relative z-10">
          <p className="text-emerald-200 text-sm font-medium mb-1">
            Welcome back 👋
          </p>
          <h2 className="text-2xl font-black mb-1">{user?.name}</h2>
          <p className="text-emerald-200 text-sm">
            {myCourses.length} course{myCourses.length !== 1 ? "s" : ""} under
            your management
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push("/sessions")}
            className="mt-4 bg-white text-emerald-600 font-bold text-sm px-5 py-2.5 rounded-xl flex items-center gap-2 w-fit"
          >
            <PlayCircle className="w-4 h-4" />
            Start New Session
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="My Courses"
          value={myCourses.length || "0"}
          icon={BookOpen}
          color="blue"
          delay={1}
        />
        <StatCard
          label="Total Students"
          value={myCourses.reduce(
            (acc, c) => acc + (c.enrollments?.length || 0),
            0,
          )}
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

      {/* My Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">My Courses</h3>
          <button
            onClick={() => router.push("/courses")}
            className="text-blue-600 text-sm font-semibold flex items-center gap-1"
          >
            See all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        {myCourses.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No courses yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Create your first course to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {myCourses.slice(0, 3).map((course, i) => (
              <CourseCard key={course.id} course={course} delay={i} />
            ))}
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-4">
          Recent Activity
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 px-4 shadow-sm">
          <ActivityItem
            icon={PlayCircle}
            title="Session started"
            sub="CS301 — Lecture Hall B"
            time="2h ago"
            color="green"
          />
          <ActivityItem
            icon={Users}
            title="28 students marked present"
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
        </div>
      </div>
    </div>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────
function AdminDashboard({ user }) {
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
    <div className="space-y-6">
      {/* Hero */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="relative z-10">
          <p className="text-violet-200 text-sm font-medium mb-1">
            Admin Panel 🛡️
          </p>
          <h2 className="text-2xl font-black mb-1">{user?.name}</h2>
          <p className="text-violet-200 text-sm">Full institution oversight</p>
          <div className="flex gap-3 mt-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/users")}
              className="bg-white text-violet-600 font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Manage Users
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push("/courses")}
              className="bg-white/20 text-white font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Courses
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
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

      {/* Quick Actions */}
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
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
              blue: "bg-blue-50 text-blue-600 border-blue-100",
              green: "bg-emerald-50 text-emerald-600 border-emerald-100",
              purple: "bg-purple-50 text-purple-600 border-purple-100",
              orange: "bg-orange-50 text-orange-600 border-orange-100",
            };
            return (
              <motion.button
                key={action.label}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(action.path)}
                className={`p-4 rounded-2xl border text-left ${colors[action.color]} hover:shadow-md transition-all`}
              >
                <Icon className="w-6 h-6 mb-2" />
                <p className="font-bold text-sm">{action.label}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-4">
          Recent Activity
        </h3>
        <div className="bg-white rounded-2xl border border-gray-100 px-4 shadow-sm">
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
            sub="CS301 — 28 present, 2 absent"
            time="Yesterday"
            color="green"
          />
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard Page ────────────────────────────────────────
export default function DashboardPage() {
  const { user, isStudent, isLecturer, isAdmin } = useAuth();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-200">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-gray-900 text-lg leading-none">
                Klassrep
              </h1>
              <p className="text-gray-400 text-xs">
                {greeting()}, {user?.name?.split(" ")[0]}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                isStudent
                  ? "bg-blue-50 text-blue-600"
                  : isLecturer
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-purple-50 text-purple-600"
              }`}
            >
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5 max-w-lg mx-auto">
        {isStudent && <StudentDashboard user={user} />}
        {isLecturer && <LecturerDashboard user={user} />}
        {isAdmin && <AdminDashboard user={user} />}
      </div>
    </div>
  );
}
