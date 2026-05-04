"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BellRing,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Globe,
  GraduationCap,
  MapPin,
  Settings,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Wifi,
  Lock,
  TrendingUp,
  Award,
  BookOpen,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// ── Animation variants ─────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// ── Custom hook ────────────────────────────────────────────────
function useScrollReveal(margin = "-80px") {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin });
  return [ref, isInView];
}

// ── Static Data ─────────────────────────────────────────────────
const statsData = {
  institutions: 50,
  studentsTracked: 15000,
  gpsAccuracy: 99.9,
  radius: 100,
  attendanceRate: 94.2,
  studentsOnline: 2451,
  sessionsToday: 186,
};

// ── Ticker ─────────────────────────────────────────────────
function Ticker() {
  const TICKER_ITEMS = [
    `GPS Verified Attendance`,
    `Live Analytics`,
    `Instant Reports`,
    `${statsData.institutions}+ Institutions`,
    `${statsData.studentsTracked}+ Students`,
    `Real-time Sync`,
    `Role-based Access`,
    `${statsData.radius}m Accuracy`,
    `Secure & Private`,
    `Built for Schools`,
  ];

  return (
    <div className="overflow-hidden border-y border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#050816] py-4">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-300"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0" />
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ── Stats Mini Card ─────────────────────────────────────────────────
function StatsMiniCard({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ y: -4, borderColor: "rgba(34,211,238,0.3)" }}
      className="bg-gray-100 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-2xl transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300">
          {icon}
        </div>
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          LIVE
        </div>
      </div>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white">
        {typeof value === "number" ? value.toLocaleString() : value}
      </h3>
      <p className="text-gray-600 dark:text-slate-400 text-sm mt-1">{title}</p>
    </motion.div>
  );
}

// ── Role Card ──────────────────────────────────────────────────
function RoleCard({ title, desc, icon, color, features, delay }) {
  const [ref, inView] = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 backdrop-blur-xl p-8 shadow-2xl group"
    >
      <div
        className={`absolute top-0 right-0 w-48 h-48 blur-3xl opacity-15 group-hover:opacity-25 transition-opacity ${color}`}
      />
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/10 flex items-center justify-center text-gray-900 dark:text-white mb-6 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-6">
          {desc}
        </p>
        <div className="space-y-3">
          {features.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-gray-700 dark:text-slate-300"
            >
              <CheckCircle2 className="w-5 h-5 text-cyan-400 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Feature Card ───────────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay }) {
  const [ref, inView] = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -5, borderColor: "rgba(34,211,238,0.3)" }}
      className="border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 backdrop-blur-xl rounded-2xl p-6 transition-colors"
    >
      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300 mb-4">
        {icon}
      </div>
      <h4 className="text-gray-900 dark:text-white font-bold text-lg mb-2">
        {title}
      </h4>
      <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">
        {desc}
      </p>
    </motion.div>
  );
}

// ── Step Card ──────────────────────────────────────────────────
function StepCard({ number, title, desc, delay }) {
  const [ref, inView] = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="relative flex gap-6"
    >
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg shadow-cyan-500/30">
          {number}
        </div>
        {number < 3 && (
          <div className="w-0.5 h-full bg-gradient-to-b from-cyan-500/50 to-transparent mt-2" />
        )}
      </div>
      <div className="pb-10">
        <h3 className="text-gray-900 dark:text-white font-bold text-xl mb-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-slate-400 leading-relaxed">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

// ── Testimonial Card ───────────────────────────────────────────
function TestimonialCard({ name, role, school, quote, avatar, delay }) {
  const [ref, inView] = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -5 }}
      className="border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-7"
    >
      <div className="flex gap-1 mb-5">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-amber-400 text-lg">
            ★
          </span>
        ))}
      </div>
      <p className="text-gray-700 dark:text-slate-300 leading-relaxed mb-6 italic">
        "{quote}"
      </p>
      <div className="flex items-center gap-3">
        <Avatar className="w-11 h-11 border-2 border-cyan-400/30">
          <AvatarImage src={avatar} />
          <AvatarFallback className="bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 text-sm font-bold">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-gray-900 dark:text-white font-semibold text-sm">
            {name}
          </p>
          <p className="text-gray-600 dark:text-slate-500 text-xs">
            {role} · {school}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Stat Block ─────────────────────────────────────────────────────
