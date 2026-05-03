export default // ── Course Card ────────────────────────────────────────────────
function CourseCard({ course, percentage, delay }) {
  const router = useRouter();
  const pct = percentage ?? 0;
  const color = pct >= 75 ? "emerald" : pct >= 50 ? "orange" : "red";
  const colorMap = {
    emerald: "bg-emerald-500",
    orange: "bg-orange-400",
    red: "bg-red-500",
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2 }}
      onClick={() => router.push(`/courses/${course.id}`)}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
            {course.code}
          </span>
          <h3 className="font-bold text-gray-900 mt-2 text-sm">
            {course.name}
          </h3>
          <p className="text-gray-400 text-xs mt-0.5">{course.department}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 mt-1 flex-shrink-0" />
      </div>

      {percentage !== undefined && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">Attendance</span>
            <span className={`text-xs font-bold text-${color}-600`}>
              {pct.toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${colorMap[color]}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          {pct < 75 && (
            <p className="text-xs text-orange-500 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Below recommended threshold
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
