import { DashboardHeader } from "@/components/dashboard-header"
import { AchievementsCard } from "@/features/students/components/achievements-card"

const AchievementsPage = () => {
    return (
        <>
            <DashboardHeader
                section="Progress"
                pageName="Achievements"
            />
            <AchievementsCard />
        </>
    )
}

export default AchievementsPage;