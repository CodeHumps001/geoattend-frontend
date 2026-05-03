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
function StatCard({ label, value, icon: Icon, trend, delay, subtext }) {
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
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {value}
              </p>
              {trend && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
                  <TrendingUp size={12} />
                  {trend}
                </p>
              )}
              {subtext && (
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
function CourseCard({ course, percentage, delay }) {
  const router = useRouter();
  const studentCount = course._count?.enrollments || 0;

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
                    {studentCount} students
                  </Badge>
                  {percentage && (
                    <Badge className="bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                      {percentage}% Attendance
                    </Badge>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                  {course.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {course.department} • {course.semester}
                </p>
                {percentage && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500 dark:text-gray-400">
                        Attendance Rate
                      </span>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">
                        {percentage}%
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )}
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Calendar className="w-3 h-3" />
                    Lecturer:{" "}
                    {course.lecturer?.user?.name || `ID: ${course.lecturerId}`}
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

  // Step 1: Get the student record for the logged-in user
  const { data: studentRecord, isLoading: studentLoading } = useQuery({
    queryKey: ["student-record", user?.id],
    queryFn: async () => {
      // Fetch all students and find the one matching the user email
      const res = await api.get("/api/v1/students");
      const students = res.data.data;
      // Find student where user.email matches (since the student includes user relation)
      const currentStudent = students.find(
        (s) => s.user?.email === user?.email,
      );

      if (!currentStudent) {
        console.error("No student record found for user:", user?.email);
      }

      return currentStudent;
    },
    enabled: !!user,
  });

  // Step 2: Fetch all courses
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["all-courses"],
    queryFn: async () => {
      const res = await api.get("/api/v1/courses");
      return res.data.data.courses;
    },
    enabled: true,
  });

  // Step 3: For each enrolled course, fetch attendance percentage
  // First, determine which courses the student is enrolled in
  const enrolledCourseIds =
    studentRecord?.enrollments?.map((e) => e.courseId) || [];

  // Filter courses that the student is enrolled in
  const enrolledCourses =
    coursesData?.filter((course) => enrolledCourseIds.includes(course.id)) ||
    [];

  // Fetch attendance percentage for each enrolled course
  const { data: attendancePercentages, isLoading: attendanceLoading } =
    useQuery({
      queryKey: [
        "attendance-percentages",
        studentRecord?.id,
        enrolledCourseIds,
      ],
      queryFn: async () => {
        if (!studentRecord?.id || enrolledCourseIds.length === 0) return {};

        const percentages = {};
        for (const courseId of enrolledCourseIds) {
          try {
            const res = await api.get(
              `/api/v1/students/${studentRecord.id}/attendance/${courseId}`,
            );
            percentages[courseId] = res.data.data.percentage || 0;
          } catch (error) {
            console.error(
              `Failed to fetch attendance for course ${courseId}:`,
              error,
            );
            percentages[courseId] = 0;
          }
        }
        return percentages;
      },
      enabled: !!studentRecord?.id && enrolledCourseIds.length > 0,
    });

  const totalEnrolled = enrolledCourses.length;

  // Calculate average attendance
  const attendanceValues = Object.values(attendancePercentages || {});
  const averageAttendance =
    attendanceValues.length > 0
      ? Math.round(
          attendanceValues.reduce((a, b) => a + b, 0) / attendanceValues.length,
        )
      : 0;

  const perfectCourses = attendanceValues.filter((p) => p >= 100).length;
  const weeklyAttendance = Math.min(totalEnrolled * 2, 8);

  // Debug logging
  console.log("User:", user);
  console.log("Student Record:", studentRecord);
  console.log("Enrolled Course IDs:", enrolledCourseIds);
  console.log("Enrolled Courses:", enrolledCourses);
  console.log("Attendance Percentages:", attendancePercentages);

  const isLoading = studentLoading || coursesLoading || attendanceLoading;

  // Sample recent activities (replace with actual API call)
  const recentActivities = [
    {
      icon: CheckCircle2,
      title: "Marked present",
      sub: enrolledCourses[0]
        ? `${enrolledCourses[0].code} — ${enrolledCourses[0].name}`
        : "CS301 — Data Structures",
      time: "2h ago",
      color: "green",
    },
    {
      icon: CheckCircle2,
      title: "Marked present",
      sub: enrolledCourses[1]
        ? `${enrolledCourses[1].code} — ${enrolledCourses[1].name}`
        : "CS302 — Algorithms",
      time: "Yesterday",
      color: "green",
    },
    {
      icon: AlertCircle,
      title: "Marked absent",
      sub: "MATH301 — Calculus",
      time: "2 days ago",
      color: "red",
    },
    {
      icon: BookOpen,
      title: "Enrolled in course",
      sub: "CS303 — Databases",
      time: "Last week",
      color: "blue",
    },
  ];

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
                Good morning 👋
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {totalEnrolled} Courses
              </Badge>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              {user?.name?.split(" ")[0] || "Student"}
            </h2>
            <p className="text-blue-100 text-base max-w-md">
              {studentRecord?.department
                ? `${studentRecord.department} • Level ${studentRecord.level}`
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
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : (
          <>
            <StatCard
              label="Enrolled"
              value={totalEnrolled}
              icon={BookOpen}
              subtext="Active courses"
              delay={1}
            />
            <StatCard
              label="Avg Attendance"
              value={`${averageAttendance}%`}
              icon={TrendingUp}
              trend={averageAttendance > 80 ? "Excellent!" : "Keep improving"}
              delay={2}
            />
            <StatCard
              label="This Week"
              value={weeklyAttendance}
              icon={Clock}
              subtext="Classes attended"
              delay={3}
            />
            <StatCard
              label="Perfect"
              value={perfectCourses}
              icon={Award}
              subtext="100% attendance"
              delay={4}
            />
          </>
        )}
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
              {enrolledCourses.slice(0, 3).map((course, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  percentage={attendancePercentages?.[course.id] || 0}
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
                {recentActivities.map((activity, idx) => (
                  <div key={idx}>
                    <ActivityItem {...activity} />
                    {idx < recentActivities.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                className="w-full mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700"
                onClick={() => router.push("/attendance/history")}
              >
                View Full History
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
