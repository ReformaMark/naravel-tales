"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStudentId } from "@/features/students/hooks/use-student-id"
import { useQuery } from "convex/react"
import { formatDistanceToNow } from "date-fns"
import { Trophy } from "lucide-react"
import { api } from "../../../../convex/_generated/api"
import Image from "next/image"

export const AchievementsCard = () => {
    const studentId = useStudentId()
    const achievements = useQuery(api.students.getChildAchievements, { studentId })

    if (!achievements) return null

    const achievementTypes = {
        sequence_master: "Sequence Master",
        quick_learner: "Quick Learner",
        persistent_reader: "Persistent Reader",
        story_expert: "Story Expert",
        practice_star: "Practice Star"
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
            <Card>
                <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>
                        Your child&apos;s earned badges and accomplishments
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                        {achievements.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-center p-4">
                                <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="font-semibold text-lg mb-2">No Achievements Yet</h3>
                                <p className="text-sm text-muted-foreground max-w-[250px]">
                                    Complete stories to earn achievements!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {achievements.map((achievement) => (
                                    <Card
                                        key={achievement._id}
                                        className="relative overflow-hidden border-2 hover:border-primary/50 transition-colors"
                                    >
                                        <div className="absolute top-0 right-0 w-20 h-20">
                                            <div className="absolute transform rotate-45 bg-primary/10 text-xs text-primary font-semibold py-1 right-[-35px] top-[32px] w-[170px] text-center">
                                                {achievementTypes[achievement.type]}
                                            </div>
                                        </div>
                                        <CardContent className="pt-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-16 w-16 rounded-full overflow-hidden bg-muted">
                                                    {achievement.imageUrl ? (
                                                        <Image
                                                            src={achievement.imageUrl}
                                                            alt={achievement.name}
                                                            className="h-full w-full object-cover"
                                                            width={64}
                                                            height={64}
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full flex items-center justify-center">
                                                            <Trophy className="h-8 w-8 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">
                                                        {achievement.name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {achievement.description}
                                                    </p>
                                                    <p className="text-xs text-primary mt-1">
                                                        Earned {formatDistanceToNow(achievement.earnedAt, { addSuffix: true })}
                                                    </p>
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
    )
}