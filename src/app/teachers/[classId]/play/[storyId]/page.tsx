"use client"

import { useSearchParams } from "next/navigation";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "../../../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { SoundToggle } from "@/components/sound-toggle";
import { SequenceGame } from "@/features/story/components/sequence-game";

const PlayGamePage = ({
    params: { classId, storyId }
}: {
    params: { classId: Id<"classes">; storyId: Id<"stories"> }
}) => {
    const searchParams = useSearchParams();
    const studentId: Id<"students"> | null = searchParams.get("studentId") as Id<"students"> | null;

    const story = useQuery(api.stories.getById, { id: storyId })
    const student = useQuery(api.students.getById, { id: studentId as Id<"students"> })

    if (!studentId || !classId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-xl mb-4">Invalid game session</p>
                <Button asChild>
                    <Link href={`/teachers/${classId}/list`}>
                        <ArrowLeftIcon className="mr-2 h-4 w-4" />
                        Back to Stories
                    </Link>
                </Button>
            </div>
        );
    }

    if (!story || !student) {
        return (
            <div className="container mx-auto p-4">
                <Skeleton className="h-[600px] w-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted">
            {/* Header */}
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-between mb-8">
                    <Button
                        variant="ghost"
                        asChild
                    >
                        <Link href={`/teachers/${classId}/list`}>
                            <ArrowLeftIcon className="mr-2 h-4 w-4" />
                            Exit Game
                        </Link>
                    </Button>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">{story.title}</h1>
                        <p className="text-muted-foreground">
                            Playing as {student.fname} {student.lname}
                        </p>
                    </div>
                    <div className="w-[100px]" /> {/* Spacer for alignment */}
                </div>

                {/* Game Component */}
                <SequenceGame
                    storyId={storyId}
                    studentId={studentId}
                    sequenceCards={story.sequenceCards}
                />
            </div>

            {/* Sound Toggle */}
            <SoundToggle />
        </div>
    )
}

export default PlayGamePage;