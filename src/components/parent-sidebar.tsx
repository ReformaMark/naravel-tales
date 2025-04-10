"use client";

import {
  Frame,
  LayoutDashboardIcon,
  LineChartIcon,
  Map,
  MessageSquareIcon,
  PieChart,
  TrophyIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useMyChildren } from "@/features/parents/api/use-my-children";
import { useStudentId } from "@/features/students/hooks/use-student-id";
import { UserSidebarType } from "@/types";
import { StudentSwitcher } from "./student-switcher";

export function ParentSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const studentId = useStudentId();

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: `/parent/${studentId}`,
        icon: LayoutDashboardIcon,
        isActive: true,
        items: [
          {
            title: "Overview",
            url: `/parent/${studentId}`,
          },
          {
            title: "Recent Activities",
            url: `/parent/${studentId}/activities`,
          },
        ],
      },
      {
        title: "Progress",
        url: `/parent/${studentId}/progress`,
        icon: LineChartIcon,
        items: [
          {
            title: "Learning Progress",
            url: `/parent/${studentId}/progress`,
          },
          {
            title: "Teacher Notes",
            url: `/parent/${studentId}/notes`,
          },
        ],
      },
      {
        title: "Achievements",
        url: `/parent/${studentId}/achievements`,
        icon: TrophyIcon,
        items: [
          {
            title: "Badges & Trophies",
            url: `/parent/${studentId}/achievements`,
          },
          // {
          //   title: "Rewards History",
          //   url: `/parent/${studentId}/achievements/rewards`,
          // }
        ],
      },
      {
        title: "Communication",
        url: `/parent/${studentId}/inquiries`,
        icon: MessageSquareIcon,
        items: [
          {
            title: "Inquiries",
            url: `/parent/${studentId}/inquiries`,
          },
        ],
      },
      // {
      //   title: "Settings",
      //   url: `/parent/${studentId}/settings`,
      //   icon: Settings2,
      //   items: [
      //     {
      //       title: "Profile Settings",
      //       url: `/parent/${studentId}/settings`,
      //     },
      //     {
      //       title: "Notifications",
      //       url: `/parent/${studentId}/settings/notifications`,
      //     }
      //   ],
      // }
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

  const { data: user } = useCurrentUser();
  const { data: students, isLoading: studentsLoading } = useMyChildren();
  const currentStudent = students?.find((s) => s._id === studentId);

  if (!user) return null;
  if (!students) return null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <StudentSwitcher
          students={students.map((s) => ({
            name: `${s.fname} ${s.lname}`,
            _id: s._id,
          }))}
          currentStudent={
            currentStudent
              ? {
                  name: `${currentStudent.fname} ${currentStudent.lname}`,
                  _id: currentStudent._id,
                }
              : undefined
          }
          isLoading={studentsLoading}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavParents projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user as UserSidebarType} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