function StatBlock({ value, label, delay }) {
  const [ref, inView] = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="text-center"
    >
      <motion.p
        className="text-5xl font-black text-gray-900 dark:text-white mb-2"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{
          duration: 0.6,
          delay: delay * 0.1 + 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {value}
      </motion.p>
      <p className="text-gray-600 dark:text-slate-400">{label}</p>
    </motion.div>
  );
}

// ── Sample Activities ─────────────────────────────────────────────────
const sampleActivities = [
  {
    name: "Yaw Fosu",
    action: "Marked present",
    time: "Just now",
    status: "present",
  },
  {
    name: "CS301 Lecture",
    action: "Session started by Dr. Mensah",
    time: "2 mins ago",
    status: "session",
  },
  {
    name: "Ama Serwaa",
    action: "Marked present",
    time: "5 mins ago",
    status: "present",
  },
  {
    name: "MATH201 Tutorial",
    action: "Session ended",
    time: "10 mins ago",
    status: "session",
  },
];

// ── Main Page ──────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, -120]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 30));
    return unsub;
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] overflow-x-hidden">
      {/* ── Navbar ── */}
      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 dark:bg-[#050816]/80 backdrop-blur-2xl border-b border-gray-200 dark:border-white/10 shadow-xl shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-11 h-11 flex items-center justify-center shadow-2xl overflow-hidden rounded-xl">
              <Image
                src="/logo.jpg"
                alt="KlassRep Logo"
                width={55}
                height={55}
                className="object-cover rounded"
              />
            </div>
            <div>
              <h1 className="text-gray-900 dark:text-white font-black text-xl leading-none">
                KlassRep
              </h1>
            </div>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it works", "Roles", "Testimonials"].map(
              (item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-gray-700 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
                  whileHover={{ y: -1 }}
                >
                  {item}
                </motion.a>
              ),
            )}
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => router.push("/login")}
              className="hidden md:flex px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/10 text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Sign in
            </motion.button>
            <motion.button
              onClick={() => router.push("/register")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-2xl shadow-cyan-500/30 text-sm"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(34,211,238,0.35)",
              }}
              whileTap={{ scale: 0.96 }}
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden px-6 pt-32 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-cyan-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <motion.div
          style={{ y: heroY }}
          className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-start w-full"
        >
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 backdrop-blur-xl mb-8"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span className="text-cyan-200 text-sm font-medium">
                Next Generation Attendance Platform
              </span>
            </motion.div>

            <motion.div variants={stagger} initial="hidden" animate="visible">
              <motion.h1
                variants={fadeUp}
                className="text-6xl md:text-7xl font-black leading-[0.95] tracking-tight mb-8"
              >
                <span className="text-gray-900 dark:text-white">
                  Attendance
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  Powered by
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  Intelligence
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-gray-600 dark:text-slate-400 text-xl leading-relaxed max-w-xl mb-10"
              >
                KlassRep transforms how institutions manage attendance with GPS
                verification, fraud prevention, live analytics, and role-based
                access — all in one platform.
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="flex flex-col sm:flex-row gap-4 mb-12"
              >
                <motion.button
                  whileHover={{
                    scale: 1.04,
                    boxShadow: "0px 20px 40px rgba(34,211,238,0.35)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/register")}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-2xl shadow-cyan-500/30"
                >
                  Launch Platform
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(255,255,255,0.08)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/login")}
                  className="px-8 py-4 rounded-2xl border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 backdrop-blur-xl text-gray-900 dark:text-white font-semibold transition-all"
                >
                  Sign in instead
                </motion.button>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-5">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((n) => (
                    <Avatar
                      key={n}
                      className="border-2 border-[#030712] w-11 h-11"
                    >
                      <AvatarImage src={`https://i.pravatar.cc/100?img=${n}`} />
                      <AvatarFallback className="bg-cyan-500/20 text-cyan-300 text-xs">
                        U{n}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    Trusted by 50+ institutions
                  </p>
                  <p className="text-slate-400 text-sm">
                    15,000+ students actively tracked
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Right — Dashboard preview */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="relative rounded-[32px] border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 backdrop-blur-2xl p-6 shadow-[0_0_100px_rgba(34,211,238,0.12)]"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-gray-900 dark:text-white text-2xl font-black">
                    Live Dashboard
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Real-time attendance monitoring
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-emerald-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <span className="text-emerald-300 text-sm font-medium">
                    ACTIVE
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <StatsMiniCard
                  title="Attendance Rate"
                  value={`${statsData.attendanceRate}%`}
                  icon={<BarChart3 className="w-5 h-5" />}
                />
                <StatsMiniCard
                  title="Students Online"
                  value={statsData.studentsOnline}
                  icon={<Users className="w-5 h-5" />}
                />
                <StatsMiniCard
                  title="GPS Accuracy"
                  value={`${statsData.gpsAccuracy}%`}
                  icon={<MapPin className="w-5 h-5" />}
                />
                <StatsMiniCard
                  title="Sessions Today"
                  value={statsData.sessionsToday}
                  icon={<Clock3 className="w-5 h-5" />}
                />
              </div>

              <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-black/20 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-gray-900 dark:text-white font-bold">
                    Live Activity Feed
                  </h4>
                  <BellRing className="w-5 h-5 text-cyan-300" />
                </div>
                <div className="space-y-3">
                  {sampleActivities.slice(0, 4).map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-100 dark:bg-white/[0.03] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            item.status === "present"
                              ? "bg-emerald-500/10 border border-emerald-400/20"
                              : item.status === "absent"
                                ? "bg-red-500/10 border border-red-400/20"
                                : "bg-cyan-500/10 border border-cyan-400/20"
                          }`}
                        >
                          <ShieldCheck
                            className={`w-5 h-5 ${
                              item.status === "present"
                                ? "text-emerald-400"
                                : item.status === "absent"
                                  ? "text-red-400"
                                  : "text-cyan-300"
                            }`}
                          />
                        </div>
                        <div>
                          <h5 className="text-gray-900 dark:text-white font-semibold text-sm">
                            {item.name}
                          </h5>
                          <p className="text-slate-400 text-xs">
                            {item.action}
                          </p>
                        </div>
                      </div>
                      <span className="text-slate-500 text-xs flex-shrink-0">
                        {item.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating verification card */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 -right-8 hidden lg:block"
              >
                <div className="w-56 rounded-3xl border border-cyan-400/20 bg-[#07111f]/90 backdrop-blur-2xl p-5 shadow-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <Wifi className="text-cyan-300 w-5 h-5" />
                    <span className="text-emerald-400 text-xs font-semibold">
                      SECURE
                    </span>
                  </div>
                  <h3 className="text-gray-900 dark:text-white text-3xl font-black mb-1">
                    {statsData.gpsAccuracy}%
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Verification Accuracy
                  </p>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${statsData.gpsAccuracy}%` }}
                      transition={{ duration: 2, delay: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Floating marked card */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -bottom-6 -left-8 hidden lg:block"
              >
                <div className="w-48 rounded-2xl border border-emerald-400/20 bg-[#07111f]/90 backdrop-blur-2xl p-4 shadow-2xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-emerald-400 text-xs font-semibold">
                      PRESENT
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-bold text-sm">
                    {sampleActivities[0]?.name || "Student"}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Just now · marked present
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-slate-500 text-sm font-medium">
            Scroll to explore
          </span>
          <ChevronDown className="text-slate-500 w-5 h-5" />
        </motion.div>
      </section>

      {/* ── Ticker ── */}
      <Ticker />

      {/* ── Stats ── */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <StatBlock
            value={`${statsData.institutions}+`}
            label="Institutions"
            delay={0}
          />
          <StatBlock
            value={`${statsData.studentsTracked.toLocaleString()}+`}
            label="Students tracked"
            delay={1}
          />
          <StatBlock
            value={`${statsData.gpsAccuracy}%`}
            label="GPS accuracy"
            delay={2}
          />
          <StatBlock
            value={`${statsData.radius}m`}
            label="Attendance radius"
            delay={3}
          />
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-20 items-start">
          <div>
            {(() => {
              const [ref, inView] = useScrollReveal();
              return (
                <motion.div
                  ref={ref}
                  variants={fadeUp}
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                >
                  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-6">
                    <Globe className="w-4 h-4 text-cyan-300" />
                    <span className="text-cyan-200 text-sm font-medium">
                      How it works
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                    Three steps to modern attendance
                  </h2>
                  <p className="text-slate-400 text-lg leading-relaxed">
                    No hardware. No paper. No manual entry. Just open KlassRep
                    and the GPS does the rest.
                  </p>
                </motion.div>
              );
            })()}
          </div>
          <div className="space-y-0">
            <StepCard
              number={1}
              title="Lecturer starts a session"
              desc="The lecturer opens KlassRep and taps Start Class. Their phone GPS automatically sets the classroom location — no manual coordinates needed."
              delay={0}
            />
            <StepCard
              number={2}
              title="Students mark attendance"
              desc="Students tap once to mark attendance. KlassRep checks GPS in real time — within 100m means PRESENT, outside means ABSENT. No faking it."
              delay={1}
            />
            <StepCard
              number={3}
              title="Reports generated instantly"
              desc="Attendance percentages update live. Lecturers and admins see who attended, when, and from exactly where — all in one beautiful dashboard."
              delay={2}
            />
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section
        id="features"
        className="py-32 px-6 bg-white/[0.02] border-y border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          {(() => {
            const [ref, inView] = useScrollReveal();
            return (
              <motion.div
                ref={ref}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-6">
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span className="text-cyan-200 text-sm font-medium">
                    Platform Features
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                  Everything you need
                </h2>
                <p className="text-slate-400 text-xl max-w-2xl mx-auto">
                  Built from the ground up for educational institutions of any
                  size.
                </p>
              </motion.div>
            );
          })()}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              delay={0}
              icon={<MapPin className="w-5 h-5" />}
              title="GPS Verification"
              desc="Real GPS coordinates checked on every mark — students can't fake being in class from their dorm room."
            />
            <FeatureCard
              delay={1}
              icon={<ShieldCheck className="w-5 h-5" />}
              title="Fraud Prevention"
              desc="Each student can only mark attendance once per session. The system prevents duplicate and fraudulent entries."
            />
            <FeatureCard
              delay={2}
              icon={<BarChart3 className="w-5 h-5" />}
              title="Live Analytics"
              desc="Attendance percentages calculated automatically and updated in real time as students mark in."
            />
            <FeatureCard
              delay={3}
              icon={<Lock className="w-5 h-5" />}
              title="JWT Security"
              desc="Every request is authenticated with secure JSON Web Tokens. Your data stays private and protected."
            />
            <FeatureCard
              delay={4}
              icon={<TrendingUp className="w-5 h-5" />}
              title="Attendance Reports"
              desc="Generate detailed reports per student, course, or session. Export data for academic records."
            />
            <FeatureCard
              delay={5}
              icon={<Users className="w-5 h-5" />}
              title="Role-based Access"
              desc="Students, Lecturers, and Admins each see only what they need — clean, focused dashboards for every role."
            />
            <FeatureCard
              delay={6}
              icon={<Smartphone className="w-5 h-5" />}
              title="Mobile Friendly"
              desc="Fully responsive web app plus a dedicated React Native mobile app — works beautifully on any device."
            />
            <FeatureCard
              delay={7}
              icon={<Award className="w-5 h-5" />}
              title="Attendance Threshold"
              desc="Students and admins are instantly notified when attendance drops below acceptable academic thresholds."
            />
            <FeatureCard
              delay={8}
              icon={<BookOpen className="w-5 h-5" />}
              title="Course Management"
              desc="Lecturers create and manage courses. Admins enroll students. Everything is organized by semester."
            />
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section id="roles" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          {(() => {
            const [ref, inView] = useScrollReveal();
            return (
              <motion.div
                ref={ref}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-6">
                  <Users className="w-4 h-4 text-cyan-300" />
                  <span className="text-cyan-200 text-sm font-medium">
                    Built for everyone
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                  One platform, three roles
                </h2>
                <p className="text-slate-400 text-xl max-w-2xl mx-auto">
                  Every person at your school gets a tailored experience.
                </p>
              </motion.div>
            );
          })()}

          <div className="grid lg:grid-cols-3 gap-8">
            <RoleCard
              delay={0}
              title="For Students"
              desc="Mark attendance with one tap, view your percentage per course, and track your session history in a clean personal dashboard."
              icon={<GraduationCap className="w-7 h-7" />}
              color="bg-cyan-500"
              features={[
                "One-tap GPS attendance marking",
                "Live attendance percentage",
                "Course enrollment overview",
                "Session history & records",
              ]}
            />
            <RoleCard
              delay={1}
              title="For Lecturers"
              desc="Start sessions with your phone GPS, monitor who's present in real time, and manage all your courses from one place."
              icon={<Users className="w-7 h-7" />}
              color="bg-blue-500"
              features={[
                "Start GPS-verified sessions",
                "Live attendance monitoring",
                "Course & enrollment management",
                "Per-student attendance reports",
              ]}
            />
            <RoleCard
              delay={2}
              title="For Admins"
              desc="Full institution oversight — manage every user, course, and attendance record with enterprise-grade controls and insights."
              icon={<Settings className="w-7 h-7" />}
              color="bg-indigo-500"
              features={[
                "Manage all users & roles",
                "Full attendance reports",
                "Enroll students in courses",
                "Institution-wide analytics",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        id="testimonials"
        className="py-32 px-6 bg-white/[0.02] border-y border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          {(() => {
            const [ref, inView] = useScrollReveal();
            return (
              <motion.div
                ref={ref}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                className="text-center mb-16"
              >
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-6">
                  <Award className="w-4 h-4 text-cyan-300" />
                  <span className="text-cyan-200 text-sm font-medium">
                    Testimonials
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                  Loved by educators
                </h2>
                <p className="text-slate-400 text-xl max-w-2xl mx-auto">
                  Real feedback from institutions using KlassRep.
                </p>
              </motion.div>
            );
          })()}

          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              delay={0}
              name="Dr. Kwame Mensah"
              role="Lecturer"
              school="KsTU"
              quote="KlassRep eliminated the 10 minutes we used to waste doing manual register. I start my session, students mark in, and I see everything live."
              avatar="https://i.pravatar.cc/100?img=11"
            />
            <TestimonialCard
              delay={1}
              name="Ama Boateng"
              role="Student"
              school="KsTU"
              quote="I love how simple it is. One tap and I'm marked present. No more worrying about the lecturer forgetting to mark me or losing paper registers."
              avatar="https://i.pravatar.cc/100?img=5"
            />
            <TestimonialCard
              delay={2}
              name="Emmanuel Asante"
              role="Academic Admin"
              school="KsTU"
              quote="The reports are incredible. I can pull up any student's attendance across all courses in seconds. What used to take hours now takes a click."
              avatar="https://i.pravatar.cc/100?img=8"
            />
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-600/10 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto rounded-[40px] border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 backdrop-blur-2xl p-16 text-center shadow-[0_0_120px_rgba(34,211,238,0.12)]">
          {(() => {
            const [ref, inView] = useScrollReveal();
            return (
              <motion.div
                ref={ref}
                variants={fadeUp}
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
              >
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                  Built to feel premium.
                  <br />
                  Engineered to scale.
                </h2>
                <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">
                  KlassRep is not just another attendance system. It is a
                  complete intelligent infrastructure for schools, universities,
                  and modern institutions.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                  <motion.button
                    whileHover={{
                      scale: 1.04,
                      boxShadow: "0px 20px 40px rgba(34,211,238,0.35)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push("/register")}
                    className="px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-2xl shadow-cyan-500/30 flex items-center gap-3 w-full sm:w-auto justify-center"
                  >
                    Start for free
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(255,255,255,0.08)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push("/login")}
                    className="px-10 py-5 rounded-2xl border border-gray-300 dark:border-white/10 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-semibold transition-all w-full sm:w-auto"
                  >
                    Sign in instead
                  </motion.button>
                </div>
              </motion.div>
            );
          })()}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 flex items-center justify-center shadow-2xl overflow-hidden rounded-xl">
                  <Image
                    src="/logo.jpg"
                    alt="KlassRep Logo"
                    width={55}
                    height={55}
                    className="object-cover rounded"
                  />
                </div>
                <span className="text-gray-900 dark:text-white font-black text-lg">
                  KlassRep
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Intelligent attendance infrastructure for modern educational
                institutions.
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white font-bold mb-4 text-sm">
                Product
              </h4>
              <div className="space-y-3">
                {["Features", "How it works", "Roles", "Security"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className="block text-slate-500 hover:text-slate-300 text-sm transition-colors"
                    >
                      {item}
                    </a>
                  ),
                )}
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white font-bold mb-4 text-sm">
                Platform
              </h4>
              <div className="space-y-3">
                {["Web App", "Mobile App", "API Docs", "Changelog"].map(
                  (item) => (
                    <a
                      key={item}
                      href="#"
                      className="block text-slate-500 hover:text-slate-300 text-sm transition-colors"
                    >
                      {item}
                    </a>
                  ),
                )}
              </div>
            </div>
            <div>
              <h4 className="text-gray-900 dark:text-white font-bold mb-4 text-sm">
                Company
              </h4>
              <div className="space-y-3">
                {["About", "Blog", "Careers", "Contact"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="block text-slate-500 hover:text-slate-300 text-sm transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 KlassRep. All rights reserved.
            </p>
            <p className="text-slate-500 text-sm">
              Built by{" "}
              <span className="text-slate-400 font-medium">
                Fosu Yaw Humphrey
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
