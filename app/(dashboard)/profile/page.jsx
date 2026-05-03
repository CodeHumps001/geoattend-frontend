"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

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
  Sparkles,
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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function ProfileRow({ icon: Icon, label, value, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/30 px-4 py-4"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-background shadow-sm border">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="truncate text-sm font-semibold text-foreground mt-1">
          {value || "—"}
        </p>
      </div>
    </motion.div>
  );
}

function MenuRow({ icon: Icon, label, sub, delay, danger, onClick }) {
  return (
    <motion.button
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full"
    >
      <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-background px-4 py-4 transition-all hover:bg-muted/40 hover:shadow-sm">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
            danger
              ? "bg-red-50 border-red-100 dark:bg-red-500/10 dark:border-red-500/20"
              : "bg-muted/40"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${
              danger ? "text-red-500" : "text-muted-foreground"
            }`}
          />
        </div>

        <div className="flex-1 text-left">
          <p
            className={`text-sm font-semibold ${
              danger ? "text-red-500" : "text-foreground"
            }`}
          >
            {label}
          </p>

          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>

        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
    </motion.button>
  );
}

export default function ProfilePage() {
  const { user, logout, isStudent, isLecturer } = useAuth();

  const router = useRouter();

  const roleTheme = {
    STUDENT: {
      gradient: "from-blue-600 via-blue-700 to-indigo-800",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
    },

    LECTURER: {
      gradient: "from-emerald-600 via-emerald-700 to-teal-800",
      badge:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    },

    ADMIN: {
      gradient: "from-violet-600 via-violet-700 to-purple-800",
      badge:
        "bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300",
    },
  };

  const currentTheme = roleTheme[user?.role] || roleTheme.STUDENT;

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              Profile
            </h1>

            <p className="text-muted-foreground mt-1">
              Manage your account information and settings.
            </p>
          </div>

          <Badge
            variant="outline"
            className="hidden sm:flex items-center gap-1 rounded-full px-4 py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Klassrep Account
          </Badge>
        </motion.div>

        {/* Hero Card */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="visible"
        >
          <Card
            className={`relative overflow-hidden border-0 bg-gradient-to-br ${currentTheme.gradient} text-white shadow-2xl`}
          >
            <div className="absolute -top-16 -right-10 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/10 blur-3xl" />

            <CardContent className="relative z-10 p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-5">
                  <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
                    <AvatarFallback className="bg-white/15 text-2xl font-black text-white backdrop-blur">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <Badge className={`mb-3 border-0 ${currentTheme.badge}`}>
                      {user?.role}
                    </Badge>

                    <h2 className="text-3xl font-black leading-tight">
                      {user?.name}
                    </h2>

                    <p className="text-sm text-white/75 mt-1">{user?.email}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="bg-white text-black hover:bg-white/90"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>

                  <Button
                    variant="outline"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20"
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Privacy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Side */}
          <div className="space-y-6 lg:col-span-7">
            {/* Account Details */}
            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Account Details</CardTitle>

                  <CardDescription>
                    Your personal and academic information.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ProfileRow
                    icon={User}
                    label="Full Name"
                    value={user?.name}
                    delay={3}
                  />

                  <ProfileRow
                    icon={Mail}
                    label="Email Address"
                    value={user?.email}
                    delay={4}
                  />

                  <ProfileRow
                    icon={Shield}
                    label="Role"
                    value={user?.role}
                    delay={5}
                  />

                  {isStudent && user?.student && (
                    <>
                      <ProfileRow
                        icon={Hash}
                        label="Student Code"
                        value={user.student?.studentCode}
                        delay={6}
                      />

                      <ProfileRow
                        icon={Building}
                        label="Department"
                        value={user.student?.department}
                        delay={7}
                      />

                      <ProfileRow
                        icon={GraduationCap}
                        label="Level"
                        value={
                          user.student?.level
                            ? `Level ${user.student.level}`
                            : null
                        }
                        delay={8}
                      />
                    </>
                  )}

                  {isLecturer && user?.lecturer && (
                    <>
                      <ProfileRow
                        icon={Hash}
                        label="Staff Code"
                        value={user.lecturer?.staffCode}
                        delay={6}
                      />

                      <ProfileRow
                        icon={Building}
                        label="Department"
                        value={user.lecturer?.department}
                        delay={7}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Side */}
          <div className="space-y-6 lg:col-span-5">
            {/* Settings */}
            <motion.div
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Settings</CardTitle>

                  <CardDescription>
                    Manage your preferences and security.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <MenuRow
                    icon={Bell}
                    label="Notifications"
                    sub="Manage your alerts and updates"
                    delay={5}
                    onClick={() => {}}
                  />

                  <MenuRow
                    icon={Shield}
                    label="Security"
                    sub="Password and authentication settings"
                    delay={6}
                    onClick={() => {}}
                  />

                  <MenuRow
                    icon={Settings}
                    label="Preferences"
                    sub="Customize your experience"
                    delay={7}
                    onClick={() => {}}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Support */}
            <motion.div
              variants={fadeUp}
              custom={5}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-border/60 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">Support</CardTitle>

                  <CardDescription>Need help using Klassrep?</CardDescription>
                </CardHeader>

                <CardContent className="space-y-3">
                  <MenuRow
                    icon={HelpCircle}
                    label="Help & FAQ"
                    sub="Find answers to common questions"
                    delay={8}
                    onClick={() => {}}
                  />

                  <MenuRow
                    icon={BookOpen}
                    label="Documentation"
                    sub="Learn more about the platform"
                    delay={9}
                    onClick={() => {}}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Logout */}
            <motion.div
              variants={fadeUp}
              custom={6}
              initial="hidden"
              animate="visible"
            >
              <Card className="border-red-100 dark:border-red-500/20 shadow-sm">
                <CardContent className="p-4">
                  <MenuRow
                    icon={LogOut}
                    label="Sign Out"
                    sub="You’ll need to login again"
                    danger
                    delay={10}
                    onClick={logout}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          variants={fadeUp}
          custom={7}
          initial="hidden"
          animate="visible"
        >
          <Separator className="mb-4" />

          <p className="text-center text-xs text-muted-foreground">
            Klassrep v1.0.0 · Built by Fosu Yaw Humphrey
          </p>
        </motion.div>
      </div>
    </div>
  );
}
