"use client"

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllStory } from "@/features/story/api/use-all-story";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export default function StoriesListPage({
    params: { classId }
}: {
    params: { classId: string }
}) {
    return (
        <div className="flex-1 space-y-4 p-4 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Stories</h2>
            </div>
            <Suspense fallback={<StoriesGridSkeleton />}>
                <StoriesGrid classId={classId} />
            </Suspense>
        </div>
    );
}

function StoriesGrid({ classId }: { classId: string }) {
    const { data: stories, isLoading } = useAllStory()

    if (isLoading) {
        return <StoriesGridSkeleton />
    }

    if (!stories?.length) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No stories available.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stories.map((story) => (
                <Link
                    key={story._id}
                    href={`/teachers/${classId}/list/${story._id}`}
                >
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video relative">
                            <Image
                                src={story.imageUrl ?? ""}
                                alt={story.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{story.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Age: {story.ageGroup}</span>
                                <span>•</span>
                                <span>Difficulty: {story.difficulty}</span>
                            </div>
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    );
}

function StoriesGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-video" />
                    <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </Card>
            ))}
        </div>
    );
}