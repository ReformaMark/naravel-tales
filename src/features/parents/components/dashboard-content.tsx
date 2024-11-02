"use client"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarTrigger
} from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Book, Star, Trophy } from "lucide-react"
import { useStudentId } from "@/features/students/hooks/use-student-id"
import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export const DashboardContent = () => {
    const studentId = useStudentId()
    const overview = useQuery(api.parents.getChildDashboardOverview, { studentId })

    if (!overview) return null

    const { stats, recentAchievements } = overview

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="font-medium">Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Overview</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>

            <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
                {/* Stats Overview */}
                <div className="grid auto-rows-min gap-6 md:grid-cols-3">
                    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-primary">Level Progress</CardTitle>
                            <TrendingUp className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">Level {stats?.level ?? 1}</div>
                            <Progress
                                value={stats?.currentExp && stats.nextLevelExp ? (stats.currentExp / stats.nextLevelExp) * 100 : 0}
                                className="mt-3 h-2 bg-primary/10"
                            />
                            <p className="mt-2 text-sm text-primary/70">
                                {stats?.currentExp ?? 0} / {stats?.nextLevelExp ?? 100} XP
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-primary">Stories Completed</CardTitle>
                            <Book className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.storiesCompleted ?? 0}</div>
                            <p className="text-sm text-primary/70 mt-2">
                                Average Accuracy: {stats?.averageAccuracy ?? 0}%
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-primary">Total Stars</CardTitle>
                            <Star className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.totalStarsEarned ?? 0}</div>
                            <p className="text-sm text-primary/70 mt-2">
                                Total Points: {stats?.totalPoints ?? 0}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Activity Section */}
                <Card className="flex-1 hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-primary text-xl">Recent Achievements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recentAchievements?.length ? (
                            <div className="space-y-4">
                                {recentAchievements.map((achievement) => (
                                    <div
                                        key={achievement._id}
                                        className="flex items-center gap-4 rounded-lg border p-6 hover:border-primary/20 hover:shadow-md transition-all duration-300 bg-gradient-to-r from-primary/5 to-transparent"
                                    >
                                        <div className="p-2 rounded-full bg-primary/10">
                                            <Trophy className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-primary text-lg">{achievement.name}</h4>
                                            <p className="text-sm text-primary/70">
                                                {achievement.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-primary/70 py-8">
                                No achievements yet. Start playing to earn achievements!
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}