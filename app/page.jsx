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
  Zap,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import useAuthStore from "@/store/authStore";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

function useScrollReveal() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-80px",
  });

  return [ref, isInView];
}

const features = [
  "GPS Verified",
  "Live Analytics",
  "Instant Reports",
  "Attendance Insights",
  "Fraud Prevention",
  "Real-time Sync",
  "Smart Dashboard",
];

function Ticker() {
  return (
    <div className="overflow-hidden border-y border-white/10 bg-[#050816] py-4">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {[...features, ...features].map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-sm text-slate-300"
          >
            <div className="w-2 h-2 rounded-full bg-cyan-400" />
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function StatsMiniCard({ title, value, icon }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-300">
          {icon}
        </div>

        <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </div>
      </div>

      <h3 className="text-3xl font-black text-white">{value}</h3>
      <p className="text-slate-400 text-sm mt-1">{title}</p>
    </motion.div>
  );
}

function RoleCard({ title, desc, icon, color }) {
  const [ref, inView] = useScrollReveal();

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl"
    >
      <div
        className={`absolute top-0 right-0 w-40 h-40 blur-3xl opacity-20 ${color}`}
      />

      <div className="relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white mb-6">
          {icon}
        </div>

        <h3 className="text-2xl font-black text-white mb-3">{title}</h3>

        <p className="text-slate-400 leading-relaxed mb-6">{desc}</p>

        <div className="space-y-3">
          {["Smart tracking", "Real-time insights", "Secure management"].map(
            (item, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                {item}
              </div>
            ),
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const { scrollY } = useScroll();

  const heroY = useTransform(scrollY, [0, 600], [0, -120]);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => {
      setScrolled(v > 30);
    });

    return unsub;
  }, [scrollY]);

  return (
    <div className="min-h-screen bg-[#030712] overflow-x-hidden">
      {/* NAVBAR */}

      <motion.nav
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#050816]/80 backdrop-blur-2xl border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>

            <div>
              <h1 className="text-white font-black text-xl">GeoAttend</h1>
              <p className="text-slate-400 text-xs">
                Smart Attendance Intelligence
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Features", "Analytics", "Roles", "Pricing"].map((item, i) => (
              <a
                key={i}
                href="#"
                className="text-slate-300 hover:text-white transition-colors text-sm font-medium"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="hidden md:flex px-5 py-2.5 rounded-xl border border-white/10 text-slate-200 hover:bg-white/5 transition-all"
            >
              Sign in
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push("/register")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-2xl shadow-cyan-500/30"
            >
              Get Started
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* HERO */}

      <section className="relative min-h-screen flex items-center overflow-hidden px-6 pt-32 pb-20">
        {/* BACKGROUND */}

        <div className="absolute inset-0">
          <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-3xl" />

          <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <motion.div
          style={{ y: heroY }}
          className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center"
        >
          {/* LEFT CONTENT */}

          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 backdrop-blur-xl mb-8"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />

              <span className="text-cyan-200 text-sm font-medium">
                Next Generation Attendance Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-7xl font-black leading-[0.95] tracking-tight mb-8"
            >
              <span className="text-white">Attendance</span>

              <br />

              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Powered by
              </span>

              <br />

              <span className="text-white">Intelligence</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-xl leading-relaxed max-w-2xl mb-10"
            >
              GeoAttend transforms how institutions manage attendance with GPS
              verification, fraud prevention, live analytics, and
              enterprise-grade monitoring.
            </motion.p>

            {/* BUTTONS */}

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
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

              <button className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white font-semibold hover:bg-white/10 transition-all">
                Watch Demo
              </button>
            </motion.div>

            {/* USERS */}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-5"
            >
              <div className="flex -space-x-4">
                <Avatar className="border-2 border-[#030712] w-12 h-12">
                  <AvatarImage src="https://i.pravatar.cc/100?img=1" />
                  <AvatarFallback>YF</AvatarFallback>
                </Avatar>

                <Avatar className="border-2 border-[#030712] w-12 h-12">
                  <AvatarImage src="https://i.pravatar.cc/100?img=2" />
                  <AvatarFallback>AK</AvatarFallback>
                </Avatar>

                <Avatar className="border-2 border-[#030712] w-12 h-12">
                  <AvatarImage src="https://i.pravatar.cc/100?img=3" />
                  <AvatarFallback>JN</AvatarFallback>
                </Avatar>

                <Avatar className="border-2 border-[#030712] w-12 h-12">
                  <AvatarImage src="https://i.pravatar.cc/100?img=4" />
                  <AvatarFallback>MK</AvatarFallback>
                </Avatar>
              </div>

              <div>
                <p className="text-white font-semibold">
                  Trusted by 50+ institutions
                </p>

                <p className="text-slate-400 text-sm">
                  12,000+ students actively tracked
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE DASHBOARD */}

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-6 shadow-[0_0_100px_rgba(34,211,238,0.15)]"
            >
              {/* TOP */}

              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-white text-2xl font-black">
                    Live Dashboard
                  </h3>

                  <p className="text-slate-400 text-sm">
                    Real-time attendance monitoring
                  </p>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />

                  <span className="text-emerald-300 text-sm font-medium">
                    ACTIVE
                  </span>
                </div>
              </div>

              {/* STATS */}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <StatsMiniCard
                  title="Attendance Rate"
                  value="98.2%"
                  icon={<BarChart3 className="w-5 h-5" />}
                />

                <StatsMiniCard
                  title="Students Online"
                  value="2,451"
                  icon={<Users className="w-5 h-5" />}
                />

                <StatsMiniCard
                  title="GPS Accuracy"
                  value="99.8%"
                  icon={<MapPin className="w-5 h-5" />}
                />

                <StatsMiniCard
                  title="Sessions Today"
                  value="186"
                  icon={<Clock3 className="w-5 h-5" />}
                />
              </div>

              {/* ACTIVITY */}

              <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-white font-bold">Live Activity Feed</h4>

                  <BellRing className="w-5 h-5 text-cyan-300" />
                </div>

                <div className="space-y-4">
                  {[
                    {
                      name: "Yaw Fosu",
                      action: "Marked present",
                      time: "Just now",
                    },
                    {
                      name: "CS301 Lecture",
                      action: "Session started",
                      time: "2 mins ago",
                    },
                    {
                      name: "GPS Validation",
                      action: "Verified successfully",
                      time: "5 mins ago",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ x: 5 }}
                      className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                          <ShieldCheck className="w-5 h-5 text-cyan-300" />
                        </div>

                        <div>
                          <h5 className="text-white font-semibold">
                            {item.name}
                          </h5>

                          <p className="text-slate-400 text-sm">
                            {item.action}
                          </p>
                        </div>
                      </div>

                      <span className="text-slate-500 text-xs">
                        {item.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* FLOATING CARD */}

              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
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

                  <h3 className="text-white text-3xl font-black mb-1">99.9%</h3>

                  <p className="text-slate-400 text-sm mb-4">
                    Verification Accuracy
                  </p>

                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "99%" }}
                      transition={{
                        duration: 2,
                        delay: 0.5,
                      }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* SCROLL */}

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-slate-500 text-sm">Scroll to explore</span>

          <ChevronDown className="text-slate-500" />
        </motion.div>
      </section>

      {/* TICKER */}

      <Ticker />

      {/* FEATURES */}

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/20 mb-6">
              <Globe className="w-4 h-4 text-cyan-300" />

              <span className="text-cyan-200 text-sm font-medium">
                Enterprise Features
              </span>
            </div>

            <h2 className="text-5xl font-black text-white mb-6">
              Designed for modern institutions
            </h2>

            <p className="text-slate-400 text-xl max-w-3xl mx-auto">
              GeoAttend combines premium design with intelligent attendance
              automation to create a truly world-class experience.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <RoleCard
              title="For Students"
              desc="One-tap attendance with live tracking, smart history, and beautiful analytics."
              icon={<GraduationCap className="w-7 h-7" />}
              color="bg-cyan-500"
            />

            <RoleCard
              title="For Lecturers"
              desc="Manage sessions, monitor attendance in real-time, and generate reports instantly."
              icon={<Users className="w-7 h-7" />}
              color="bg-blue-500"
            />

            <RoleCard
              title="For Administrators"
              desc="Complete institution oversight with enterprise-grade insights and controls."
              icon={<Settings className="w-7 h-7" />}
              color="bg-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-16 text-center shadow-[0_0_120px_rgba(34,211,238,0.15)]">
          <h2 className="text-5xl font-black text-white mb-6 leading-tight">
            Built to feel premium.
            <br />
            Engineered to scale.
          </h2>

          <p className="text-slate-400 text-xl max-w-3xl mx-auto mb-10">
            GeoAttend is not just another attendance system. It is a complete
            intelligent infrastructure for schools, universities, and modern
            institutions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <motion.button
              whileHover={{
                scale: 1.04,
              }}
              whileTap={{
                scale: 0.97,
              }}
              onClick={() => router.push("/register")}
              className="px-10 py-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg shadow-2xl shadow-cyan-500/30 flex items-center gap-3"
            >
              Start Building
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            <button className="px-10 py-5 rounded-2xl border border-white/10 bg-white/5 text-white font-semibold hover:bg-white/10 transition-all">
              Book Demo
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer className="border-t border-white/10 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-black text-xl">GeoAttend</h3>

            <p className="text-slate-500 text-sm mt-1">
              Intelligent Attendance Infrastructure
            </p>
          </div>

          <div className="flex items-center gap-8 text-slate-400 text-sm">
            <a href="#">Features</a>
            <a href="#">Analytics</a>
            <a href="#">Security</a>
            <a href="#">Pricing</a>
          </div>

          <p className="text-slate-500 text-sm">
            © 2026 GeoAttend. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
