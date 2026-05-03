"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import {
  ArrowLeft,
  PlayCircle,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Calendar,
  Loader2,
  TrendingUp,
  Navigation,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
};

function AttendanceRow({ record, index }) {
  const isPresent = record.status === "PRESENT";
  const student = record.student;
  const user = student?.user;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "S";

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className="flex items-center gap-3 py-3.5 border-b border-gray-50 last:border-0"
    >
      <Avatar className="w-10 h-10 flex-shrink-0">
        <AvatarFallback
          className={`font-bold text-xs ${
            isPresent
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm truncate">
          {user?.name}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-gray-400">{student?.studentCode}</p>
          {record.latitude && record.longitude && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Navigation className="w-3 h-3" />
              {record.latitude?.toFixed(4)}, {record.longitude?.toFixed(4)}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Date(record.markedAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </p>
      </div>
      <Badge
        className={`text-xs font-bold border-0 flex-shrink-0 ${
          isPresent
            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
            : "bg-red-100 text-red-600 hover:bg-red-100"
        }`}
      >
        {isPresent ? (
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            PRESENT
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            ABSENT
          </span>
        )}
      </Badge>
    </motion.div>
  );
}

export default function SessionDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ["session-detail", id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/attendance/session/${id}`);
      return res.data.data;
    },
    enabled: !!id,
    refetchInterval: 15000, // live refresh every 15s
  });

  const records = data?.records || [];
  const session = records[0]?.session || data?.session;
  const presentCount = records.filter((r) => r.status === "PRESENT").length;
  const absentCount = records.filter((r) => r.status === "ABSENT").length;
  const attendanceRate =
    records.length > 0
      ? ((presentCount / records.length) * 100).toFixed(1)
      : null;

  const now = new Date();
  const isActive = session ? now < new Date(session.endTime) : false;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-5 pt-12 pb-4 sticky top-0 z-40">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {isActive ? (
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-0 font-bold">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse inline-block" />
                  LIVE SESSION
                </Badge>
              ) : (
                <Badge variant="secondary">Completed</Badge>
              )}
            </div>
            <h1 className="text-xl font-black text-gray-900">
              {session?.course?.name || "Session Details"}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              {session?.course?.code}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-5 max-w-lg mx-auto space-y-5">
        {/* Session Info Card */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          <Card
            className={`border-2 ${
              isActive ? "border-emerald-100" : "border-gray-100"
            } shadow-sm`}
          >
            <CardContent className="p-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-sm font-bold text-gray-900">
                      {session
                        ? new Date(session.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Time</p>
                    <p className="text-sm font-bold text-gray-900">
                      {session
                        ? `${new Date(session.startTime).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )} — ${new Date(session.endTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}`
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">GPS Radius</p>
                    <p className="text-sm font-bold text-gray-900">
                      {session?.radiusMeters || "—"}m
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-violet-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Attendance Rate</p>
                    <p className="text-sm font-bold text-gray-900">
                      {attendanceRate !== null ? `${attendanceRate}%` : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Total",
              value: records.length,
              color: "bg-gray-50 text-gray-600",
              delay: 1,
            },
            {
              label: "Present",
              value: presentCount,
              color: "bg-emerald-50 text-emerald-700",
              delay: 2,
            },
            {
              label: "Absent",
              value: absentCount,
              color: "bg-red-50 text-red-600",
              delay: 3,
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={stat.delay}
              initial="hidden"
              animate="visible"
            >
              <Card className="border border-gray-100 shadow-sm text-center">
                <CardContent className="p-4">
                  <p
                    className={`text-2xl font-black ${stat.color.split(" ")[1]}`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Attendance Records */}
        <motion.div
          variants={fadeUp}
          custom={4}
          initial="hidden"
          animate="visible"
        >
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-gray-900">
                  Attendance Records
                </CardTitle>
                {isActive && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
                    Live updating
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-5 py-0 mt-3">
              {records.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-semibold">
                    No students have marked attendance yet
                  </p>
                  {isActive && (
                    <p className="text-gray-400 text-sm mt-1">
                      This page refreshes automatically every 15 seconds
                    </p>
                  )}
                </div>
              ) : (
                records.map((record, i) => (
                  <AttendanceRow key={record.id} record={record} index={i} />
                ))
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
