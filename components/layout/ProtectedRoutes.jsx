"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import { Zap, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const { isAuthenticated, user, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (allowedRoles && !allowedRoles.includes(user?.role)) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, user, router, allowedRoles, _hasHydrated]);

  // Wait for Zustand to rehydrate from localStorage
  if (!_hasHydrated) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-cyan-500/30">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div className="flex items-center gap-2 justify-center">
            <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">
              Loading Klassrep...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return null;

  return children;
}
