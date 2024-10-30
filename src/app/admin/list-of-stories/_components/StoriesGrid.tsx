'use client'
import { useAllStory } from "@/features/story/api/use-all-story";
import Link from "next/link";
import { StoriesGridSkeleton } from "./StoriesGridSkeleton";
import { Card } from "@/components/ui/card";
import Image from "next/image";

export function StoriesGrid() {
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
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stories.map((story) => (
                    <Link
                        key={story._id}
                        href={`/admin/list-of-stories/${story._id}`}
                    >
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="aspect-video relative">
                                <Image
                                    src={story.url ?? ""}
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
        </>
    );
}
