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

function ProfileRow({ icon: Icon, label, value, delay }) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0"
    >
      <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-400 font-medium">{label}</p>
        <p className="text-gray-900 font-semibold text-sm truncate">
          {value || "—"}
        </p>
      </div>
    </motion.div>
  );
}

function MenuRow({
  icon: Icon,
  label,
  sub,
  color = "gray",
  onClick,
  delay,
  danger,
}) {
  const iconColors = {
    gray: "bg-gray-50 text-gray-500",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-500",
    orange: "bg-orange-50 text-orange-500",
  };

  return (
    <motion.button
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="w-full flex items-center gap-4 py-3.5 border-b border-gray-50 last:border-0"
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${iconColors[color]}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 text-left">
        <p
          className={`font-semibold text-sm ${danger ? "text-red-500" : "text-gray-800"}`}
        >
          {label}
        </p>
        {sub && <p className="text-gray-400 text-xs mt-0.5">{sub}</p>}
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
    </motion.button>
  );
}

export default function ProfilePage() {
  const { user, logout, isStudent, isLecturer, isAdmin } = useAuth();
  const router = useRouter();

  const roleColors = {
    STUDENT: {
      bg: "from-blue-500 to-indigo-600",
      badge: "bg-blue-100 text-blue-700",
    },
    LECTURER: {
      bg: "from-emerald-500 to-teal-600",
      badge: "bg-emerald-100 text-emerald-700",
    },
    ADMIN: {
      bg: "from-violet-500 to-purple-600",
      badge: "bg-violet-100 text-violet-700",
    },
  };

  const colors = roleColors[user?.role] || roleColors.STUDENT;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 sticky top-0 z-40">
        <h1 className="text-2xl font-black text-gray-900">Profile</h1>
        <p className="text-gray-400 text-sm">Manage your account</p>
      </div>

      <div className="px-5 py-5 max-w-lg mx-auto space-y-5">
        {/* Avatar Card */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className={`bg-gradient-to-br ${colors.bg} rounded-3xl p-6 text-white relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-2xl font-black text-white border border-white/30">
              {initials}
            </div>
            <div>
              <h2 className="text-xl font-black leading-tight">{user?.name}</h2>
              <p className="text-white/70 text-sm">{user?.email}</p>
              <span className="inline-block mt-2 text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Account Details */}
        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5"
        >
          <div className="py-3 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Account Details
            </p>
          </div>
          <ProfileRow
            icon={User}
            label="Full Name"
            value={user?.name}
            delay={2}
          />
          <ProfileRow
            icon={Mail}
            label="Email Address"
            value={user?.email}
            delay={3}
          />
          <ProfileRow icon={Shield} label="Role" value={user?.role} delay={4} />

          {/* Student-specific */}
          {isStudent && user?.student && (
            <>
              <ProfileRow
                icon={Hash}
                label="Student Code"
                value={user.student?.studentCode}
                delay={5}
              />
              <ProfileRow
                icon={Building}
                label="Department"
                value={user.student?.department}
                delay={6}
              />
              <ProfileRow
                icon={GraduationCap}
                label="Level"
                value={
                  user.student?.level ? `Level ${user.student.level}` : null
                }
                delay={7}
              />
            </>
          )}

          {/* Lecturer-specific */}
          {isLecturer && user?.lecturer && (
            <>
              <ProfileRow
                icon={Hash}
                label="Staff Code"
                value={user.lecturer?.staffCode}
                delay={5}
              />
              <ProfileRow
                icon={Building}
                label="Department"
                value={user.lecturer?.department}
                delay={6}
              />
            </>
          )}
        </motion.div>

        {/* Settings */}
        <motion.div
          variants={fadeUp}
          custom={5}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5"
        >
          <div className="py-3 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Settings
            </p>
          </div>
          <MenuRow
            icon={Bell}
            label="Notifications"
            sub="Manage your alerts"
            color="orange"
            delay={6}
            onClick={() => {}}
          />
          <MenuRow
            icon={Shield}
            label="Security"
            sub="Password and authentication"
            color="blue"
            delay={7}
            onClick={() => {}}
          />
          <MenuRow
            icon={Settings}
            label="Preferences"
            sub="App settings"
            color="gray"
            delay={8}
            onClick={() => {}}
          />
        </motion.div>

        {/* Support */}
        <motion.div
          variants={fadeUp}
          custom={8}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5"
        >
          <div className="py-3 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Support
            </p>
          </div>
          <MenuRow
            icon={HelpCircle}
            label="Help & FAQ"
            sub="Get answers to common questions"
            color="green"
            delay={9}
            onClick={() => {}}
          />
          <MenuRow
            icon={BookOpen}
            label="Documentation"
            sub="Learn how to use Klassrep"
            color="blue"
            delay={10}
            onClick={() => {}}
          />
        </motion.div>

        {/* Logout */}
        <motion.div
          variants={fadeUp}
          custom={10}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-red-100 shadow-sm px-5"
        >
          <MenuRow
            icon={LogOut}
            label="Sign out"
            sub="You'll need to sign in again"
            color="red"
            delay={11}
            danger
            onClick={logout}
          />
        </motion.div>

        {/* App version */}
        <motion.p
          variants={fadeUp}
          custom={12}
          initial="hidden"
          animate="visible"
          className="text-center text-gray-300 text-xs pb-4"
        >
          Klassrep v1.0.0 · Built by Velux Corporation
        </motion.p>
      </div>
    </div>
  );
}
