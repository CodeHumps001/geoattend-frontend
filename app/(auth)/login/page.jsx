"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, ArrowRight, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import useAuthStore from "@/store/authStore";
import Image from "next/image";

export const metadata = {
  title: "Sign In",
  description:
    "Sign in to your KlassRep account to manage your class or track your attendance.",
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
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await api.post("/api/v1/auth/login", data);
      const { token, user } = res.data.data;
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}! 👋`);
      router.push("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex overflow-hidden">
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-800 p-12 relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 flex items-center justify-center shadow-2xl overflow-hidden rounded-xl">
            <Image
              src="/klassrep.png"
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

        {/* Center content */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
              Welcome
              <br />
              <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
                back.
              </span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-sm">
              Sign in to manage your class, track attendance, and keep your
              students connected.
            </p>
          </motion.div>

          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-10 space-y-3"
          >
            {[
              {
                emoji: "📍",
                title: "GPS Verified",
                desc: "Students must be physically present",
              },
              {
                emoji: "⚡",
                title: "One tap marking",
                desc: "Open session, students mark instantly",
              },
              {
                emoji: "📊",
                title: "Live tracking",
                desc: "See who's present in real time",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-2xl p-4"
              >
                <span className="text-xl">{item.emoji}</span>
                <div>
                  <p className="text-gray-900 dark:text-white font-semibold text-sm">
                    {item.title}
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10">
          <div className="border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-white/5 rounded-2xl p-5">
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed italic mb-4">
              "Finally a system built around how we actually do attendance —
              through the course rep."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                YF
              </div>
              <div>
                <p className="text-gray-900 dark:text-white text-sm font-semibold">
                  Yaw Fosu
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">
                  Course Rep · KsTU CS Level 300
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 flex items-center justify-center shadow-2xl overflow-hidden rounded-xl">
              <Image
                src="/klassrep.png"
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

          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              Sign in
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => router.push("/register")}
                className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold transition-colors"
              >
                Create one
              </button>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full bg-white dark:bg-gray-900 border ${
                    errors.email
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-200 dark:border-gray-800"
                  } rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 transition-all text-sm`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-700 dark:text-gray-300 text-sm font-semibold">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full bg-white dark:bg-gray-900 border ${
                    errors.password
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-200 dark:border-gray-800"
                  } rounded-xl pl-11 pr-12 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 transition-all text-sm`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
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
                  Sign in <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-gray-400 dark:text-gray-600 text-xs text-center mt-8">
            By signing in you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
