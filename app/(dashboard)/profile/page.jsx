"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  User,
  Mail,
  LogOut,
  ChevronRight,
  Shield,
  Bell,
  HelpCircle,
  BookOpen,
  Hash,
  Building,
  GraduationCap,
  Settings,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Stats Card Component
function StatsCard({ title, value, icon: Icon, color, delay }) {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      className="h-full"
    >
      <Card className="h-full border border-gray-100 hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
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

// Info Row Component
function InfoRow({ icon: Icon, label, value, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0"
    >
      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-400">{label}</p>
        <p className="text-gray-900 font-semibold text-sm">{value || "—"}</p>
      </div>
    </motion.div>
  );
}

// Menu Item Component
function MenuItem({ icon: Icon, label, sub, onClick, delay, danger }) {
  return (
    <motion.button
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-4 py-3.5 px-4 rounded-xl hover:bg-gray-50 transition-all group"
    >
      <div
        className={`w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}
      >
        <Icon
          className={`w-4 h-4 ${danger ? "text-red-500" : "text-gray-500"}`}
        />
      </div>
      <div className="flex-1 text-left">
        <p
          className={`font-semibold text-sm ${danger ? "text-red-500" : "text-gray-700"}`}
        >
          {label}
        </p>
        {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
      </div>
      <ChevronRight
        className={`w-4 h-4 ${danger ? "text-red-300" : "text-gray-300"} flex-shrink-0`}
      />
    </motion.button>
  );
}

export default function ProfilePage() {
  const { user, logout, isStudent, isLecturer, isAdmin } = useAuth();
  const router = useRouter();

  const roleConfig = {
    STUDENT: {
      gradient: "from-blue-600 to-indigo-600",
      badge: "bg-blue-100 text-blue-700",
      icon: GraduationCap,
      title: "Student Profile",
    },
    LECTURER: {
      gradient: "from-emerald-600 to-teal-600",
      badge: "bg-emerald-100 text-emerald-700",
      icon: Users,
      title: "Lecturer Profile",
    },
    ADMIN: {
      gradient: "from-violet-600 to-purple-600",
      badge: "bg-violet-100 text-violet-700",
      icon: Shield,
      title: "Admin Profile",
    },
  };

  const config = roleConfig[user?.role] || roleConfig.STUDENT;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  // Mock stats - replace with real data from API
  const stats = isStudent
    ? [
        {
          title: "Courses Enrolled",
          value: "4",
          icon: BookOpen,
          color: "blue",
        },
        {
          title: "Attendance Rate",
          value: "94%",
          icon: TrendingUp,
          color: "emerald",
        },
        { title: "Perfect Weeks", value: "3", icon: Award, color: "purple" },
        { title: "Days Present", value: "28", icon: Calendar, color: "orange" },
      ]
    : isLecturer
      ? [
          {
            title: "Courses Teaching",
            value: "3",
            icon: BookOpen,
            color: "blue",
          },
          {
            title: "Total Students",
            value: "156",
            icon: Users,
            color: "emerald",
          },
          {
            title: "Avg Attendance",
            value: "88%",
            icon: TrendingUp,
            color: "purple",
          },
          {
            title: "Active Sessions",
            value: "2",
            icon: Clock,
            color: "orange",
          },
        ]
      : [
          { title: "Total Users", value: "1,247", icon: Users, color: "blue" },
          {
            title: "Active Courses",
            value: "42",
            icon: BookOpen,
            color: "emerald",
          },
          {
            title: "Sessions Today",
            value: "18",
            icon: Clock,
            color: "purple",
          },
          {
            title: "System Health",
            value: "99.9%",
            icon: Shield,
            color: "orange",
          },
        ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 pt-8 pb-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Profile
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="visible"
            >
              <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                <div
                  className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${config.gradient} opacity-5 rounded-full blur-3xl`}
                />
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto ring-4 ring-white shadow-xl">
                      <AvatarFallback
                        className={`text-3xl font-bold bg-gradient-to-br ${config.gradient} text-white`}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-3 border-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mt-4">
                    {user?.name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
                  <Badge
                    className={`mt-3 ${config.badge} border-0 font-semibold`}
                  >
                    {user?.role}
                  </Badge>

                  <Separator className="my-4" />

                  <div className="flex justify-around">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {isStudent ? "4" : isLecturer ? "3" : "42"}
                      </p>
                      <p className="text-xs text-gray-500">Courses</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {isStudent ? "94%" : isLecturer ? "88%" : "99.9%"}
                      </p>
                      <p className="text-xs text-gray-500">Activity</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {isStudent ? "Mar 2025" : isLecturer ? "5 yrs" : "100%"}
                      </p>
                      <p className="text-xs text-gray-500">Joined</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, idx) => (
                <StatsCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  icon={stat.icon}
                  color={stat.color}
                  delay={idx + 1}
                />
              ))}
            </div>
          </div>

          {/* Right Column - Details and Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <motion.div
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <CardTitle className="text-lg font-bold text-gray-900">
                      Personal Information
                    </CardTitle>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Your account details
                  </p>
                </CardHeader>
                <CardContent className="space-y-0">
                  <InfoRow
                    icon={User}
                    label="Full Name"
                    value={user?.name}
                    delay={5}
                  />
                  <InfoRow
                    icon={Mail}
                    label="Email Address"
                    value={user?.email}
                    delay={6}
                  />
                  <InfoRow
                    icon={Shield}
                    label="Role"
                    value={user?.role}
                    delay={7}
                  />

                  {/* Student-specific */}
                  {isStudent && user?.student && (
                    <>
                      <InfoRow
                        icon={Hash}
                        label="Student Code"
                        value={user.student?.studentCode}
                        delay={8}
                      />
                      <InfoRow
                        icon={Building}
                        label="Department"
                        value={user.student?.department}
                        delay={9}
                      />
                      <InfoRow
                        icon={GraduationCap}
                        label="Level"
                        value={`Level ${user.student?.level}`}
                        delay={10}
                      />
                    </>
                  )}

                  {/* Lecturer-specific */}
                  {isLecturer && user?.lecturer && (
                    <>
                      <InfoRow
                        icon={Hash}
                        label="Staff Code"
                        value={user.lecturer?.staffCode}
                        delay={8}
                      />
                      <InfoRow
                        icon={Building}
                        label="Department"
                        value={user.lecturer?.department}
                        delay={9}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Settings & Preferences */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Settings Section */}
              <motion.div
                variants={fadeUp}
                custom={11}
                initial="hidden"
                animate="visible"
              >
                <Card className="border-0 shadow-lg h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-gray-600" />
                      <CardTitle className="text-lg font-bold text-gray-900">
                        Settings
                      </CardTitle>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Customize your experience
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <MenuItem
                      icon={Bell}
                      label="Notifications"
                      sub="Manage your alerts and reminders"
                      delay={12}
                      onClick={() => {}}
                    />
                    <Separator className="mx-4 w-auto" />
                    <MenuItem
                      icon={Shield}
                      label="Security"
                      sub="Password and authentication"
                      delay={13}
                      onClick={() => {}}
                    />
                    <Separator className="mx-4 w-auto" />
                    <MenuItem
                      icon={Settings}
                      label="Preferences"
                      sub="App theme and language"
                      delay={14}
                      onClick={() => {}}
                    />
                  </CardContent>
                </Card>
              </motion.div>

              {/* Support Section */}
              <motion.div
                variants={fadeUp}
                custom={15}
                initial="hidden"
                animate="visible"
              >
                <Card className="border-0 shadow-lg h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-green-600" />
                      <CardTitle className="text-lg font-bold text-gray-900">
                        Support
                      </CardTitle>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Get help when you need it
                    </p>
                  </CardHeader>
                  <CardContent className="p-0">
                    <MenuItem
                      icon={HelpCircle}
                      label="Help Center"
                      sub="FAQs and troubleshooting"
                      delay={16}
                      onClick={() => {}}
                    />
                    <Separator className="mx-4 w-auto" />
                    <MenuItem
                      icon={BookOpen}
                      label="Documentation"
                      sub="Guides and tutorials"
                      delay={17}
                      onClick={() => {}}
                    />
                    <Separator className="mx-4 w-auto" />
                    <MenuItem
                      icon={Star}
                      label="Send Feedback"
                      sub="Help us improve"
                      delay={18}
                      onClick={() => {}}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Logout Section */}
            <motion.div
              variants={fadeUp}
              custom={19}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-0 shadow-lg border-red-100 bg-gradient-to-r from-white to-red-50/30">
                <CardContent className="p-0">
                  <MenuItem
                    icon={LogOut}
                    label="Sign Out"
                    sub="You'll need to sign in again"
                    delay={20}
                    danger
                    onClick={logout}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Version Info */}
            <motion.p
              variants={fadeUp}
              custom={21}
              initial="hidden"
              animate="visible"
              className="text-center text-gray-400 text-xs py-4"
            >
              KlassRep v2.0.0 · Built by Fosu Yaw Humphrey
            </motion.p>
          </div>
        </div>
      </div>
    </div>
  );
}
