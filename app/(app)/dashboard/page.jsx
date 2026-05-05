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
    </div>"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";
import {
  Users, BookOpen, PlayCircle, CheckCircle2,
  XCircle, Clock, ChevronRight, MapPin,
  Zap, Copy, TrendingUp, GraduationCap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Stat Card ─────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, delay, loading }) {
  const colors = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    emerald: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    violet: "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  };
  return (
    <motion.div variants={fadeUp} custom={delay} initial="hidden" animate="visible">
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-all">
        <CardContent className="p-4 sm:p-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
          {loading ? (
            <Skeleton className="h-7 w-16 mb-1" />
          ) : (
            <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">{value}</p>
          )}
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5">{label}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ── Activity Item ─────────────────────────────────────────
function ActivityItem({ icon: Icon, title, sub, time, color }) {
  const colors = {
    green: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400",
    red: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400",
  };
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{title}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{sub}</p>
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{time}</span>
    </div>
  );
}

// ── Course Rep Dashboard ───────────────────────────────────
function RepDashboard({ user }) {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["rep-class"],
    queryFn: async () => {
      const res = await api.get("/api/v1/class/me");
      return res.data.data.classSpace;
    },
    enabled: !!user,
  });

  const { data: sessionsData } = useQuery({
    queryKey: ["rep-sessions"],
    queryFn: async () => {
      const res = await api.get("/api/v1/sessions");
      return res.data.data.sessions;
    },
    enabled: !!user,
    refetchInterval: 15000,
  });

  const classSpace = data;
  const courses = classSpace?.courses || [];
  const members = classSpace?.students || [];
  const sessions = sessionsData || [];

  const now = new Date();
  const openSessions = sessions.filter(s => s.isOpen);
  const totalAttendance = sessions.reduce((acc, s) => acc + (s.attendance?.length || 0), 0);
  const totalPresent = sessions.reduce((acc, s) =>
    acc + (s.attendance?.filter(a => a.status === "PRESENT").length || 0), 0
  );
  const avgAttendance = totalAttendance > 0
    ? Math.round((totalPresent / totalAttendance) * 100)
    : null;

  // Recent activity from real sessions
  const recentActivity = sessions.slice(0, 4).map(s => ({
    icon: s.isOpen ? PlayCircle : CheckCircle2,
    title: s.isOpen ? "Session active" : "Session completed",
    sub: `${s.course?.name} · ${s.attendance?.filter(a => a.status === "PRESENT").length || 0} present`,
    time: new Date(s.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    color: s.isOpen ? "blue" : "green",
  }));

  const copyClassCode = () => {
    navigator.clipboard.writeText(classSpace?.classCode || "");
    toast.success("Class code copied!");
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 border-none shadow-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10 blur-2xl" />
          <CardContent className="relative z-10 p-6 sm:p-8">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-white/20 text-white border-none text-xs mb-3">
                  Course Rep 🎓
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {user?.name?.split(" ")[0]}'s Class
                </h2>
                <p className="text-blue-200 text-sm mt-1">
                  {classSpace?.name || "Loading..."}
                </p>
              </div>
              {openSessions.length > 0 && (
                <Badge className="bg-emerald-500 text-white border-none font-bold flex-shrink-0">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse inline-block" />
                  {openSessions.length} Live
                </Badge>
              )}
            </div>

            {/* Class Code */}
            {classSpace?.classCode && (
              <div className="flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-4 py-3 mb-5 w-fit">
                <div>
                  <p className="text-blue-200 text-xs">Class Code</p>
                  <p className="text-white font-black font-mono text-lg tracking-wider">
                    {classSpace.classCode}
                  </p>
                </div>
                <button
                  onClick={copyClassCode}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all"
                >
                  <Copy className="w-4 h-4 text-white" />
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => router.push("/sessions")}
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-sm"
              >
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Session
              </Button>
              <Button
                onClick={() => router.push("/courses")}
                variant="outline"
                className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-semibold"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Courses
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Members" value={members.length} icon={Users} color="blue" delay={1} loading={isLoading} />
        <StatCard label="Courses" value={courses.length} icon={BookOpen} color="emerald" delay={2} loading={isLoading} />
        <StatCard label="Sessions" value={sessions.length} icon={PlayCircle} color="violet" delay={3} loading={isLoading} />
        <StatCard label="Avg Attendance" value={avgAttendance !== null ? `${avgAttendance}%` : "—"} icon={TrendingUp} color="amber" delay={4} loading={isLoading} />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Active Sessions */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">Active Sessions</h3>
            <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 text-xs" onClick={() => router.push("/sessions")}>
              All sessions <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardContent className="p-0 px-4">
              {isLoading ? (
                <div className="py-6 space-y-3">
                  {[1, 2].map(i => <Skeleton key={i} className="h-12 rounded-xl" />)}
                </div>
              ) : openSessions.length === 0 ? (
                <div className="py-10 text-center">
                  <PlayCircle className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 dark:text-gray-500 text-sm">No active sessions</p>
                  <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold" onClick={() => router.push("/sessions")}>
                    Start one now
                  </Button>
                </div>
              ) : (
                openSessions.map(session => (
                  <div
                    key={session.id}
                    onClick={() => router.push(`/sessions/${session.id}`)}
                    className="flex items-center gap-3 py-3.5 border-b border-gray-50 dark:border-gray-800 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-colors"
                  >
                    <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <PlayCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{session.course?.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {session.attendance?.filter(a => a.status === "PRESENT").length || 0} present · {session.radiusMeters}m radius
                      </p>
                    </div>
                    <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0 text-xs font-bold flex-shrink-0">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse inline-block" />
                      LIVE
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardContent className="px-4 py-0">
              {recentActivity.length === 0 ? (
                <div className="py-10 text-center">
                  <Clock className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 dark:text-gray-500 text-sm">No activity yet</p>
                </div>
              ) : (
                recentActivity.map((item, i) => (
                  <ActivityItem key={i} {...item} />
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick members preview */}
      {members.length > 0 && (
        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">
              Class Members
              <span className="ml-2 text-sm font-normal text-gray-400">({members.length})</span>
            </h3>
            <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 text-xs" onClick={() => router.push("/members")}>
              See all <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {members.slice(0, 8).map(member => (
                  <div key={member.id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {member.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                      {member.user?.name?.split(" ")[0]}
                    </span>
                  </div>
                ))}
                {members.length > 8 && (
                  <div className="flex items-center px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">+{members.length - 8} more</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// ── Student Dashboard ──────────────────────────────────────
function StudentDashboard({ user }) {
  const router = useRouter();

  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ["student-class"],
    queryFn: async () => {
      const res = await api.get("/api/v1/class/student");
      return res.data.data.classSpace;
    },
    enabled: !!user,
  });

  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ["my-attendance"],
    queryFn: async () => {
      const res = await api.get("/api/v1/attendance/me");
      return res.data.data;
    },
    enabled: !!user,
  });

  const { data: sessionsData, isLoading: sessionsLoading } = useQuery({
    queryKey: ["class-sessions"],
    queryFn: async () => {
      const res = await api.get("/api/v1/sessions");
      return res.data.data.sessions;
    },
    enabled: !!user,
    refetchInterval: 15000,
  });

  const isLoading = classLoading || attendanceLoading || sessionsLoading;
  const classSpace = classData;
  const attendance = attendanceData?.attendance || [];
  const stats = attendanceData?.stats || [];
  const sessions = sessionsData || [];
  const openSessions = sessions.filter(s => s.isOpen);

  const totalPresent = attendanceData?.totalPresent || 0;
  const totalRecords = attendanceData?.totalRecords || 0;
  const overallPct = totalRecords > 0
    ? Math.round((totalPresent / totalRecords) * 100)
    : null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
        <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-700 to-cyan-800 border-none shadow-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-10 translate-x-10 blur-2xl" />
          <CardContent className="relative z-10 p-6 sm:p-8">
            <Badge className="bg-white/20 text-white border-none text-xs mb-3">
              {greeting()} 👋
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-1">
              {user?.name?.split(" ")[0]}
            </h2>
            <p className="text-blue-200 text-sm mb-1">
              {classSpace?.name || "Loading your class..."}
            </p>
            <p className="text-blue-300 text-xs font-mono mb-5">
              {user?.studentId}
            </p>

            <div className="flex flex-wrap gap-3">
              {openSessions.length > 0 ? (
                <Button
                  onClick={() => router.push("/attendance")}
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-sm"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Mark Attendance
                  <Badge className="ml-2 bg-emerald-500 text-white border-none text-xs">
                    {openSessions.length} open
                  </Badge>
                </Button>
              ) : (
                <Button
                  onClick={() => router.push("/courses")}
                  variant="secondary"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold shadow-sm"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  View Courses
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Open session alert */}
      {openSessions.length > 0 && (
        <motion.div variants={fadeUp} custom={1} initial="hidden" animate="visible">
          {openSessions.map(session => (
            <div
              key={session.id}
              onClick={() => router.push("/attendance")}
              className="flex items-center gap-4 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all"
            >
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <PlayCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                  Session Active — {session.course?.name}
                </p>
                <p className="text-emerald-600 dark:text-emerald-400 text-xs">
                  Tap to mark your attendance now
                </p>
              </div>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0" />
            </div>
          ))}
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Courses" value={classSpace?.courses?.length || "—"} icon={BookOpen} color="blue" delay={2} loading={classLoading} />
        <StatCard label="Avg Attendance" value={overallPct !== null ? `${overallPct}%` : "—"} icon={TrendingUp} color="emerald" delay={3} loading={attendanceLoading} />
        <StatCard label="Present" value={totalPresent} icon={CheckCircle2} color="violet" delay={4} loading={attendanceLoading} />
        <StatCard label="Classmates" value={classSpace ? (classSpace._count?.students || 0) : "—"} icon={Users} color="amber" delay={5} loading={classLoading} />
      </div>

      {/* My attendance per course */}
      {stats.length > 0 && (
        <motion.div variants={fadeUp} custom={6} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">My Attendance</h3>
            <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 text-xs" onClick={() => router.push("/history")}>
              Full history <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="space-y-3">
            {stats.map((stat, i) => {
              const pct = parseFloat(stat.percentage);
              const color = pct >= 75 ? "emerald" : pct >= 50 ? "amber" : "red";
              const barColor = { emerald: "bg-emerald-500", amber: "bg-amber-400", red: "bg-red-500" };
              const textColor = {
                emerald: "text-emerald-600 dark:text-emerald-400",
                amber: "text-amber-600 dark:text-amber-400",
                red: "text-red-600 dark:text-red-400",
              };
              return (
                <motion.div key={stat.courseId} variants={fadeUp} custom={i} initial="hidden" animate="visible">
                  <Card
                    className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 cursor-pointer hover:shadow-md transition-all"
                    onClick={() => router.push("/courses")}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{stat.courseName}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">{stat.courseCode}</p>
                        </div>
                        <p className={`font-black text-base flex-shrink-0 ml-3 ${textColor[color]}`}>
                          {stat.percentage}
                        </p>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${barColor[color]}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(pct, 100)}%` }}
                          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {stat.present} present · {stat.absent} absent
                        </p>
                        {pct < 75 && (
                          <p className="text-xs text-amber-500 font-semibold">Below 75%</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Recent activity */}
      {attendance.length > 0 && (
        <motion.div variants={fadeUp} custom={7} initial="hidden" animate="visible">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardContent className="px-4 py-0">
              {attendance.slice(0, 5).map((record, i) => {
                const isPresent = record.status === "PRESENT";
                const timeAgo = (date) => {
                  const diff = Date.now() - new Date(date).getTime();
                  const hours = Math.floor(diff / 3600000);
                  const days = Math.floor(diff / 86400000);
                  if (hours < 1) return "Just now";
                  if (hours < 24) return `${hours}h ago`;
                  return `${days}d ago`;
                };
                return (
                  <ActivityItem
                    key={record.id}
                    icon={isPresent ? CheckCircle2 : XCircle}
                    title={`${record.session?.course?.name}`}
                    sub={`Marked ${isPresent ? "present" : "absent"} · ${record.session?.course?.code}`}
                    time={timeAgo(record.markedAt)}
                    color={isPresent ? "green" : "red"}
                  />
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────
export default function DashboardPage() {
  const { user, isCourseRep, isStudent, _hasHydrated } = useAuth();

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 sm:px-6 pt-10 pb-4 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-black text-gray-900 dark:text-white text-base leading-none">Klassrep</h1>
              <p className="text-gray-400 dark:text-gray-500 text-xs">{greeting()}, {user?.name?.split(" ")[0]}</p>
            </div>
          </div>
          <Badge className={`text-xs font-bold ${
            isCourseRep
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
          }`}>
            {isCourseRep ? "Course Rep" : "Student"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 py-5 max-w-2xl mx-auto">
        {isCourseRep && <RepDashboard user={user} />}
        {isStudent && <StudentDashboard user={user} />}
      </div>
    </div>
  );
}
  
}
