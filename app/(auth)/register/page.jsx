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
  Hash,
  GraduationCap,
  Users,
  CheckCircle2,
  BookOpen,
  Search,
  Loader2,
  Building,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import useAuthStore from "@/store/authStore";
import Image from "next/image";
import Link from "next/link";

const slideIn = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, x: -30, transition: { duration: 0.25 } },
};

const LEVELS = [100, 200, 300, 400];
const ACADEMIC_YEARS = ["2024/2025", "2025/2026", "2026/2027"];

function InputField({ label, icon: Icon, error, children }) {
  return (
    <div>
      <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        )}
        {children}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
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

function ClassPreviewCard({ classInfo, onConfirm, onClear }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="border-2 border-cyan-500/40 bg-cyan-50 dark:bg-cyan-950/30 rounded-2xl p-5 mt-3"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-400/30 flex items-center justify-center">
          <GraduationCap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xs transition-colors"
        >
          Change
        </button>
      </div>
      <h3 className="text-gray-900 dark:text-white font-bold text-base mb-1">
        {classInfo.name}
      </h3>
      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
        <p>
          {classInfo.department} · Level {classInfo.level}
        </p>
        <p>{classInfo.academicYear}</p>
        <p className="text-cyan-600 dark:text-cyan-400 font-medium">
          Rep: {classInfo.repName}
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-xs">
          {classInfo.memberCount} member{classInfo.memberCount !== 1 ? "s" : ""}{" "}
          already joined
        </p>
      </div>
      <motion.button
        type="button"
        onClick={onConfirm}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-4 py-2.5 bg-cyan-100 dark:bg-cyan-500/20 border border-cyan-300 dark:border-cyan-400/30 text-cyan-700 dark:text-cyan-300 font-semibold rounded-xl text-sm hover:bg-cyan-200 dark:hover:bg-cyan-500/30 transition-all"
      >
        ✓ Join this class
      </motion.button>
    </motion.div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Course rep specific
  const [level, setLevel] = useState(null);
  const [academicYear, setAcademicYear] = useState("");

  // Student specific
  const [classCode, setClassCode] = useState("");
  const [classInfo, setClassInfo] = useState(null);
  const [lookingUp, setLookingUp] = useState(false);
  const [classConfirmed, setClassConfirmed] = useState(false);
  const [classCodeGenerated, setClassCodeGenerated] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm();

  // Calculate total steps based on role
  const getTotalSteps = () => {
    if (role === "STUDENT") return 2; // Students only have 2 steps
    if (role === "COURSE_REP") return 3; // Course reps have 3 steps
    return 2; // Default before role selection
  };

  const totalSteps = getTotalSteps();
  const progress = (step / totalSteps) * 100;

  const goStep2 = async () => {
    const valid = await trigger(["name", "email", "studentId", "password"]);
    if (!valid) return;
    if (!role) {
      toast.error("Please select your role");
      return;
    }
    setStep(2);
  };

  const lookupClass = async () => {
    if (!classCode.trim()) {
      toast.error("Enter a class code");
      return;
    }
    setLookingUp(true);
    try {
      // Encode the class code properly
      const encodedClassCode = encodeURIComponent(
        classCode.trim().toUpperCase(),
      );
      const res = await api.get(`/api/v1/auth/class/${encodedClassCode}`);
      setClassInfo(res.data.data.classSpace);
    } catch (err) {
      console.error("Lookup error:", err);
      toast.error(err.response?.data?.message || "Class not found");
      setClassInfo(null);
    } finally {
      setLookingUp(false);
    }
  };

  const onSubmit = async (data) => {
    if (role === "STUDENT") {
      if (!classConfirmed) {
        toast.error("Please confirm your class");
        return;
      }
    }
    if (role === "COURSE_REP") {
      if (!data.department) {
        toast.error("Department is required");
        return;
      }
      if (!level) {
        toast.error("Select your level");
        return;
      }
      if (!academicYear) {
        toast.error("Select academic year");
        return;
      }
    }

    setLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        studentId: data.studentId,
        role,
      };

      if (role === "COURSE_REP") {
        payload.department = data.department;
        payload.level = level;
        payload.academicYear = academicYear;
      } else {
        payload.classCode = classCode.trim().toUpperCase();
      }

      const res = await api.post("/api/v1/auth/register", payload);
      const { token, user } = res.data.data;

      setAuth(user, token);

      if (role === "COURSE_REP") {
        setClassCodeGenerated(user.classCode);
        setStep(3);
      } else {
        toast.success("Welcome to the class! 🎉");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Get step information for left panel
  const getStepInfo = () => {
    if (role === "STUDENT") {
      return [
        { n: 1, label: "Your account", desc: "Name, email, student ID" },
        { n: 2, label: "Join your class", desc: "Enter your class code" },
      ];
    }
    if (role === "COURSE_REP") {
      return [
        { n: 1, label: "Your account", desc: "Name, email, student ID" },
        { n: 2, label: "Set up your class", desc: "Create your class space" },
        { n: 3, label: "Your class code", desc: "Share with classmates" },
      ];
    }
    return [
      { n: 1, label: "Your account", desc: "Name, email, student ID" },
      { n: 2, label: "Complete setup", desc: "Role-specific details" },
    ];
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex overflow-hidden">
      {/* Left Panel */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-r border-gray-200 dark:border-gray-800 p-12 relative overflow-hidden"
      >
        {/* Background grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        {/* Logo */}
        <Link href={"/"}>
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
        </Link>

        {/* Center */}
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-gray-900 dark:text-white leading-tight mb-6">
            Join the
            <br />
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 dark:from-cyan-400 dark:to-blue-400 bg-clip-text text-transparent">
              future.
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-sm mb-10">
            Built around how attendance actually works — through your course
            rep.
          </p>

          {/* Step indicators */}
          <div className="space-y-4">
            {stepInfo.map((s) => (
              <div key={s.n} className="flex items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 transition-all duration-300 ${
                    step > s.n
                      ? "bg-emerald-500 text-white"
                      : step === s.n
                        ? "bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30"
                        : "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-500"
                  }`}
                >
                  {step > s.n ? <CheckCircle2 className="w-4 h-4" /> : s.n}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold transition-colors ${
                      step >= s.n
                        ? "text-gray-900 dark:text-white"
                        : "text-gray-500 dark:text-gray-500"
                    }`}
                  >
                    {s.label}
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role cards at bottom */}
        <div className="relative z-10 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
            <Users className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mb-2" />
            <p className="text-gray-900 dark:text-white font-bold text-sm">
              Course Rep
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
              Create & manage your class
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-4">
            <GraduationCap className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
            <p className="text-gray-900 dark:text-white font-bold text-sm">
              Student
            </p>
            <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
              Join with your class code
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center px-5 py-10 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href={"/"}>
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
          </Link>

          {/* Progress bar - now dynamic based on role */}
          {role && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  Step {step} of {totalSteps}
                </span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              {/* ── Step 1 ── */}
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
                    <p className="text-gray-600 dark:text-gray-400">
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

                  {/* Role Selection */}
                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-3">
                      I am a...
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        {
                          value: "COURSE_REP",
                          label: "Course Rep",
                          desc: "I manage my class",
                          icon: Users,
                        },
                        {
                          value: "STUDENT",
                          label: "Student",
                          desc: "I join my class",
                          icon: GraduationCap,
                        },
                      ].map((r) => {
                        const Icon = r.icon;
                        const selected = role === r.value;
                        return (
                          <motion.button
                            key={r.value}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setRole(r.value)}
                            className={`p-4 rounded-2xl border-2 text-left transition-all ${
                              selected
                                ? "border-cyan-500/60 bg-cyan-50 dark:bg-cyan-950/20"
                                : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-700"
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 mb-2 ${
                                selected
                                  ? "text-cyan-600 dark:text-cyan-400"
                                  : "text-gray-400 dark:text-gray-500"
                              }`}
                            />
                            <p
                              className={`font-bold text-sm ${
                                selected
                                  ? "text-gray-900 dark:text-white"
                                  : "text-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {r.label}
                            </p>
                            <p className="text-gray-500 dark:text-gray-500 text-xs mt-0.5">
                              {r.desc}
                            </p>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  <InputField
                    label="Full name"
                    icon={User}
                    error={errors.name?.message}
                  >
                    <input
                      {...register("name", { required: "Name is required" })}
                      placeholder="Yaw Fosu"
                      className={`w-full bg-white dark:bg-gray-900 border ${
                        errors.name
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-200 dark:border-gray-800"
                      } rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 transition-all text-sm`}
                    />
                  </InputField>

                  <InputField
                    label="Email address"
                    icon={Mail}
                    error={errors.email?.message}
                  >
                    <input
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+\.\S+$/,
                          message: "Enter a valid email",
                        },
                      })}
                      type="email"
                      placeholder="you@example.com"
                      className={`w-full bg-white dark:bg-gray-900 border ${
                        errors.email
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-200 dark:border-gray-800"
                      } rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 transition-all text-sm`}
                    />
                  </InputField>

                  <InputField
                    label="Student ID(use your real student number)"
                    icon={Hash}
                    error={errors.studentId?.message}
                  >
                    <input
                      {...register("studentId", {
                        required: "Student ID is required",
                      })}
                      placeholder="eg 052342900000"
                      className={`w-full bg-white dark:bg-gray-900 border ${
                        errors.studentId
                          ? "border-red-500 dark:border-red-500"
                          : "border-gray-200 dark:border-gray-800"
                      } rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 transition-all text-sm`}
                    />
                  </InputField>

                  <InputField
                    label="Password"
                    icon={Lock}
                    error={errors.password?.message}
                  >
                    <input
                      {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Min. 6 characters" },
                      })}
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
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
                  </InputField>

                  <motion.button
                    type="button"
                    onClick={goStep2}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base flex items-center justify-center gap-3 shadow-2xl shadow-cyan-500/25 mt-2"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(34,211,238,0.35)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* ── Step 2 — Course Rep ── */}
              {step === 2 && role === "COURSE_REP" && (
                <motion.div
                  key="step2-rep"
                  variants={slideIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                      Set up your class
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      This creates your class space. Students will join using
                      your class code.
                    </p>
                  </div>

                  <InputField
                    label="Department"
                    icon={Building}
                    error={errors.department?.message}
                  >
                    <input
                      {...register("department", {
                        required: "Department is required",
                      })}
                      placeholder="e.g. Computer Science"
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 transition-all text-sm"
                    />
                  </InputField>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-3">
                      Level
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {LEVELS.map((l) => (
                        <motion.button
                          key={l}
                          type="button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setLevel(l)}
                          className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                            level === l
                              ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400"
                              : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
                          }`}
                        >
                          {l}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-3">
                      Academic Year
                    </label>
                    <div className="space-y-2">
                      {ACADEMIC_YEARS.map((y) => (
                        <motion.button
                          key={y}
                          type="button"
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setAcademicYear(y)}
                          className={`w-full py-3 px-4 rounded-xl border-2 font-semibold text-sm transition-all text-left ${
                            academicYear === y
                              ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-400"
                              : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-700"
                          }`}
                        >
                          {y}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <motion.button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-5 h-5" /> Back
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
                          <Zap className="w-5 h-5" /> Create Class
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2 — Student ── */}
              {step === 2 && role === "STUDENT" && (
                <motion.div
                  key="step2-student"
                  variants={slideIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                      Join your class
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      Ask your course rep for the class code. It looks like{" "}
                      <span className="text-cyan-600 dark:text-cyan-400 font-mono font-semibold">
                        CS-300-2025-X7K2
                      </span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">
                      Class Code
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <input
                          value={classCode}
                          onChange={(e) => {
                            setClassCode(e.target.value.toUpperCase());
                            setClassInfo(null);
                            setClassConfirmed(false);
                          }}
                          placeholder="CS-300-2025-X7K2"
                          className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-11 pr-4 py-3.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-cyan-500 dark:focus:border-cyan-500 transition-all text-sm font-mono tracking-wider"
                        />
                      </div>
                      <motion.button
                        type="button"
                        onClick={lookupClass}
                        disabled={lookingUp || !classCode.trim()}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-3.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-800 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all disabled:opacity-50 flex items-center gap-2 text-sm font-semibold"
                      >
                        {lookingUp ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                        Find
                      </motion.button>
                    </div>
                  </div>

                  {/* Class preview */}
                  <AnimatePresence>
                    {classInfo && !classConfirmed && (
                      <ClassPreviewCard
                        classInfo={classInfo}
                        onConfirm={() => setClassConfirmed(true)}
                        onClear={() => {
                          setClassInfo(null);
                          setClassCode("");
                        }}
                      />
                    )}
                    {classConfirmed && classInfo && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <div>
                          <p className="text-emerald-800 dark:text-emerald-300 font-semibold text-sm">
                            {classInfo.name}
                          </p>
                          <p className="text-emerald-600 dark:text-emerald-400 text-xs">
                            Ready to join
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setClassConfirmed(false);
                            setClassInfo(null);
                            setClassCode("");
                          }}
                          className="ml-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xs"
                        >
                          Change
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 pt-2">
                    <motion.button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ArrowLeft className="w-5 h-5" /> Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      disabled={loading || !classConfirmed}
                      className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold flex items-center justify-center gap-3 shadow-2xl shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={
                        classConfirmed && !loading ? { scale: 1.02 } : {}
                      }
                      whileTap={
                        classConfirmed && !loading ? { scale: 0.98 } : {}
                      }
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
                          <GraduationCap className="w-5 h-5" /> Join Class
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3 — Class Code Success (Course Rep only) ── */}
              {step === 3 && classCodeGenerated && (
                <motion.div
                  key="step3-success"
                  variants={slideIn}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-6 text-center"
                >
                  {/* Success icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.1 }}
                    className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30"
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>

                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                      Class Created! 🎉
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      Your class space is ready. Share this code with your
                      classmates so they can join.
                    </p>
                  </div>

                  {/* Class code display */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-3xl p-6">
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-3">
                      Your Class Code
                    </p>
                    <p className="text-4xl font-black font-mono tracking-widest text-blue-700 dark:text-blue-300 mb-4">
                      {classCodeGenerated}
                    </p>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigator.clipboard.writeText(classCodeGenerated);
                        toast.success(
                          "Class code copied! Share it on your class WhatsApp group 📱",
                        );
                      }}
                      className="flex items-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/30"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Code
                    </motion.button>
                  </div>

                  {/* How to share */}
                  <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 text-left">
                    <p className="text-gray-700 dark:text-gray-300 font-bold text-sm mb-3">
                      How to get students to join:
                    </p>
                    <div className="space-y-2">
                      {[
                        "Copy the class code above",
                        "Share it on your class WhatsApp group",
                        "Students register and enter the code to join",
                        "You'll see them appear in your Members page",
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-xs">
                            {step}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <motion.button
                    type="button"
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 20px 40px rgba(34,211,238,0.25)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/dashboard")}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-base flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/20"
                  >
                    Go to My Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <p className="text-gray-400 dark:text-gray-600 text-xs">
                    Your code is also visible on your dashboard anytime
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <p className="text-gray-400 dark:text-gray-600 text-xs text-center mt-8">
            By creating an account you agree to our Terms of Service and Privacy
            Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}
