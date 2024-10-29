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
import { CardContent, CardHeader, Card } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

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
            <div className="flex flex-col items-center justify-center p-4 sm:p-8 max-w-2xl mx-auto">
                <p className="text-lg sm:text-xl mb-4">Invalid game session</p>
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
            <div className="container mx-auto p-4 max-w-7xl">
                <Skeleton className="h-[300px] sm:h-[600px] w-full rounded-lg" />
            </div>
        );
    }

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-mut">Stories</BreadcrumbPage>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Game</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="min-h-screen p-2 sm:p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <Card className="shadow-lg">
                        <CardHeader className="p-3 sm:p-6">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                                <Button
                                    variant="ghost"
                                    asChild
                                    className="w-full sm:w-auto text-sm sm:text-base"
                                >
                                    <Link href={`/teachers/${classId}/list`}>
                                        <ArrowLeftIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                        Exit Game
                                    </Link>
                                </Button>

                                <div className="text-center flex-1">
                                    <h1 className="text-lg sm:text-2xl font-bold text-primary mb-0.5 sm:mb-1 line-clamp-1">{story.title}</h1>
                                    <p className="text-xs sm:text-base text-muted-foreground">
                                        Playing as {student.fname} {student.lname}
                                    </p>
                                </div>

                                <div className="w-full sm:w-[100px] flex justify-end">
                                    <SoundToggle />
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="p-2 sm:p-4 md:p-6 overflow-hidden">
                            <div className="w-full overflow-x-hidden">
                                <SequenceGame
                                    storyId={storyId}
                                    studentId={studentId}
                                    sequenceCards={story.sequenceCards}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default PlayGamePage;