"use client";

// ── Stat Card ──────────────────────────────────────────────────
export function ActivityItem({ icon: Icon, title, sub, time, color }) {
  const colors = {
    green: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    red: "bg-red-50 text-red-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color]}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-400">{sub}</p>
      </div>
      <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
    </div>
  );
}
