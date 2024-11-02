import { DashboardHeader } from "@/components/dashboard-header";
import { TeacherNotesCard } from "@/features/parents/components/teacher-notes-card";

const NotesPage = () => {
    return (
        <>
            <DashboardHeader
                section="Progress"
                pageName="Teacher Notes"
            />

            <TeacherNotesCard />
        </>
    )
}

export default NotesPage;