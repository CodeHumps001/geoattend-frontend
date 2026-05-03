"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  User,
  GraduationCap,
  Users,
  Settings,
  CheckCircle2,
  Hash,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import Image from "next/image";

const baseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["STUDENT", "LECTURER", "ADMIN"], {
    errorMap: () => ({ message: "Please select a role" }),
  }),
  studentCode: z.string().optional(),
  department: z.string().optional(),
  level: z.coerce.number().optional(),
  staffCode: z.string().optional(),
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const slideIn = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, x: -30, transition: { duration: 0.3 } },
};

const ROLES = [
  {
    value: "STUDENT",
    label: "Student",
    desc: "Mark attendance and track your progress",
    icon: GraduationCap,
    color: "cyan",
  },
  {
    value: "LECTURER",
    label: "Lecturer",
    desc: "Start sessions and monitor your classes",
    icon: Users,
    color: "blue",
  },
  {
    value: "ADMIN",
    label: "Admin",
    desc: "Manage your institution end to end",
    icon: Settings,
    color: "indigo",
  },
];

function InputField({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="block text-gray-700 dark:text-slate-300 text-sm font-semibold mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-slate-500" />
        )}
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-500 dark:text-red-400 text-xs mt-1.5 ml-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1 = base info, 2 = role selection, 3 = role details
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm({ resolver: zodResolver(baseSchema) });

  const watchedRole = watch("role");

  const goToStep2 = async () => {
    const valid = await trigger(["name", "email", "password"]);
    if (valid) setStep(2);
  };

  const goToStep3 = async () => {
    if (!watchedRole) {
      toast.error("Please select a role to continue");
      return;
    }
    if (watchedRole === "ADMIN") {
      handleSubmit(onSubmit)();
      return;
    }
    setStep(3);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Validate role-specific fields
      if (data.role === "STUDENT") {
        if (!data.studentCode || !data.department || !data.level) {
          toast.error("Please fill in all student details");
          setLoading(false);
          return;
        }
      }
      if (data.role === "LECTURER") {
        if (!data.staffCode || !data.department) {
          toast.error("Please fill in all lecturer details");
          setLoading(false);
          return;
        }
      }

      await api.post("/api/v1/auth/register", data);
      toast.success("Account created successfully! Please sign in.");
      router.push("/login");
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
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
        className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-gray-100 to-white dark:from-[#050e1f] dark:to-[#030712] border-r border-gray-200 dark:border-white/5 p-12 relative overflow-hidden"
      >
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
          <h2 className="text-5xl flex gap-4 font-black text-gray-900 dark:text-white leading-tight mb-6">
            Join the
            <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              future.
            </span>
          </h2>
          <p className="text-gray-600 dark:text-slate-400 text-lg leading-relaxed max-w-sm mb-10">
            Create your account and bring intelligent GPS attendance tracking to
            your institution.
          </p>

          {/* Step indicators */}
          <div className="space-y-4">
            {[
              {
                n: 1,
                label: "Create your account",
                desc: "Name, email and password",
              },
              {
                n: 2,
                label: "Choose your role",
                desc: "Student, Lecturer, or Admin",
              },
              {
                n: 3,
                label: "Complete your profile",
                desc: "Role-specific details",
              },
            ].map((s) => (
              <div key={s.n} className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 transition-all duration-300 ${
                    step > s.n
                      ? "bg-emerald-500 text-white"
                      : step === s.n
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                        : "bg-gray-200 dark:bg-white/5 border border-gray-300 dark:border-white/10 text-gray-600 dark:text-slate-500"
                  }`}
                >
                  {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold transition-colors ${step >= s.n ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-slate-500"}`}
                  >
                    {s.label}
                  </p>
                  <p className="text-gray-500 dark:text-slate-500 text-xs">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features list */}
        <div className="relative z-10">
          <div className="space-y-3">
            {[
              "GPS-verified attendance marking",
              "Real-time session monitoring",
              "Automatic percentage calculation",
              "Role-based secure access",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-gray-600 dark:text-slate-400 text-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Right — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 overflow-y-auto bg-white dark:bg-[#030712]">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
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

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 dark:text-slate-400 text-sm">
                Step {step} of {watchedRole === "ADMIN" ? 2 : 3}
              </span>
              <span className="text-gray-600 dark:text-slate-400 text-sm">
                {Math.round((step / (watchedRole === "ADMIN" ? 2 : 3)) * 100)}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                animate={{
                  width: `${(step / (watchedRole === "ADMIN" ? 2 : 3)) * 100}%`,
                }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* Step 1 — Base Info */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={slideIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                      Create account
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400">
                      Already have one?{" "}
                      <button
                        type="button"
                        onClick={() => router.push("/login")}
                        className="text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-semibold transition-colors"
                      >
                        Sign in
                      </button>
                    </p>
                  </div>

                  <InputField
                    label="Full name"
                    icon={User}
                    error={errors.name?.message}
                  >
                    <input
                      {...register("name")}
                      placeholder="Yaw Fosu"
                      className={`w-full bg-gray-50 dark:bg-white/5 border ${errors.name ? "border-red-500/50" : "border-gray-200 dark:border-white/10"} rounded-xl pl-12 pr-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm`}
                    />
                  </InputField>

                  <InputField
                    label="Email address"
                    icon={Mail}
                    error={errors.email?.message}
                  >
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full bg-gray-50 dark:bg-white/5 border ${errors.email ? "border-red-500/50" : "border-gray-200 dark:border-white/10"} rounded-xl pl-12 pr-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm`}
                    />
                  </InputField>

                  <InputField
                    label="Password"
                    icon={Lock}
                    error={errors.password?.message}
                  >
                    <input
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      className={`w-full bg-gray-50 dark:bg-white/5 border ${errors.password ? "border-red-500/50" : "border-gray-200 dark:border-white/10"} rounded-xl pl-12 pr-12 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm`}
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
                  </InputField>

                  <motion.button
                    type="button"
                    onClick={goToStep2}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base flex items-center justify-center gap-3 shadow-2xl shadow-cyan-500/25 mt-2"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(34,211,238,0.35)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2 — Role Selection */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={slideIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                      Choose your role
                    </h2>
                    <p className="text-gray-600 dark:text-slate-400">
                      This determines what you can do on KlassRep.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {ROLES.map((role) => {
                      const Icon = role.icon;
                      const isSelected = watchedRole === role.value;
                      return (
                        <motion.button
                          key={role.value}
                          type="button"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setValue("role", role.value)}
                          className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                            isSelected
                              ? "border-cyan-500/60 bg-cyan-500/10 dark:bg-cyan-500/10"
                              : "border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "bg-cyan-500/20"
                                  : "bg-gray-200 dark:bg-white/5"
                              }`}
                            >
                              <Icon
                                className={`w-6 h-6 ${isSelected ? "text-cyan-600 dark:text-cyan-300" : "text-gray-600 dark:text-slate-400"}`}
                              />
                            </div>
                            <div className="flex-1">
                              <p
                                className={`font-bold text-base ${isSelected ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-slate-300"}`}
                              >
                                {role.label}
                              </p>
                              <p className="text-gray-600 dark:text-slate-500 text-sm">
                                {role.desc}
                              </p>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                isSelected
                                  ? "border-cyan-500 bg-cyan-500"
                                  : "border-gray-400 dark:border-slate-600"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <motion.button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-semibold flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={goToStep3}
                      disabled={!watchedRole || loading}
                      className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-3 shadow-2xl shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={watchedRole ? { scale: 1.02 } : {}}
                      whileTap={watchedRole ? { scale: 0.98 } : {}}
                    >
                      {loading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            ease: "linear",
                          }}
                        />
                      ) : (
                        <>
                          {watchedRole === "ADMIN"
                            ? "Create Account"
                            : "Continue"}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3 — Role Details */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  variants={slideIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-3xl font-black text-white mb-2">
                      {watchedRole === "STUDENT"
                        ? "Student details"
                        : "Lecturer details"}
                    </h2>
                    <p className="text-slate-400">
                      Almost done — just a few more details.
                    </p>
                  </div>

                  {watchedRole === "STUDENT" && (
                    <>
                      <InputField
                        label="Student Code"
                        icon={Hash}
                        error={errors.studentCode?.message}
                      >
                        <input
                          {...register("studentCode")}
                          placeholder="KsTU/CS/21/001"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                        />
                      </InputField>

                      <InputField
                        label="Department"
                        icon={BookOpen}
                        error={errors.department?.message}
                      >
                        <input
                          {...register("department")}
                          placeholder="Computer Science"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                        />
                      </InputField>

                      <div>
                        <label className="block text-slate-300 text-sm font-semibold mb-2">
                          Level
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {[100, 200, 300, 400].map((level) => (
                            <motion.button
                              key={level}
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setValue("level", level)}
                              className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                                watch("level") === level
                                  ? "border-cyan-500 bg-cyan-500/20 text-cyan-300"
                                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20"
                              }`}
                            >
                              {level}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {watchedRole === "LECTURER" && (
                    <>
                      <InputField
                        label="Staff Code"
                        icon={Hash}
                        error={errors.staffCode?.message}
                      >
                        <input
                          {...register("staffCode")}
                          placeholder="KsTU/LECT/001"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                        />
                      </InputField>

                      <InputField
                        label="Department"
                        icon={BookOpen}
                        error={errors.department?.message}
                      >
                        <input
                          {...register("department")}
                          placeholder="Computer Science"
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
                        />
                      </InputField>
                    </>
                  )}

                  <div className="flex gap-3 pt-2">
                    <motion.button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 py-4 rounded-xl border border-white/10 bg-white/5 text-white font-semibold flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-3 shadow-2xl shadow-cyan-500/25 disabled:opacity-50"
                      whileHover={!loading ? { scale: 1.02 } : {}}
                      whileTap={!loading ? { scale: 0.98 } : {}}
                    >
                      {loading ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            ease: "linear",
                          }}
                        />
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="text-slate-600 text-xs text-center mt-8">
            By creating an account you agree to our Terms of Service and Privacy
            Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
