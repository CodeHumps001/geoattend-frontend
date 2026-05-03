"use client";
import { useRouter } from "next/navigation";
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
  Plus,
  Eye,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Stat Card Component using shadcn
function StatCard({ label, value, icon: Icon, trend, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="relative overflow-hidden border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {label}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
              {trend && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                  <TrendingUp size={12} />
                  {trend}
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Quick Action Card
function QuickActionCard({ label, icon: Icon, path, description, delay }) {
  const router = useRouter();
  const colors = {
    violet:
      "from-violet-50 to-violet-100 dark:from-violet-500/10 dark:to-violet-500/5",
    blue: "from-blue-50 to-blue-100 dark:from-blue-500/10 dark:to-blue-500/5",
    emerald:
      "from-emerald-50 to-emerald-100 dark:from-emerald-500/10 dark:to-emerald-500/5",
    amber:
      "from-amber-50 to-amber-100 dark:from-amber-500/10 dark:to-amber-500/5",
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 group border-gray-200 dark:border-gray-800">
        <CardContent className="p-0">
          <button
            onClick={() => router.push(path)}
            className="w-full text-left p-6 rounded-xl"
          >
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors[label === "Add Student" ? "blue" : label] === "Create Course" ? "emerald" : label === "View Reports" ? "amber" : "violet"} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-6 h-6 text-gray-700 dark:text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
              {label}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Activity Item Component
function ActivityItem({ icon: Icon, title, sub, time, color }) {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    violet:
      "bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
    amber:
      "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div
        className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center flex-shrink-0`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</p>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
        {time}
      </p>
    </div>
  );
}

export default function AdminDashboard({ user }) {
  const router = useRouter();

  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ["all-students"],
    queryFn: async () => {
      const res = await api.get("/api/v1/students");
      return res.data.data;
    },
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data;
    },
  });

  const totalStudents = studentsData?.total || 0;
  const totalCourses = coursesData?.count || 0;

  // Sample data - replace with actual API calls
  const recentActivities = [
    {
      icon: GraduationCap,
      title: "New student registered",
      sub: "Yaw Fosu — Computer Science",
      time: "1h ago",
      color: "blue",
    },
    {
      icon: BookOpen,
      title: "Course created",
      sub: "CS304 — Machine Learning",
      time: "3h ago",
      color: "emerald",
    },
    {
      icon: Users,
      title: "Student enrolled",
      sub: "Ama Serwaa → CS301",
      time: "5h ago",
      color: "amber",
    },
    {
      icon: PlayCircle,
      title: "Session completed",
      sub: "CS301 — 28 present",
      time: "Yesterday",
      color: "violet",
    },
  ];

  return (
    <div className="w-full space-y-8 pb-10">
      {/* Hero Section with shadcn Card */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-violet-700 to-purple-800 dark:from-violet-700 dark:via-violet-800 dark:to-purple-900 border-none shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full translate-y-16 -translate-x-16 blur-2xl" />
          <CardContent className="relative z-10 p-8">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-none"
              >
                Admin Panel 🛡️
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              Welcome back, {user?.name?.split(" ")[0] || "Admin"}
            </h2>
            <p className="text-violet-100 text-base max-w-md">
              Full institution oversight & management at your fingertips.
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <Button
                onClick={() => router.push("/users")}
                variant="secondary"
                className="bg-white text-violet-600 hover:bg-gray-100 shadow-sm"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
              <Button
                onClick={() => router.push("/courses")}
                variant="outline"
                className="bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                View Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {studentsLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              label="Total Students"
              value={totalStudents}
              icon={GraduationCap}
              trend="+12% this month"
              delay={1}
            />
            <StatCard
              label="Total Courses"
              value={totalCourses}
              icon={BookOpen}
              trend="+4 new"
              delay={2}
            />
            <StatCard
              label="Active Sessions"
              value="12"
              icon={PlayCircle}
              trend="3 ongoing"
              delay={3}
            />
            <StatCard
              label="Avg Attendance"
              value="88.4%"
              icon={BarChart3}
              trend="+5.2%"
              delay={4}
            />
          </>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Quick Actions Section */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              Quick Actions
            </h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-violet-600 dark:text-violet-400"
            >
              View all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionCard
              label="Add Student"
              icon={GraduationCap}
              path="/users"
              description="Register new student"
              delay={5}
            />
            <QuickActionCard
              label="Create Course"
              icon={BookOpen}
              path="/courses"
              description="Add new course"
              delay={6}
            />
            <QuickActionCard
              label="View Reports"
              icon={BarChart3}
              path="/reports"
              description="Analytics & insights"
              delay={7}
            />
            <QuickActionCard
              label="Manage Users"
              icon={Users}
              path="/users"
              description="Update roles & access"
              delay={8}
            />
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              Recent Activity
            </h3>
            <Badge variant="outline" className="text-xs">
              Last 24 hours
            </Badge>
          </div>
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-1">
                {recentActivities.map((activity, idx) => (
                  <div key={idx}>
                    <ActivityItem {...activity} />
                    {idx < recentActivities.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 text-violet-600 dark:text-violet-400 hover:text-violet-700"
                onClick={() => router.push("/reports")}
              >
                View All Activity
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
