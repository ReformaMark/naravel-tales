import { DashboardHeader } from "@/components/dashboard-header";
import { TeacherProfile } from "@/features/parents/components/teacher-profile";
import { ParentInquiriesList } from "@/features/parents/components/parent-inquiries-list";

const InquiriesPage = () => {
  return (
    <>
      <DashboardHeader section="Communication" pageName="Inquiries" />

      <div className="space-y-6">
        <TeacherProfile />
        <ParentInquiriesList />
      </div>
    </>
  );
};

export default InquiriesPage;
