import { DashboardHeader } from "@/components/dashboard-header"
import { ClassAchievementsCard } from "@/features/class/components/class-achievements-card"


export default function ClassAchievementsPage() {


    return (
        <>
            <DashboardHeader
                section="Class"
                pageName="Achievements"
            />
            
            <ClassAchievementsCard />
        </>
    )
}