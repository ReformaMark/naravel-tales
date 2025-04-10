"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStudentId } from "@/features/students/hooks/use-student-id";
import { useQuery } from "convex/react";
import { BookOpen, Star, Target, TrendingUp } from "lucide-react";
import { api } from "../../../../convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

export const LearningProgressCard = () => {
  const studentId = useStudentId();
  const progress = useQuery(api.parents.getChildLearningProgress, {
    studentId,
  });

  if (!progress) return null;

  const { stats, progressEntries, difficultyProgress } = progress;

  const difficultyStats = {
    easy: {
      count: difficultyProgress.easy.length,
      avgScore:
        difficultyProgress.easy.reduce(
          (acc, p) => acc + (p.totalScore ?? 0),
          0
        ) / (difficultyProgress.easy.length || 1),
      avgStars:
        difficultyProgress.easy.reduce((acc, p) => acc + p.stars, 0) /
        (difficultyProgress.easy.length || 1),
    },
    medium: {
      count: difficultyProgress.medium.length,
      avgScore:
        difficultyProgress.medium.reduce(
          (acc, p) => acc + (p.totalScore ?? 0),
          0
        ) / (difficultyProgress.medium.length || 1),
      avgStars:
        difficultyProgress.medium.reduce((acc, p) => acc + p.stars, 0) /
        (difficultyProgress.medium.length || 1),
    },
    hard: {
      count: difficultyProgress.hard.length,
      avgScore:
        difficultyProgress.hard.reduce(
          (acc, p) => acc + (p.totalScore ?? 0),
          0
        ) / (difficultyProgress.hard.length || 1),
      avgStars:
        difficultyProgress.hard.reduce((acc, p) => acc + p.stars, 0) /
        (difficultyProgress.hard.length || 1),
    },
  };

  const sortedEntries = [...progressEntries].sort(
    (a, b) => b.lastPlayed - a.lastPlayed
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
      {/* Overall Progress */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Level
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.level ?? 1}</div>
            <Progress
              value={
                ((stats?.currentExp ?? 0) / (stats?.nextLevelExp ?? 100)) * 100
              }
              className="mt-2"
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {stats?.currentExp ?? 0} / {stats?.nextLevelExp ?? 100} XP
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Accuracy
            </CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.averageAccuracy?.toFixed(1) ?? 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Overall performance
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Stories
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.storiesCompleted ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Total completed
            </p>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-primary">
              Stars
            </CardTitle>
            <Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.totalStarsEarned ?? 0}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Total earned</p>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Progress */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Progress by Difficulty</CardTitle>
          <CardDescription>
            Performance across different difficulty levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="easy" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="easy">Easy</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
              <TabsTrigger value="hard">Hard</TabsTrigger>
            </TabsList>
            {(["easy", "medium", "hard"] as const).map((difficulty) => (
              <TabsContent key={difficulty} value={difficulty}>
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">
                        Stories Completed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {difficultyStats[difficulty].count}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Average Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {difficultyStats[difficulty].avgScore.toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Average Stars</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {difficultyStats[difficulty].avgStars.toFixed(1)}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Progress Timeline */}
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Learning Timeline</CardTitle>
          <CardDescription>Recent story completion history</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            {sortedEntries.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold text-lg mb-2">
                  No Learning History Yet
                </h3>
                <p className="text-sm text-muted-foreground max-w-[250px]">
                  When your child completes stories, their progress will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedEntries.map((entry) => (
                  <Card
                    key={entry._id}
                    className="relative pl-6 border-l-4 hover:border-l-primary transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-primary">
                            {entry.story?.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(entry.lastPlayed, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: entry.stars }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </div>
                          <div className="text-sm font-medium">
                            {entry.sequenceScore}%
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>Difficulty: {entry.story?.difficulty}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          <span>Attempts: {entry.sequenceAttempts}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
