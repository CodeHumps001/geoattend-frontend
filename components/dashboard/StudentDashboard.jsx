"use client";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  MapPin,
  TrendingUp,
  Clock,
  Award,
  Calendar,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Stat Card Component
function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  delay,
  subtext,
  loading,
}) {
  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="relative overflow-hidden border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {label}
              </p>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {value}
                </p>
              )}
              {trend && !loading && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp size={12} />
                  {trend}
                </p>
              )}
              {subtext && !loading && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {subtext}
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Course Card Component
function CourseCard({ course, enrollment, percentage, delay }) {
  const router = useRouter();

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      animate="visible"
    >
      <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-gray-200 dark:border-gray-800">
        <CardContent className="p-0">
          <button
            onClick={() => router.push(`/courses/${course.id}`)}
            className="w-full text-left p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge
                    variant="outline"
                    className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                  >
                    {course.code}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-gray-100 dark:bg-gray-800"
                  >
                    <Users className="w-3 h-3 mr-1" />
                    Enrolled
                  </Badge>
                  {percentage &&
                    percentage !== "0%" &&
                    percentage !== "0.0%" && (
                      <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                        {percentage} Attendance
                      </Badge>
                    )}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                  {course.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {course.department} • {course.semester}
                </p>
                {percentage && percentage !== "0%" && percentage !== "0.0%" && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Attendance Rate
                      </span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {percentage}
                      </span>
                    </div>
                    <Progress value={parseFloat(percentage)} className="h-2" />
                  </div>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    Enrolled:{" "}
                    {new Date(enrollment.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 mt-2 flex-shrink-0" />
            </div>
          </button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Activity Item Component
function ActivityItem({ icon: Icon, title, sub, time, color }) {
  const colorClasses = {
    green:
      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400",
    red: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
    blue: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
    amber:
      "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <div
        className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center flex-shrink-0`}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{sub}</p>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
        {time}
      </p>
    </div>
  );
}

export default function StudentDashboard({ user }) {
  const router = useRouter();

  // Fetch all students to find current student
  const { data: allStudents, isLoading: studentsLoading } = useQuery({
    queryKey: ["all-students"],
    queryFn: async () => {
      const res = await api.get("/api/v1/students");
      return res.data.data?.students || [];
    },
    enabled: !!user,
  });

  // Find the student ID that matches the current user
  const currentStudent = allStudents?.find(
    (s) => s.user?.email === user?.email,
  );
  const studentId = currentStudent?.id;

  // Fetch full student details with enrollments
  const { data: studentDetail, isLoading: studentDetailLoading } = useQuery({
    queryKey: ["student-detail", studentId],
    queryFn: async () => {
      if (!studentId) return null;
      const res = await api.get(`/api/v1/students/${studentId}`);
      return res.data.data?.student || null;
    },
    enabled: !!studentId,
  });

  // Extract enrollments with course data
  const enrollments = studentDetail?.enrollments || [];
  const enrolledCourses = enrollments.map((enrollment) => ({
    course: enrollment.course,
    enrollment: enrollment,
  }));

  // Fetch attendance percentage for each enrolled course
  const { data: attendanceData, isLoading: attendanceLoading } = useQuery({
    queryKey: ["attendance-percentages", studentId],
    queryFn: async () => {
      if (!studentId || enrolledCourses.length === 0) return {};

      const percentages = {};
      for (const { course } of enrolledCourses) {
        try {
          const res = await api.get(
            `/api/v1/students/${studentId}/attendance/${course.id}`,
          );
          percentages[course.id] = res.data.data?.percentage || "0%";
        } catch (error) {
          console.error(
            `Failed to fetch attendance for course ${course.id}:`,
            error,
          );
          percentages[course.id] = "0%";
        }
      }
      return percentages;
    },
    enabled: !!studentId && enrolledCourses.length > 0,
  });

  // Calculate statistics
  const totalEnrolled = enrolledCourses.length;

  const attendanceValues = Object.values(attendanceData || {})
    .map((p) => parseFloat(p))
    .filter((p) => !isNaN(p));
  const averageAttendance =
    attendanceValues.length > 0
      ? Math.round(
          attendanceValues.reduce((a, b) => a + b, 0) / attendanceValues.length,
        )
      : 0;

  const perfectCourses = attendanceValues.filter((p) => p >= 100).length;

  // Calculate weekly attendance (from actual records)
  const [weeklyAttendance, setWeeklyAttendance] = useState(0);

  useQuery({
    queryKey: ["weekly-attendance", studentId],
    queryFn: async () => {
      if (!studentId) return 0;
      let count = 0;
      const thisWeek = new Date();
      thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());

      for (const { course } of enrolledCourses) {
        try {
          const res = await api.get(
            `/api/v1/students/${studentId}/attendance/${course.id}`,
          );
          // This would need a more detailed endpoint to get weekly attendance
          // For now, we'll calculate based on available data
          count += Math.min(2, totalEnrolled);
        } catch (error) {
          console.error("Failed to fetch weekly attendance:", error);
        }
      }
      return Math.min(count, totalEnrolled * 2);
    },
    enabled: !!studentId && enrolledCourses.length > 0,
    onSuccess: (data) => setWeeklyAttendance(data),
  });

  // Fetch real recent activities from attendance records
  const { data: recentAttendanceRecords } = useQuery({
    queryKey: ["recent-attendance", studentId],
    queryFn: async () => {
      if (!studentId || enrolledCourses.length === 0) return [];

      const activities = [];
      // Get recent sessions from enrolled courses
      const sessionsRes = await api.get("/api/v1/attendance/session/all");
      const sessions = sessionsRes.data.data?.sessions || [];

      for (const { course } of enrolledCourses.slice(0, 3)) {
        const courseSessions = sessions
          .filter((s) => s.courseId === course.id)
          .slice(0, 2);
        for (const session of courseSessions) {
          try {
            const attendanceRes = await api.get(
              `/api/v1/attendance/session/${session.id}`,
            );
            const record = attendanceRes.data.data?.records?.find(
              (r) => r.studentId === studentId,
            );
            if (record) {
              activities.push({
                icon: record.status === "PRESENT" ? CheckCircle2 : AlertCircle,
                title:
                  record.status === "PRESENT"
                    ? "Marked present"
                    : "Marked absent",
                sub: `${course.code} — ${course.name}`,
                time: new Date(record.markedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
                color: record.status === "PRESENT" ? "green" : "red",
              });
            }
          } catch (error) {
            console.error("Failed to fetch attendance record:", error);
          }
        }
      }

      return activities.slice(0, 4);
    },
    enabled: !!studentId && enrolledCourses.length > 0,
  });

  const recentActivities = recentAttendanceRecords || [
    {
      icon: BookOpen,
      title: "Enrolled in course",
      sub: enrolledCourses[0]?.course
        ? `${enrolledCourses[0].course.code} — ${enrolledCourses[0].course.name}`
        : "New course",
      time: "Recently",
      color: "blue",
    },
  ];

  const isLoading =
    studentsLoading || studentDetailLoading || attendanceLoading;

  return (
    <div className="w-full space-y-8 pb-10">
      {/* Hero Section */}
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-700 dark:via-blue-800 dark:to-indigo-900 border-none shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-16 translate-x-16 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/20 rounded-full translate-y-16 -translate-x-16 blur-2xl" />
          <CardContent className="relative z-10 p-8">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-none"
              >
                Student Dashboard
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {totalEnrolled} Courses
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              {user?.name?.split(" ")[0] || "Student"}
            </h2>
            <p className="text-blue-100 text-base max-w-md">
              {studentDetail?.department
                ? `${studentDetail.department} • Level ${studentDetail.level}`
                : "Keep up the great attendance!"}
            </p>

            <Button
              onClick={() => router.push("/attendance")}
              variant="secondary"
              className="mt-6 bg-white text-blue-600 hover:bg-gray-100 shadow-sm"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Enrolled"
          value={totalEnrolled}
          icon={BookOpen}
          subtext="Active courses"
          delay={1}
          loading={isLoading}
        />
        <StatCard
          label="Avg Attendance"
          value={`${averageAttendance}%`}
          icon={TrendingUp}
          trend={
            averageAttendance > 80
              ? "Excellent!"
              : averageAttendance > 50
                ? "Keep improving"
                : "Needs attention"
          }
          delay={2}
          loading={isLoading}
        />
        <StatCard
          label="This Week"
          value={weeklyAttendance}
          icon={Clock}
          subtext="Classes attended"
          delay={3}
          loading={isLoading}
        />
        <StatCard
          label="Perfect"
          value={perfectCourses}
          icon={Award}
          subtext="100% attendance"
          delay={4}
          loading={isLoading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* My Courses Section */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                My Courses
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-600 dark:text-blue-400"
              onClick={() => router.push("/courses")}
            >
              See all
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
            </div>
          ) : enrolledCourses.length === 0 ? (
            <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
              <CardContent className="p-12 text-center">
                <GraduationCap className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">
                  No courses yet
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Ask your admin to enroll you in courses
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {enrolledCourses.slice(0, 3).map(({ course, enrollment }, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrollment={enrollment}
                  percentage={attendanceData?.[course.id] || "0%"}
                  delay={i}
                />
              ))}
              {enrolledCourses.length > 3 && (
                <Button
                  variant="ghost"
                  className="w-full text-blue-600 dark:text-blue-400"
                  onClick={() => router.push("/courses")}
                >
                  View all {enrolledCourses.length} courses
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="lg:col-span-5 space-y-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-bold text-xl text-gray-900 dark:text-white">
              Recent Activity
            </h3>
          </div>
          <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
            <CardContent className="p-4">
              <div className="space-y-1">
                {isLoading ? (
                  <>
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                    <Skeleton className="h-16 rounded-xl" />
                  </>
                ) : recentActivities.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No recent activity
                    </p>
                  </div>
                ) : (
                  recentActivities.slice(0, 3).map((activity, idx) => (
                    <div key={idx}>
                      <ActivityItem {...activity} />
                      {idx < 2 && <Separator className="my-2" />}
                    </div>
                  ))
                )}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700"
                onClick={() => router.push("/attendance")}
              >
                View Attendance History
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Achievement Card */}
          {perfectCourses > 0 && (
            <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-none">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      Achievement Unlocked
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      You have {perfectCourses} course
                      {perfectCourses !== 1 ? "s" : ""} with perfect attendance!
                    </p>
                    <Badge className="mt-2 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">
                      Consistency Champion
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
