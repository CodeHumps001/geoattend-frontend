"use client";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// ── Stat Card ──────────────────────────────────────────────────
export default function StatCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
  delay,
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors[color]}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        {sub && (
          <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full">
            {sub}
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-gray-900 mb-0.5">{value}</p>
      <p className="text-gray-500 text-sm">{label}</p>
    </motion.div>
  );
}
