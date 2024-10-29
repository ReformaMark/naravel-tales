"use client"

import { Skeleton } from "@/components/ui/skeleton";
import { StoryReader, StoryReaderProps } from "@/features/story/components/story-reader";
import { useQuery } from "convex/react";
import { Suspense } from "react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";

export default function StoryPage({
    params: { classId, storyId }
}: {
    params: { classId: Id<"classes">; storyId: Id<"stories"> }
}) {
    return (
        <div className="flex-1 space-y-4 p-4 pt-6">
            <Suspense fallback={<StoryPageSkeleton />}>
                <StoryContent classId={classId} storyId={storyId} />
            </Suspense>
        </div>
    );
}

function StoryContent({ classId, storyId }: { classId: Id<"classes">; storyId: Id<"stories"> }) {
    const story = useQuery(api.stories.getById, { id: storyId });

    if (!story) {
        return <div>Story not found</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">{story.title}</h2>
            <StoryReader story={story as StoryReaderProps["story"]} classId={classId} />
        </div>
    );
}

function StoryPageSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-10 w-48" />
            </div>
            <Skeleton className="h-[600px] w-full" />
        </div>
    );
}

// Add this new component for student selection
function StudentSelect({
    classId,
    onSelect
}: {
    classId: Id<"classes">;
    onSelect: (studentId: Id<"students">) => void;
}) {
    const students = useQuery(api.students.getMyStudents, {
        classId,
        page: 1,
        limit: 100,
        searchQuery: ""
    });

    if (!students?.students.length) {
        return <div>No students found</div>;
    }

    return (
        <select
            className="form-select"
            onChange={(e) => onSelect(e.target.value as Id<"students">)}
            defaultValue=""
        >
            <option value="" disabled>Select a student</option>
            {students.students.map((student) => (
                <option key={student._id} value={student._id}>
                    {student.fname} {student.lname}
                </option>
            ))}
        </select>
    );
}