"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useGameSounds } from "@/lib/sounds";
import { getAvatarColor } from "@/lib/utils";
import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface StudentSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: Id<"classes">;
  storyId: Id<"stories">;
}

export function StudentSelectDialog({
  open,
  onOpenChange,
  classId,
  storyId,
}: StudentSelectDialogProps) {
  const { playHover, playSelect } = useGameSounds();
  const router = useRouter();

  const students = useQuery(api.students.getMyStudents, {
    classId,
    page: 1,
    limit: 100,
    searchQuery: "",
  });

  // Get progress for all students for this story
  const progress = useQuery(api.progress.getByStory, {
    storyId,
    studentIds: students?.students.map((s) => s._id) ?? [],
  });

  const handleStudentSelect = (studentId: Id<"students">) => {
    playSelect();
    onOpenChange(false);
    router.push(`/teachers/${classId}/play/${storyId}?studentId=${studentId}`);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] overflow-y-auto max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-4">
            Choose Student
          </DialogTitle>
        </DialogHeader>
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-6 p-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {students?.students.map((student) => {
            const studentProgress = progress?.find(
              (p) => p.studentId === student._id
            );
            const stars = studentProgress?.stars ?? 0;
            const completionPercentage = studentProgress
              ? (studentProgress.sequenceScore / 100) * 100
              : 0;

            return (
              <motion.div key={student._id} variants={item}>
                <Card
                  className="p-4 cursor-pointer hover:scale-105 transition-all duration-200 
                                             hover:shadow-xl hover:border-primary relative overflow-hidden"
                  onClick={() => handleStudentSelect(student._id)}
                  onMouseEnter={() => playHover()}
                >
                  {/* Avatar with customization */}
                  <div className="aspect-square relative flex items-center justify-center">
                    <Avatar
                      className={`h-24 w-24 rounded-lg ${getAvatarColor(`${student.fname} ${student.lname}`)}`}
                    >
                      <AvatarFallback
                        className={`rounded-lg text-2xl font-semibold text-white ${getAvatarColor(`${student.fname} ${student.lname}`)}`}
                      >
                        {student.fname.charAt(0)}
                        {student.lname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2">
                      <Badge
                        variant={stars > 0 ? "default" : "secondary"}
                        className={
                          stars > 0 ? "bg-yellow-400 text-yellow-900" : ""
                        }
                      >
                        ⭐ {stars}
                      </Badge>
                    </div>
                  </div>

                  {/* Student Name */}
                  <h3 className="text-center font-semibold text-lg mb-2">
                    {student.fname} {student.lname}
                  </h3>

                  {/* Progress Indicator */}
                  <div className="space-y-2">
                    <Progress value={completionPercentage} className="h-2" />
                    <p className="text-xs text-center text-muted-foreground">
                      {completionPercentage}% Complete
                    </p>
                  </div>

                  {/* Achievement Badges */}
                  {studentProgress?.completed && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
