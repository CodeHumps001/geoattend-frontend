"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, ArrowRight, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import useAuthStore from "@/store/authStore";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/api/v1/auth/login", data);
      const { token, user } = res.data.data;

      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      router.push("/dashboard");
    } catch (err) {
      const message =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#030712] flex overflow-hidden">
      {/* Left — Branding Panel */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col justify-start gap-18 w-1/2 bg-gradient-to-br from-gray-100 to-white dark:from-[#050e1f] dark:to-[#030712] border-r border-gray-200 dark:border-white/5 p-12 relative overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11   flex items-center justify-center shadow-2xl  overflow-hidden">
            <Image
              src="/logo.jpg" // place your image in public/
              alt="ClassRep Logo"
              width={55}
              height={55}
              className="object-cover rounded"
            />
          </div>
          <div>
            <h1 className="text-gray-900 dark:text-white font-black text-xl leading-none">
              KlassRep
            </h1>
            <p className="text-gray-600 dark:text-slate-400 text-xs">
              Smart Attendance Intelligence
            </p>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6 flex gap-3">
              Welcome
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                back.
              </span>
            </h2>
            <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed max-w-sm">
              Sign in to access your dashboard, track attendance, and manage
              your courses.
            </p>
          </motion.div>

          {/* Live stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-10 grid grid-cols-2 gap-4"
          >
            {[
              { value: "2,451", label: "Students online" },
              { value: "186", label: "Active sessions" },
              { value: "98.2%", label: "Accuracy rate" },
              { value: "50+", label: "Institutions" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-gray-200/50 dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-2xl p-4"
              >
                <p className="text-gray-900 dark:text-white font-black text-2xl">
                  {stat.value}
                </p>
                <p className="text-gray-600 dark:text-slate-500 text-xs mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom quote */}
        {/* <div className="relative z-10">
          <div className="border border-white/10 bg-white/5 rounded-2xl p-5">
            <p className="text-slate-300 text-sm leading-relaxed italic mb-4">
              "ClassRep eliminated the 10 minutes we used to waste on manual
              register every lecture."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                DK
              </div>
              <div>
                <p className="text-white text-sm font-semibold">
                  Dr. Kwame Mensah
                </p>
                <p className="text-slate-500 text-xs">Lecturer · KsTU</p>
              </div>
            </div>
          </div>
        </div> */}
      </motion.div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white dark:bg-[#030712]">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="w-11 h-11   flex items-center justify-center shadow-2xl  overflow-hidden">
              <Image
                src="/logo.jpg" // place your image in public/
                alt="ClassRep Logo"
                width={55}
                height={55}
                className="object-cover rounded"
              />
            </div>
            <span className="text-gray-900 dark:text-white font-black text-xl">
              KlassRep
            </span>
          </div>

          <motion.div
            variants={fadeUp}
            custom={0}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              Sign in
            </h2>
            <p className="text-gray-600 dark:text-slate-400 mb-8">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/register")}
                className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold transition-colors"
              >
                Create one
              </button>
            </p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <motion.div
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="visible"
            >
              <label className="block text-gray-700 dark:text-slate-300 text-sm font-semibold mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full bg-gray-50 dark:bg-white/5 border ${
                    errors.email
                      ? "border-red-500/50"
                      : "border-gray-200 dark:border-white/10"
                  } rounded-xl pl-12 pr-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-gray-100 dark:focus:bg-white/8 transition-all text-sm`}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 dark:text-red-400 text-xs mt-1.5 ml-1"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-700 dark:text-slate-300 text-sm font-semibold">
                  Password
                </label>
                <button
                  type="button"
                  className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 text-xs font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full bg-gray-50 dark:bg-white/5 border ${
                    errors.password
                      ? "border-red-500/50"
                      : "border-gray-200 dark:border-white/10"
                  } rounded-xl pl-12 pr-12 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-gray-100 dark:focus:bg-white/8 transition-all text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 dark:text-red-400 text-xs mt-1.5 ml-1"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </motion.div>

            {/* Submit */}
            <motion.div
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base flex items-center justify-center gap-3 shadow-2xl shadow-cyan-500/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                whileHover={
                  !loading
                    ? {
                        scale: 1.02,
                        boxShadow: "0 20px 40px rgba(34,211,238,0.35)",
                      }
                    : {}
                }
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.8,
                        ease: "linear",
                      }}
                    />
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </motion.div>
          </form>

          {/* Divider */}
          <motion.div
            variants={fadeUp}
            custom={4}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-4 my-8"
          >
            {/* <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-500 text-xs">or continue with</span>
            <div className="flex-1 h-px bg-white/10" /> */}
          </motion.div>

          {/* Demo accounts
          <motion.div
            variants={fadeUp}
            custom={5}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <p className="text-slate-500 text-xs text-center mb-3">
              Try a demo account
            </p>
            {[
              { role: "Student", email: "yaw@gmail.com", color: "cyan" },
              { role: "Lecturer", email: "mensah@kstu.edu.gh", color: "blue" },
              { role: "Admin", email: "admin@kstu.edu.gh", color: "indigo" },
            ].map((demo) => (
              <motion.button
                key={demo.role}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 transition-all flex items-center justify-between"
                onClick={() =>
                  toast.info(
                    `Use email: ${demo.email} with password: password123`,
                  )
                }
              >
                <span className="text-slate-300 text-sm font-medium">
                  {demo.role} Demo
                </span>
                <span className={`text-xs text-${demo.color}-400 font-mono`}>
                  {demo.email}
                </span>
              </motion.button>
            ))}
          </motion.div> */}

          <motion.p
            variants={fadeUp}
            custom={6}
            initial="hidden"
            animate="visible"
            className="text-gray-500 dark:text-slate-600 text-xs text-center mt-8"
          >
            By signing in you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
