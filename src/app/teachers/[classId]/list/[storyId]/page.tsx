"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  StoryReader,
  StoryReaderProps,
} from "@/features/story/components/story-reader";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "convex/react";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { SoundToggle } from "@/components/sound-toggle";
import { SequenceGame } from "@/features/story/components/sequence-game";

export default function StoryPage({
  params: { classId, storyId },
}: {
  params: { classId: Id<"classes">; storyId: Id<"stories"> };
}) {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <Suspense fallback={<StoryPageSkeleton />}>
        <StoryContent classId={classId} storyId={storyId} />
      </Suspense>
    </div>
  );
}

function StoryContent({
  classId,
  storyId,
}: {
  classId: Id<"classes">;
  storyId: Id<"stories">;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const story = useQuery(api.stories.getById, { id: storyId });
  const studentIds = searchParams.getAll("studentIds[]") as Id<"students">[];
  const students = useQuery(api.students.getByIds, { ids: studentIds });

  if (!story) {
    return <StoryPageSkeleton />;
  }

  return (
    <div className="space-y-6 text-primary">
      <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
        <Button size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-3xl font-bold tracking-tight">{story.title}</h2>
          <p className="text-muted-foreground">Author: {story.author}</p>
        </div>
        <SoundToggle />
      </div>

      {studentIds.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <SequenceGame
            storyId={storyId}
            sequenceCards={story.sequenceCards}
            studentIds={studentIds}
            students={students || []}
          />
        </div>
      ) : (
        <StoryReader
          story={story as StoryReaderProps["story"]}
          classId={classId}
        />
      )}
    </div>
  );
}

function StoryPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-1/3" />
      </div>
      <Skeleton className="h-[600px] w-full rounded-lg" />
    </div>
  );
}
