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
  ShieldCheck,
  Smartphone,
  Sparkles,
  Users,
  Wifi,
  Lock,
  TrendingUp,
  Award,
  BookOpen,
  Zap,
  Copy,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

// ── Animation variants ────────────────────────────────────
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

function useScrollReveal(margin = "-80px") {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin });
  return [ref, isInView];
}

// ── Static Data ───────────────────────────────────────────
const statsData = {
  institutions: 50,
  studentsTracked: 15000,
  gpsAccuracy: 99.9,
  radius: 100,
  attendanceRate: 94.2,
  studentsOnline: 2451,
  sessionsToday: 186,
};

const sampleActivities = [
  {
    name: "Yaw Fosu",
    action: "Marked present · 12m from class",
    time: "Just now",
    status: "present",
  },
  {
    name: "CS301 Lecture",
    action: "Session started by Course Rep",
    time: "2 mins ago",
    status: "session",
  },
  {
    name: "Ama Serwaa",
    action: "Marked present · 8m from class",
    time: "5 mins ago",
    status: "present",
  },
  {
    name: "MATH201 Tutorial",
    action: "Session ended · 28 present",
    time: "10 mins ago",
    status: "session",
  },
];

// ── Ticker ────────────────────────────────────────────────
function Ticker() {
  const items = [
    "GPS Verified Attendance",
    "Live Analytics",
    "Instant Reports",
    `${statsData.institutions}+ Classes`,
    `${statsData.studentsTracked.toLocaleString()}+ Students`,
    "Real-time Sync",
    "Course Rep Powered",
    `${statsData.radius}m GPS Radius`,
    "Secure & Private",
    "Built for Schools",
  ];

  return (
    <div className="overflow-hidden border-y border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-[#050816] py-4">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm text-gray-600 dark:text-slate-400"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-cyan-400 flex-shrink-0" />
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// ── Stats Mini Card ───────────────────────────────────────
function StatsMiniCard({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-lg transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-600 dark:text-cyan-300">
          {icon}
        </div>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
          LIVE
        </div>
      </div>
      <h3 className="text-3xl font-black text-gray-900 dark:text-white">
        {typeof value === "number" ? value.toLocaleString() : value}
      </h3>
      <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">{title}</p>
    </motion.div>
  );
}

// ── Role Card ─────────────────────────────────────────────
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
      className="relative overflow-hidden rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 p-8 shadow-lg group"
    >
      <div
        className={`absolute top-0 right-0 w-48 h-48 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity ${color}`}
      />
      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-700 dark:text-white mb-6 group-hover:scale-110 transition-transform">
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
              <CheckCircle2 className="w-5 h-5 text-cyan-500 dark:text-cyan-400 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Feature Card ──────────────────────────────────────────
function FeatureCard({ icon, title, desc, delay }) {
  const [ref, inView] = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -5 }}
      className="border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-2xl p-6 hover:shadow-md transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-600 dark:text-cyan-300 mb-4">
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

// ── Step Card ─────────────────────────────────────────────
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

// ── Testimonial Card ──────────────────────────────────────
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
      className="border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 rounded-3xl p-7 shadow-sm"
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
          <AvatarFallback className="bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-sm font-bold">
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
          <p className="text-gray-500 dark:text-slate-500 text-xs">
            {role} · {school}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// ── Stat Block ────────────────────────────────────────────
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

// ── SectionHeader ─────────────────────────────────────────
function SectionHeader({
  badge,
  badgeIcon: BadgeIcon,
  title,
  subtitle,
  delay,
}) {
  const [ref, inView] = useScrollReveal();
  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="text-center mb-16"
    >
      <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-6">
        <BadgeIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
        <span className="text-cyan-700 dark:text-cyan-200 text-sm font-medium">
          {badge}
        </span>
      </div>
      <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-600 dark:text-slate-400 text-xl max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────
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
            ? "bg-white/90 dark:bg-[#050816]/90 backdrop-blur-2xl border-b border-gray-200 dark:border-white/10 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
              <Image
                src="/klassrep.png"
                alt="KlassRep"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            </div>
            <h1 className="text-gray-900 dark:text-white font-black text-xl leading-none">
              KlassRep
            </h1>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it works", "Roles", "Testimonials"].map(
              (item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
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
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 text-sm"
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
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl" />
          <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-3xl" />
          {/* Grid — works in both modes */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <motion.div
          style={{ y: heroY }}
          className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center w-full"
        >
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 mb-8"
            >
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
              <span className="text-cyan-700 dark:text-cyan-200 text-sm font-medium">
                Built Around Your Course Rep
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
                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 dark:from-cyan-300 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  the way it
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">
                  actually works
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-gray-600 dark:text-slate-400 text-xl leading-relaxed max-w-xl mb-10"
              >
                KlassRep puts your{" "}
                <strong className="text-gray-900 dark:text-white">
                  course rep
                </strong>{" "}
                in charge of attendance — the person already doing this job in
                real life. GPS-verified, fraud-proof, and live.
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
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/25"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push("/login")}
                  className="px-8 py-4 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-800 dark:text-white font-semibold transition-all hover:bg-gray-50 dark:hover:bg-white/10"
                >
                  Sign in instead
                </motion.button>
              </motion.div>

              <motion.div variants={fadeUp} className="flex items-center gap-5">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((n) => (
                    <Avatar
                      key={n}
                      className="border-2 border-white dark:border-[#030712] w-11 h-11"
                    >
                      <AvatarImage src={`https://i.pravatar.cc/100?img=${n}`} />
                      <AvatarFallback className="bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs">
                        U{n}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    Trusted by {statsData.institutions}+ classes
                  </p>
                  <p className="text-gray-500 dark:text-slate-400 text-sm">
                    {statsData.studentsTracked.toLocaleString()}+ students
                    actively tracked
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
              className="relative rounded-[32px] border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 backdrop-blur-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-gray-900 dark:text-white text-2xl font-black">
                    Live Dashboard
                  </h3>
                  <p className="text-gray-500 dark:text-slate-400 text-sm">
                    Real-time attendance monitoring
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400"
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  <span className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">
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

              {/* Activity feed */}
              <div className="rounded-3xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/20 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h4 className="text-gray-900 dark:text-white font-bold">
                    Live Activity Feed
                  </h4>
                  <BellRing className="w-5 h-5 text-cyan-600 dark:text-cyan-300" />
                </div>
                <div className="space-y-3">
                  {sampleActivities.map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-white/[0.03] px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            item.status === "present"
                              ? "bg-emerald-500/10 border border-emerald-400/20"
                              : "bg-cyan-500/10 border border-cyan-400/20"
                          }`}
                        >
                          <ShieldCheck
                            className={`w-5 h-5 ${
                              item.status === "present"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-cyan-600 dark:text-cyan-300"
                            }`}
                          />
                        </div>
                        <div>
                          <h5 className="text-gray-900 dark:text-white font-semibold text-sm">
                            {item.name}
                          </h5>
                          <p className="text-gray-500 dark:text-slate-400 text-xs">
                            {item.action}
                          </p>
                        </div>
                      </div>
                      <span className="text-gray-400 dark:text-slate-500 text-xs flex-shrink-0">
                        {item.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating card — verification */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-8 -right-8 hidden lg:block"
              >
                <div className="w-56 rounded-3xl border border-cyan-400/20 bg-white dark:bg-[#07111f]/95 backdrop-blur-2xl p-5 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <Wifi className="text-cyan-600 dark:text-cyan-300 w-5 h-5" />
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      SECURE
                    </span>
                  </div>
                  <h3 className="text-gray-900 dark:text-white text-3xl font-black mb-1">
                    {statsData.gpsAccuracy}%
                  </h3>
                  <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">
                    Verification Accuracy
                  </p>
                  <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${statsData.gpsAccuracy}%` }}
                      transition={{ duration: 2, delay: 0.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Floating card — present */}
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
                <div className="w-52 rounded-2xl border border-emerald-400/20 bg-white dark:bg-[#07111f]/95 backdrop-blur-2xl p-4 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      PRESENT
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white font-bold text-sm">
                    {sampleActivities[0].name}
                  </p>
                  <p className="text-gray-500 dark:text-slate-400 text-xs mt-0.5">
                    12m from class · Just now
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
          <span className="text-gray-500 dark:text-slate-500 text-sm font-medium">
            Scroll to explore
          </span>
          <ChevronDown className="text-gray-400 dark:text-slate-500 w-5 h-5" />
        </motion.div>
      </section>

      {/* ── Ticker ── */}
      <Ticker />

      {/* ── Stats ── */}
      <section className="py-24 px-6 border-b border-gray-100 dark:border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <StatBlock
            value={`${statsData.institutions}+`}
            label="Classes created"
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
                    <Globe className="w-4 h-4 text-cyan-600 dark:text-cyan-300" />
                    <span className="text-cyan-700 dark:text-cyan-200 text-sm font-medium">
                      How it works
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                    Three steps to modern attendance
                  </h2>
                  <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed">
                    No hardware. No paper. No manual entry. Just open KlassRep —
                    your course rep handles everything.
                  </p>
                </motion.div>
              );
            })()}
          </div>
          <div className="space-y-0">
            <StepCard
              number={1}
              title="Course rep creates the class"
              desc="The course rep registers and gets a unique class code. They share it with classmates on WhatsApp — students join in seconds."
              delay={0}
            />
            <StepCard
              number={2}
              title="Rep starts a session, students mark in"
              desc="When class begins, the rep opens KlassRep and taps Start Session. Students mark attendance with one tap — GPS checks they're physically there."
              delay={1}
            />
            <StepCard
              number={3}
              title="Records are generated instantly"
              desc="Attendance percentages update live. Everyone can see who's present, and the rep gets a full history for every course and session."
              delay={2}
            />
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section
        id="features"
        className="py-32 px-6 bg-gray-50 dark:bg-white/[0.02] border-y border-gray-100 dark:border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            badge="Platform Features"
            badgeIcon={Sparkles}
            title="Everything you need"
            subtitle="Built from the ground up for how students actually manage attendance."
            delay={0}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              delay={0}
              icon={<MapPin className="w-5 h-5" />}
              title="GPS Verification"
              desc="Real GPS coordinates checked on every mark — students can't fake being in class from their hostel room."
            />
            <FeatureCard
              delay={1}
              icon={<ShieldCheck className="w-5 h-5" />}
              title="Fraud Prevention"
              desc="Each student marks once per session. The system rejects duplicate and fraudulent entries automatically."
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
              icon={<Copy className="w-5 h-5" />}
              title="Class Code System"
              desc="Course rep gets a unique class code. Students join by entering it — no admin bottleneck."
            />
            <FeatureCard
              delay={5}
              icon={<Users className="w-5 h-5" />}
              title="Role-based Access"
              desc="Course reps manage. Students mark. Each role sees exactly what they need — nothing more."
            />
            <FeatureCard
              delay={6}
              icon={<Smartphone className="w-5 h-5" />}
              title="Mobile Friendly"
              desc="Fully responsive web app that works beautifully on any device — phone, tablet, or desktop."
            />
            <FeatureCard
              delay={7}
              icon={<Award className="w-5 h-5" />}
              title="Attendance Threshold"
              desc="Students see instantly when their attendance drops below 75% so they can act before it's too late."
            />
            <FeatureCard
              delay={8}
              icon={<BookOpen className="w-5 h-5" />}
              title="Course Management"
              desc="Course reps create and manage all courses for their class. No IT department needed."
            />
          </div>
        </div>
      </section>

      {/* ── Roles ── */}
      <section id="roles" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            badge="Built for everyone"
            badgeIcon={Users}
            title="Two roles, one platform"
            subtitle="Every person in your class gets a tailored experience designed for their needs."
            delay={0}
          />
          <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <RoleCard
              delay={0}
              title="For Course Reps"
              desc="You're already managing attendance in real life. KlassRep gives you the digital tools to do it faster, smarter, and with zero paper."
              icon={<Zap className="w-7 h-7" />}
              color="bg-cyan-500"
              features={[
                "Create your class with a unique code",
                "Start GPS-verified sessions instantly",
                "Monitor attendance in real time",
                "Full course and member management",
                "Share invite links via WhatsApp",
              ]}
            />
            <RoleCard
              delay={1}
              title="For Students"
              desc="Join your class in seconds with the code from your course rep. Mark attendance with one tap and always know where you stand."
              icon={<GraduationCap className="w-7 h-7" />}
              color="bg-blue-500"
              features={[
                "Join class instantly with class code",
                "One-tap GPS attendance marking",
                "Live attendance percentage per course",
                "See active sessions in real time",
                "Full attendance history",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        id="testimonials"
        className="py-32 px-6 bg-gray-50 dark:bg-white/[0.02] border-y border-gray-100 dark:border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            badge="Testimonials"
            badgeIcon={Award}
            title="Loved by students"
            subtitle="Real feedback from people using KlassRep every day."
            delay={0}
          />
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              delay={0}
              name="Yaw Fosu"
              role="Course Rep"
              school="KsTU CS Level 300"
              quote="I used to spend 10 minutes doing manual register every lecture. With KlassRep I just tap Start Session and everyone marks in. Done in 2 minutes."
              avatar="https://i.pravatar.cc/100?img=11"
            />
            <TestimonialCard
              delay={1}
              name="Ama Boateng"
              role="Student"
              school="KsTU CS Level 300"
              quote="I love seeing my attendance percentage per course. I knew immediately when I was getting close to the 75% threshold and made sure I attended more."
              avatar="https://i.pravatar.cc/100?img=5"
            />
            <TestimonialCard
              delay={2}
              name="Kofi Mensah"
              role="Student"
              school="KsTU IT Level 200"
              quote="Joining my class was so easy — my rep dropped the class code in our WhatsApp group and I was in within a minute. The GPS check is really smart."
              avatar="https://i.pravatar.cc/100?img=8"
            />
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-blue-600/5 dark:from-cyan-500/10 dark:to-blue-600/10 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto rounded-[40px] border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-2xl p-12 md:p-16 text-center shadow-xl">
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
                  Ready to modernize
                  <br />
                  attendance at your school?
                </h2>
                <p className="text-gray-600 dark:text-slate-400 text-xl max-w-2xl mx-auto mb-10">
                  KlassRep is free to start. Your course rep creates the class,
                  shares the code, and your whole class is running in minutes.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                  <motion.button
                    whileHover={{
                      scale: 1.04,
                      boxShadow: "0px 20px 40px rgba(34,211,238,0.35)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push("/register")}
                    className="px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-xl shadow-cyan-500/25 flex items-center gap-3 w-full sm:w-auto justify-center"
                  >
                    Start for free
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push("/login")}
                    className="px-10 py-5 rounded-2xl border border-gray-300 dark:border-white/10 bg-white dark:bg-white/5 text-gray-800 dark:text-white font-semibold transition-all hover:bg-gray-50 dark:hover:bg-white/10 w-full sm:w-auto"
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
      <footer className="border-t border-gray-200 dark:border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
                  <Image
                    src="/klassrep.png"
                    alt="KlassRep"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="text-gray-900 dark:text-white font-black text-lg">
                  KlassRep
                </span>
              </div>
              <p className="text-gray-500 dark:text-slate-500 text-sm leading-relaxed">
                Attendance management built around the people already doing the
                job — your course rep.
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
                      className="block text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300 text-sm transition-colors"
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
                      className="block text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300 text-sm transition-colors"
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
                    className="block text-gray-500 dark:text-slate-500 hover:text-gray-900 dark:hover:text-slate-300 text-sm transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 dark:text-slate-500 text-sm">
              © 2026 KlassRep. All rights reserved.
            </p>
            <p className="text-gray-400 dark:text-slate-500 text-sm">
              Built by{" "}
              <span className="text-gray-700 dark:text-slate-400 font-medium">
                Fosu Yaw Humphrey
              </span>{" "}
              · Velux Corporation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
