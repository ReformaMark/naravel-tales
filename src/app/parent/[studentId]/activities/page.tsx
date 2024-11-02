import { DashboardHeader } from "@/components/dashboard-header";
import { RecentActivitiesCard } from "@/features/parents/components/recent-activities-card";

const activitiesPage = () => {
    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-2 px-4">
                    <DashboardHeader
                        section="Dashboard"
                        pageName="Recent Activities"
                    />
                </div>
            </header>

            <RecentActivitiesCard />
        </>
    )
}

export default activitiesPage;