import { DashboardHeader } from "@/components/dashboard-header";
import { LearningProgressCard } from "@/features/parents/components/learning-progress-card";

const ProgressPage = () => {
    return (
        <>
            <DashboardHeader
                section="Progress"
                pageName="Learning Progress"
            />

            <LearningProgressCard />
        </>
    )
}

export default ProgressPage;