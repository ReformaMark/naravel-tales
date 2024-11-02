
import { DashboardContent } from "@/features/parents/components/dashboard-content";
import { Suspense } from "react"

const StudentParentPage = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardContent />
        </Suspense>
    )
}

export default StudentParentPage;