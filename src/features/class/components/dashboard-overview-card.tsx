"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Trophy, Users, MessageCircle, BookOpen, LucideIcon } from "lucide-react"
import { useClassId } from "../hooks/use-class-id"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getAvatarColor, getInitials } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"

export const DashboardOverviewCard = () => {
    const router = useRouter()
    const classId = useClassId()
    const students = useQuery(api.classes.getStudentsByClass, { classId })
    const achievements = useQuery(api.classes.getClassAchievements, { classId })
    const inquiries = useQuery(api.inquiries.listByClass, { classId })
    const progress = useQuery(api.classes.getClassProgress, { classId })

    if (!students || !achievements || !inquiries || !progress) return null

    const recentAchievements = achievements
        .sort((a, b) => b.earnedAt - a.earnedAt)
        .slice(0, 5)

    const recentInquiries = inquiries
        .filter(i => i.status === "pending")
        .slice(0, 3)

    const stats = {
        totalStudents: students.length,
        activeStudents: progress.filter(p => p.lastPlayed > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
        totalAchievements: achievements.length,
        averageProgress: Math.round(progress.reduce((acc, p) => acc + p.progress, 0) / progress.length)
    }

    return (
        <div className="grid gap-6">
            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Students"
                    value={stats.totalStudents.toString()}
                    description="Enrolled students"
                    icon={Users}
                />
                <StatsCard
                    title="Active Students"
                    value={stats.activeStudents.toString()}
                    description="Active this week"
                    icon={Users}
                />
                <StatsCard
                    title="Achievements"
                    value={stats.totalAchievements.toString()}
                    description="Total earned"
                    icon={Trophy}
                />
                <StatsCard
                    title="Average Progress"
                    value={`${stats.averageProgress}%`}
                    description="Class completion"
                    icon={BookOpen}
                />
            </div>

            {/* Recent Activity */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Achievements */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Achievements</CardTitle>
                        <CardDescription>Latest student accomplishments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px]">
                            <div className="space-y-4">
                                {recentAchievements.map(achievement => {
                                    const student = students.find(s => s._id === achievement.studentId)
                                    if (!student) return null

                                    const fullName = `${student.fname} ${student.lname}`
                                    const initials = getInitials(student.fname, student.lname)
                                    const avatarColor = getAvatarColor(fullName)

                                    return (
                                        <div key={achievement._id} className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback className={`${avatarColor} text-white`}>
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{fullName}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Earned {achievement.name}
                                                </p>
                                            </div>
                                            <span className="ml-auto text-xs text-muted-foreground">
                                                {formatDistanceToNow(achievement.earnedAt, { addSuffix: true })}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Recent Inquiries */}
                <Card className="cursor-pointer hover:border-primary/50 transition-colors" onClick={() => router.push(`/teachers/${classId}/inquiries`)}>
                    <CardHeader>
                        <CardTitle>Pending Inquiries</CardTitle>
                        <CardDescription>Recent parent messages</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[300px]">
                            <div className="space-y-4">
                                {recentInquiries.map(inquiry => (
                                    <div key={inquiry._id} className="flex items-start gap-3">
                                        <MessageCircle className="h-5 w-5 mt-1 text-primary" />
                                        <div>
                                            <p className="text-sm font-medium">{inquiry.subject}</p>
                                            <p className="text-xs text-muted-foreground">
                                                From: {inquiry.student?.fname}&apos;s parent
                                            </p>
                                        </div>
                                        <span className="ml-auto text-xs text-muted-foreground">
                                            {formatDistanceToNow(inquiry.createdAt, { addSuffix: true })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

const StatsCard = ({ title, value, description, icon: Icon }: { title: string, value: string, description: string, icon: LucideIcon }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
    </Card>
)