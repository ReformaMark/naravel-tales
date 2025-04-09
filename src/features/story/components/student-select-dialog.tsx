"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Student } from "@/features/students/student-types";
import { useGameSounds } from "@/lib/sounds";
import { getAvatarColor } from "@/lib/utils";
import { useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Search, X } from "lucide-react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface StudentSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classId: Id<"classes">;
  storyId: Id<"stories">;
  onSelect?: (selectedIds: Id<"students">[], students: Student[]) => void;
  selectedIds?: Id<"students">[];
  mode?: "individual" | "group";
  onPlayClick?: () => void;
}

export function StudentSelectDialog({
  open,
  onOpenChange,
  classId,
  storyId,
  onSelect,
  selectedIds = [],
  onPlayClick,
}: StudentSelectDialogProps) {
  const { playHover } = useGameSounds();
  const [searchQuery, setSearchQuery] = useState("");

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

  // const handleStudentSelect = (studentId: Id<"students">) => {
  //   playSelect();
  //   onOpenChange(false);
  //   router.push(`/teachers/${classId}/play/${storyId}?studentId=${studentId}`);
  // };

  // const handleStudentSelect = (student: Student) => {
  //   playSelect();
  //   if (onSelect) {
  //     onSelect(student);
  //   } else {
  //     router.push(
  //       `/teachers/${classId}/play/${storyId}?studentId=${student._id}`
  //     );
  //   }
  //   // Only close dialog in individual mode
  //   if (mode === "individual") {
  //     onOpenChange(false);
  //   }
  // };

  const handleStudentSelect = (student: Student) => {
    if (selectedIds.includes(student._id)) {
      // Deselect if already selected
      onSelect?.(
        selectedIds.filter((id) => id !== student._id),
        (students?.students ?? []).filter((s) => s._id !== student._id)
      );
    } else {
      // Add to selection
      onSelect?.(
        [...selectedIds, student._id],
        [...(students?.students ?? []), student]
      );
    }
  };

  const filteredStudents =
    students?.students.filter((student) =>
      `${student.fname} ${student.lname}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ) || [];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { y: 10, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.2 } },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-2">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              Select Students to Grade
            </DialogTitle>
            {selectedIds.length > 0 && (
              <Badge variant="outline" className="ml-2 px-3 py-1">
                {selectedIds.length} selected
              </Badge>
            )}
          </div>
          <DialogDescription>
            Select students to grade their progress on this story
          </DialogDescription>
        </DialogHeader>

        <div className="relative mb-4 mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search students..."
            className="pl-9 pr-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="overflow-y-auto flex-grow pr-2 -mr-2">
          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
              {filteredStudents.map((student) => {
                const studentProgress = progress?.find(
                  (p) => p.studentId === student._id
                );
                const stars = studentProgress?.stars ?? 0;
                const completionPercentage = studentProgress
                  ? Math.round(((studentProgress.totalScore ?? 0) / 100) * 100)
                  : 0;
                const isSelected = selectedIds.includes(student._id);

                return (
                  <motion.div key={student._id} variants={item} layout>
                    <Card
                      className={`
                        p-4 cursor-pointer transition-all duration-200
                        hover:shadow-md relative overflow-hidden
                        ${isSelected ? "border-primary border-2 bg-primary/5" : ""}
                      `}
                      onClick={() => handleStudentSelect(student)}
                      onMouseEnter={() => playHover()}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 text-primary">
                          <CheckCircle className="h-5 w-5" />
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        {/* Avatar with customization */}
                        <div className="relative">
                          <Avatar
                            className={`h-16 w-16 rounded-lg ${getAvatarColor(`${student.fname} ${student.lname}`)}`}
                          >
                            <AvatarFallback
                              className={`rounded-lg text-xl font-semibold text-white ${getAvatarColor(
                                `${student.fname} ${student.lname}`
                              )}`}
                            >
                              {student.fname.charAt(0)}
                              {student.lname.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {stars > 0 && (
                            <div className="absolute -top-2 -right-2">
                              <Badge
                                variant="default"
                                className="bg-yellow-400 text-yellow-900"
                              >
                                ⭐ {stars}
                              </Badge>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          {/* Student Name */}
                          <h3 className="font-semibold text-base">
                            {student.fname} {student.lname}
                          </h3>

                          {/* Progress Indicator */}
                          <div className="space-y-1 mt-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">
                                Progress
                              </span>
                              <span className="font-medium">
                                {completionPercentage}%
                              </span>
                            </div>
                            <Progress
                              value={completionPercentage}
                              size="sm"
                              variant={
                                completionPercentage === 100
                                  ? "success"
                                  : "default"
                              }
                            />
                          </div>

                          {/* Achievement Badges */}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {studentProgress?.completed && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-green-50 text-green-700 border-green-200"
                              >
                                Completed
                              </Badge>
                            )}
                            {completionPercentage === 0 && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                              >
                                Not Started
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}

              {filteredStudents.length === 0 && (
                <motion.div
                  className="col-span-full flex flex-col items-center justify-center py-10 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-muted-foreground">
                    No students found matching &quot;{searchQuery}&quot;
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <DialogFooter className="mt-4 flex items-center justify-between flex-col sm:flex-row gap-4">
          <div className="text-sm text-muted-foreground">
            {filteredStudents.length} students in class
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={onPlayClick} // Change this
              disabled={selectedIds.length === 0}
            >
              Play {selectedIds.length > 0 ? `(${selectedIds.length})` : ""}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
