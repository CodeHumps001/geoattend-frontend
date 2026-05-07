"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import { toast } from "sonner";
import {
  Users,
  Search,
  Shield,
  Crown,
  Star,
  UserCheck,
  UserMinus,
  ChevronRight,
  GraduationCap,
  Hash,
  Loader2,
  Info,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

function MemberCard({
  member,
  isMainRep,
  isAssistant,
  onPromote,
  onRemove,
  canManage,
  index,
}) {
  const user = member.user;
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
      whileHover={{ y: -1 }}
    >
      <Card
        className={`border transition-all bg-white dark:bg-gray-900 ${
          isMainRep
            ? "border-blue-200 dark:border-blue-800 shadow-md shadow-blue-50 dark:shadow-blue-950/30"
            : isAssistant
              ? "border-amber-200 dark:border-amber-800 shadow-md shadow-amber-50 dark:shadow-amber-950/30"
              : "border-gray-200 dark:border-gray-800 hover:shadow-md"
        }`}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar className="w-11 h-11">
                <AvatarFallback
                  className={`font-bold text-sm ${
                    isMainRep
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      : isAssistant
                        ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Role indicator dot */}
              {(isMainRep || isAssistant) && (
                <div
                  className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center ${
                    isMainRep ? "bg-blue-500" : "bg-amber-500"
                  }`}
                >
                  {isMainRep ? (
                    <Crown className="w-2.5 h-2.5 text-white" />
                  ) : (
                    <Star className="w-2.5 h-2.5 text-white" />
                  )}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                  {user?.name}
                </p>
                {isMainRep && (
                  <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-0 text-xs font-bold">
                    <Crown className="w-3 h-3 mr-1" /> Main Rep
                  </Badge>
                )}
                {isAssistant && (
                  <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-0 text-xs font-bold">
                    <Star className="w-3 h-3 mr-1" /> Assistant Rep
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  {user?.studentId}
                </span>
                <span className="truncate">{user?.email}</span>
              </div>
            </div>

            {/* Actions — only main rep can manage */}
            {canManage && !isMainRep && (
              <div className="flex-shrink-0">
                {isAssistant ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRemove(member)}
                    className="h-8 px-2.5 text-xs border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <UserMinus className="w-3.5 h-3.5 mr-1" />
                    Remove
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPromote(member)}
                    className="h-8 px-2.5 text-xs border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg"
                  >
                    <Star className="w-3.5 h-3.5 mr-1" />
                    Make Asst.
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PromoteConfirmDialog({ member, isOpen, onClose, onConfirm, loading }) {
  if (!member) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500" />
            Make Assistant Rep?
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            You're about to give{" "}
            <strong className="text-gray-900 dark:text-white">
              {member.user?.name}
            </strong>{" "}
            assistant rep access.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-2">
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <p className="text-amber-800 dark:text-amber-300 font-semibold text-sm mb-2">
              They will be able to:
            </p>
            <div className="space-y-1.5">
              {[
                "Start attendance sessions",
                "Close attendance sessions",
                "View all class members",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm"
                >
                  <UserCheck className="w-3.5 h-3.5 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
            <p className="text-gray-700 dark:text-gray-300 font-semibold text-sm mb-2">
              They will NOT be able to:
            </p>
            <div className="space-y-1.5">
              {[
                "Create or delete courses",
                "Add or remove members",
                "Promote other students",
                "Change class settings",
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm"
                >
                  <span className="w-3.5 h-3.5 flex-shrink-0 text-center text-red-400">
                    ✕
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-200 dark:border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Star className="w-4 h-4 mr-1.5" /> Confirm
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RemoveConfirmDialog({
  assistant,
  isOpen,
  onClose,
  onConfirm,
  loading,
}) {
  if (!assistant) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-white dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white flex items-center gap-2">
            <UserMinus className="w-5 h-5 text-red-500" />
            Remove Assistant Rep?
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            <strong className="text-gray-900 dark:text-white">
              {assistant.student?.user?.name}
            </strong>{" "}
            will lose their assistant rep access and go back to being a regular
            member.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-200 dark:border-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Remove"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MembersPage() {
  const { user, isCourseRep } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [promoteTarget, setPromoteTarget] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [promoting, setPromoting] = useState(false);
  const [removing, setRemoving] = useState(false);

  // Fetch class space with members
  const { data: classData, isLoading: classLoading } = useQuery({
    queryKey: ["class-members"],
    queryFn: async () => {
      const res = await api.get("/api/v1/class/me");
      return res.data.data.classSpace;
    },
    enabled: isCourseRep,
  });

  // Fetch assistants
  const { data: assistantsData, isLoading: assistantsLoading } = useQuery({
    queryKey: ["assistants"],
    queryFn: async () => {
      const res = await api.get("/api/v1/assistants");
      return res.data.data.assistants;
    },
    enabled: isCourseRep,
  });

  const members = classData?.students || [];
  const assistants = assistantsData || [];
  const assistantStudentIds = new Set(assistants.map((a) => a.studentId));

  // Find main rep's student profile
  const mainRepStudentId = classData?.courseRep?.studentId;

  const filtered = members.filter(
    (m) =>
      m.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.user?.studentId?.toLowerCase().includes(search.toLowerCase()) ||
      m.user?.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const handlePromote = async () => {
    if (!promoteTarget) return;
    setPromoting(true);
    try {
      await api.post("/api/v1/assistants/promote", {
        studentId: promoteTarget.id,
      });
      toast.success(`${promoteTarget.user?.name} is now an assistant rep! 🌟`);
      queryClient.invalidateQueries(["assistants"]);
      setPromoteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to promote student");
    } finally {
      setPromoting(false);
    }
  };

  const handleRemove = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await api.delete(`/api/v1/assistants/${removeTarget.id}`);
      toast.success(
        `${removeTarget.student?.user?.name} removed as assistant rep.`,
      );
      queryClient.invalidateQueries(["assistants"]);
      setRemoveTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove assistant");
    } finally {
      setRemoving(false);
    }
  };

  const isLoading = classLoading || assistantsLoading;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900 dark:text-white">
          Class Members
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          {members.length} member{members.length !== 1 ? "s" : ""} in your class
        </p>
      </div>

      {/* Assistant Reps Section */}
      {isCourseRep && (
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
        >
          <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-500" />
                    Assistant Reps
                    <Badge className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-0 text-xs">
                      {assistants.length}/2
                    </Badge>
                  </CardTitle>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                    Can start and close sessions when you're not around
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {isLoading ? (
                <Skeleton className="h-16 rounded-xl" />
              ) : assistants.length === 0 ? (
                <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                  <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-amber-800 dark:text-amber-300 font-semibold text-sm">
                      No assistant reps yet
                    </p>
                    <p className="text-amber-700 dark:text-amber-400 text-xs mt-0.5">
                      Promote up to 2 classmates so they can manage sessions
                      when you're unavailable. Find them in the member list
                      below and tap "Make Asst."
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {assistants.map((assistant, i) => {
                    const user = assistant.student?.user;
                    const initials =
                      user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "A";
                    return (
                      <motion.div
                        key={assistant.id}
                        variants={fadeUp}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        className="flex items-center gap-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 rounded-xl px-4 py-3"
                      >
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarFallback className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold text-sm">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white text-sm truncate">
                            {user?.name}
                          </p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">
                            {user?.studentId} · Can start & close sessions
                          </p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-0 text-xs font-bold">
                            <Star className="w-3 h-3 mr-1" />
                            Assistant
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setRemoveTarget(assistant)}
                            className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}

                  {assistants.length < 2 && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-1">
                      You can add {2 - assistants.length} more assistant rep
                      {2 - assistants.length !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <motion.div
        variants={fadeUp}
        custom={1}
        initial="hidden"
        animate="visible"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, student ID or email..."
            className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-400 dark:focus:border-blue-500 transition-colors"
          />
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Members", value: members.length, color: "blue" },
          { label: "Assistant Reps", value: assistants.length, color: "amber" },
          {
            label: "Regular Students",
            value: members.length - assistants.length - 1,
            color: "gray",
          },
        ].map((stat, i) => {
          const colorMap = {
            blue: "text-blue-600 dark:text-blue-400",
            amber: "text-amber-600 dark:text-amber-400",
            gray: "text-gray-600 dark:text-gray-400",
          };
          return (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              custom={i + 2}
              initial="hidden"
              animate="visible"
            >
              <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-center">
                <CardContent className="p-4">
                  <p className={`text-2xl font-black ${colorMap[stat.color]}`}>
                    {stat.value}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Members List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardContent className="py-14 text-center">
            <Users className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-semibold">
              {search ? "No members found" : "No members yet"}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              {search
                ? "Try a different search"
                : "Share your class code so students can join"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((member, i) => {
            const isMainRepMember = member.id === mainRepStudentId;
            const isAssistantMember = assistantStudentIds.has(member.id);
            const assistantRecord = assistants.find(
              (a) => a.studentId === member.id,
            );

            return (
              <MemberCard
                key={member.id}
                member={member}
                isMainRep={isMainRepMember}
                isAssistant={isAssistantMember}
                onPromote={setPromoteTarget}
                onRemove={() => setRemoveTarget(assistantRecord)}
                canManage={isCourseRep && assistants.length < 2}
                index={i}
              />
            );
          })}
        </div>
      )}

      {/* Promote Confirm Dialog */}
      <PromoteConfirmDialog
        member={promoteTarget}
        isOpen={!!promoteTarget}
        onClose={() => setPromoteTarget(null)}
        onConfirm={handlePromote}
        loading={promoting}
      />

      {/* Remove Confirm Dialog */}
      <RemoveConfirmDialog
        assistant={removeTarget}
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemove}
        loading={removing}
      />
    </div>
  );
}
