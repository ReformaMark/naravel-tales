"use client"

import { useStudentId } from "@/features/students/hooks/use-student-id"
import { useQuery } from "convex/react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { MessageSquare } from "lucide-react"
import { api } from "../../../../convex/_generated/api"

export const TeacherNotesCard = () => {
    const studentId = useStudentId()
    const progress = useQuery(api.parents.getChildLearningProgress, { studentId })

    if (!progress) return null

    const notesEntries = progress.progressEntries
        .filter(entry => entry.teacherNotes)
        .sort((a, b) => b.lastPlayed - a.lastPlayed)

    return (
        <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
            <Card>
                <CardHeader>
                    <CardTitle>Teacher Feedback</CardTitle>
                    <CardDescription>
                        Notes and feedback from teachers on your child&apos;s story progress
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-300px)]">
                        {notesEntries.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
                                <div>
                                    <MessageSquare className="mx-auto h-12 w-12 opacity-50 mb-2" />
                                    <p>No teacher notes yet.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {notesEntries.map((entry) => (
                                    <Card
                                        key={entry._id}
                                        className="relative pl-6 border-l-4 hover:border-l-primary transition-colors"
                                    >
                                        <CardContent className="p-4">
                                            <div className="mb-2">
                                                <h4 className="font-semibold text-primary">
                                                    {entry.story?.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDistanceToNow(entry.lastPlayed, { addSuffix: true })}
                                                </p>
                                            </div>
                                            <p className="text-sm mt-2 whitespace-pre-wrap">
                                                {entry.teacherNotes}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}