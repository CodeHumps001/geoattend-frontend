// app/(app)/dashboard/page.jsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Users,
  BookOpen,
  Video,
  TrendingUp,
  Sparkles,
  Clock,
  Calendar,
  Target,
  Award,
  ChevronRight,
  PlayCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/axios";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

function StatCard({ title, value, icon: Icon, color, delay }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    purple: "from-purple-500 to-purple-600",
    emerald: "from-emerald-500 to-emerald-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all group">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {value}
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center group-hover:scale-110 transition-transform`}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function QuickActionCard({ title, description, icon: Icon, onClick, color }) {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400",
    purple:
      "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400",
    emerald:
      "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400",
    orange:
      "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400",
  };

  return (
    <motion.button
      variants={fadeUp}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 text-left transition-all ${colors[color]}`}
    >
      <Icon className="w-6 h-6 mb-3" />
      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </motion.button>
  );
}

function RecentSessionCard({ session }) {
  const router = useRouter();
  const now = new Date();
  const isLive =
    now >= new Date(session.startTime) && now <= new Date(session.endTime);

  return (
    <motion.div variants={fadeUp}>
      <Card className="border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all cursor-pointer">
        <CardContent
          className="p-4"
          onClick={() => router.push(`/sessions/${session.id}`)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {isLive && (
                  <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                    LIVE
                  </Badge>
                )}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(session.date).toLocaleDateString()}
                </p>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {session.course?.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {session.course?.code} •{" "}
                {new Date(session.startTime).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {session.attendance?.length || 0}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                present
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function RepDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // Fetch class space data
  const { data: classSpace, isLoading } = useQuery({
    queryKey: ["rep-class-space"],
    queryFn: async () => {
      const classSpaceId = user?.courseRep?.classSpaceId;
      if (!classSpaceId) return null;
      const res = await api.get(`/api/v1/class/${classSpaceId}`);
      return res.data.data;
    },
    enabled: !!user?.courseRep?.classSpaceId,
  });

  // Fetch recent sessions
  const { data: recentSessions } = useQuery({
    queryKey: ["recent-sessions"],
    queryFn: async () => {
      const res = await api.get("/api/v1/sessions/recent?limit=3");
      return res.data.data || [];
    },
    enabled: !!user,
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["rep-stats"],
    queryFn: async () => {
      const res = await api.get("/api/v1/stats/rep");
      return res.data.data;
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Welcome Section */}
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Course Rep Dashboard</span>
            </div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.name?.split(" ")[0]}
            </h1>
            <p className="text-indigo-100 mt-1">
              {classSpace?.name || "Manage your class space"}
            </p>
            {classSpace?.classCode && (
              <div className="mt-3 inline-flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                <span className="text-xs">Class Code:</span>
                <code className="text-sm font-mono font-bold">
                  {classSpace.classCode}
                </code>
              </div>
            )}
          </div>
          <Button
            onClick={() => router.push("/sessions/new")}
            className="bg-white text-indigo-700 hover:bg-gray-100 shadow-lg"
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Start Session
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || classSpace?._count?.students || 0}
          icon={Users}
          color="blue"
          delay={1}
        />
        <StatCard
          title="Courses"
          value={stats?.totalCourses || classSpace?.courses?.length || 0}
          icon={BookOpen}
          color="purple"
          delay={2}
        />
        <StatCard
          title="Sessions"
          value={stats?.totalSessions || 0}
          icon={Video}
          color="emerald"
          delay={3}
        />
        <StatCard
          title="Attendance Rate"
          value={`${stats?.avgAttendance || 0}%`}
          icon={TrendingUp}
          color="orange"
          delay={4}
        />
      </div>

      {/* Quick Actions */}
      <motion.div
        variants={fadeUp}
        custom={5}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <QuickActionCard
            title="Create Course"
            description="Add a new course to your class"
            icon={BookOpen}
            onClick={() => router.push("/courses/new")}
            color="blue"
          />
          <QuickActionCard
            title="Start Session"
            description="Begin a live attendance session"
            icon={Video}
            onClick={() => router.push("/sessions/new")}
            color="emerald"
          />
          <QuickActionCard
            title="Manage Students"
            description="View and manage class members"
            icon={Users}
            onClick={() => router.push("/members")}
            color="purple"
          />
          <QuickActionCard
            title="View Reports"
            description="Attendance analytics and exports"
            icon={TrendingUp}
            onClick={() => router.push("/reports")}
            color="orange"
          />
        </div>
      </motion.div>

      {/* Recent Sessions */}
      {recentSessions?.length > 0 && (
        <motion.div
          variants={fadeUp}
          custom={6}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Sessions
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/sessions")}
              className="text-indigo-600 dark:text-indigo-400"
            >
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <RecentSessionCard key={session.id} session={session} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Achievement / Tip Card */}
      <motion.div
        variants={fadeUp}
        custom={7}
        initial="hidden"
        animate="visible"
      >
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-0">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Pro Tip
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                  Start a session 5 minutes before class to ensure smooth
                  check-ins. Students will be able to mark attendance as soon as
                  the session begins.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
