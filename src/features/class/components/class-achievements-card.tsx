"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAvatarColor, getInitials } from "@/lib/utils";
import { useQuery } from "convex/react";
import { Medal, Star, Trophy } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { useClassId } from "../hooks/use-class-id";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import React from "react";

export const ClassAchievementsCard = () => {
  const classId = useClassId();

  const achievements = useQuery(api.classes.getClassAchievements, { classId });
  const students = useQuery(api.classes.getStudentsByClass, { classId });

  if (!achievements || !students) return null;

  const achievementTypes = {
    sequence_master: {
      title: "Sequence Master",
      icon: Trophy,
      description: "Mastering story sequences",
      criteria:
        "Complete a story sequence with 100% accuracy on your first attempt",
    },
    quick_learner: {
      title: "Quick Learner",
      icon: Star,
      description: "Fast comprehension skills",
      criteria:
        "Complete a story sequence within 2 minutes with at least 90% accuracy",
    },
    persistent_reader: {
      title: "Persistent Reader",
      icon: Medal,
      description: "Consistent reading habits",
      criteria: "Complete 5 different stories",
    },
    story_expert: {
      title: "Story Expert",
      icon: Trophy,
      description: "Deep story understanding",
      criteria: "Earn 3 stars on 3 different stories",
    },
    practice_star: {
      title: "Practice Star",
      icon: Star,
      description: "Regular practice completion",
      criteria: "Complete at least one story every day for 5 consecutive days",
    },
  };

  const achievementsByType = achievements.reduce(
    (acc, achievement) => {
      if (!acc[achievement.type]) {
        acc[achievement.type] = [];
      }
      acc[achievement.type].push(achievement);
      return acc;
    },
    {} as Record<string, typeof achievements>
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderAchievementWithAvatar = (achievement: any, student: any) => {
    const fullName = `${student?.fname} ${student?.lname}`;
    const initials = student ? getInitials(student.fname, student.lname) : "??";
    const avatarColor = getAvatarColor(fullName);

    return (
      <div
        key={achievement._id}
        className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
      >
        <Avatar className={`h-24 w-24 mb-6 rounded-lg `}>
          <AvatarFallback
            className={`rounded-lg text-2xl font-semibold text-white ${avatarColor}`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="text-sm font-medium">
            {student?.fname} {student?.lname}
          </div>
          <div className="text-xs text-muted-foreground">
            {achievement.name}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-2 sm:p-4 md:p-6 pt-2">
      <Card className="shadow-lg">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-primary">
            Class Achievements
          </CardTitle>
          <CardDescription className="text-base">
            Track and monitor student achievements across different categories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="by-student">By Student</TabsTrigger>
              <TabsTrigger value="by-type">By Type</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(achievementTypes).map(([type, info]) => {
                  const count = achievementsByType[type]?.length || 0;
                  const percentage = (count / students.length) * 100;

                  return (
                    <Card
                      key={type}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger>
                                <CardTitle className="text-sm font-medium text-primary flex items-center gap-2">
                                  {info.title}
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </CardTitle>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[200px]">
                                <p className="font-bold text-sm">
                                  How to earn:
                                </p>
                                <p className="text-sm text-white mt-1">
                                  {info.criteria}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <CardDescription className="text-xs">
                            {info.description}
                          </CardDescription>
                        </div>
                        <info.icon className="h-5 w-5 text-primary" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary">
                          {count}
                        </div>
                        <Progress value={percentage} className="h-2 mt-3" />
                        <p className="text-xs text-muted-foreground mt-2">
                          {percentage.toFixed(1)}% of students achieved this
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="by-student">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {students.map((student) => {
                    const studentAchievements = achievements.filter(
                      (a) => a.studentId === student._id
                    );

                    return (
                      <Card
                        key={student._id}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader>
                          <CardTitle className="text-lg text-primary">
                            {student.fname} {student.lname}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Trophy className="h-4 w-4" />
                            {studentAchievements.length} achievements earned
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {studentAchievements.map((achievement) =>
                              renderAchievementWithAvatar(achievement, student)
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="by-type">
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-6">
                  {Object.entries(achievementsByType).map(
                    ([type, typeAchievements]) => (
                      <Card
                        key={type}
                        className="hover:shadow-md transition-shadow"
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="h-5 w-5 text-primary">
                              {React.createElement(
                                achievementTypes[
                                  type as keyof typeof achievementTypes
                                ].icon
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-lg text-primary">
                                {
                                  achievementTypes[
                                    type as keyof typeof achievementTypes
                                  ].title
                                }
                              </CardTitle>
                              <CardDescription>
                                {typeAchievements.length} achievements earned
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {typeAchievements.map((achievement) => {
                              const student = students.find(
                                (s) => s._id === achievement.studentId
                              );
                              return renderAchievementWithAvatar(
                                achievement,
                                student
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
