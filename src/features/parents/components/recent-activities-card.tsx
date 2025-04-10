"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useStudentId } from "@/features/students/hooks/use-student-id";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { BookOpen, BookX, Clock, Star, Trophy } from "lucide-react";
import { api } from "../../../../convex/_generated/api";

export const RecentActivitiesCard = () => {
  const studentId = useStudentId();
  const activities = useQuery(api.parents.getChildRecentActivities, {
    studentId,
  });

  if (!activities) return null;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="text-xl text-primary">
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex">
          {activities.recentProgress.length === 0 ? (
            <div className="flex flex-col items-center justify-center flex-1 text-muted-foreground">
              <BookX className="h-12 w-12 mb-4" />
              <p className="text-lg font-medium">No activities yet</p>
              <p className="text-sm">
                Your child hasn&apos;t completed any reading activities yet.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-250px)] w-full">
              <div className="space-y-6">
                {activities.recentProgress.map((progress) => (
                  <Card
                    key={progress._id}
                    className="hover:shadow-md transition-all duration-300 hover:border-primary/20"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-primary">
                            {progress.story?.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(progress.lastPlayed, {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: progress.stars }).map(
                            (_, i) => (
                              <Star
                                key={i}
                                className="h-5 w-5 fill-yellow-400 text-yellow-400"
                              />
                            )
                          )}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Trophy className="h-4 w-4" />
                          <span>Score: {progress.totalScore}%</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>Attempts: {progress.sequenceAttempts}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{progress.timeSpent} seconds</span>
                        </div>
                      </div>

                      {progress.teacherNotes && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            <span className="font-medium">
                              Teacher&apos;s Note:
                            </span>{" "}
                            {progress.teacherNotes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
