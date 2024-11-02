"use client";

import { BookOpen, Bot, Settings2, SquareTerminal } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { SectionSwitcher } from "@/components/section-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useAllClass } from "@/features/class/api/use-all-class";
import { useClassId } from "@/features/class/hooks/use-class-id";
import { UserSidebarType } from "@/types";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const classId = useClassId();

  const data = {
    navMain: [
      {
        title: "Dashboard",

        url: `/teachers/${classId}/dashboard`,

        icon: SquareTerminal,

        isActive: true,

        items: [
          {
            title: "Overview",

            url: `/teachers/${classId}`,
          },

          {
            title: "Monitoring",

            url: `/teachers/${classId}/monitoring`,
          },

          {
            title: "Reports",

            url: `/teachers/${classId}/reports`,
          },
        ],
      },

      {
        title: "Class",

        url: "#",

        icon: Bot,

        items: [
          {
            title: "My Students",

            url: `/teachers/${classId}/my-students`,
          },

          {
            title: "Inquiries",

            url: `/teachers/${classId}/inquiries`,
          },

          {
            title: "Achievements",

            url: `/teachers/${classId}/achievements`,
          },

          {
            title: "Performance",

            url: "#",
          },

          {
            title: "Settings",

            url: "#",
          },
        ],
      },

      {
        title: "Stories",

        url: "#",

        icon: BookOpen,

        items: [
          {
            title: "List of Stories",

            url: `/teachers/${classId}/list`,
          },

          {
            title: "Archived Stories",

            url: "#",
          },

          {
            title: "Settings",

            url: "#",
          },
        ],
      },

      {
        title: "Settings",

        url: "#",

        icon: Settings2,

        items: [
          {
            title: "User Profile",

            url: "#",
          },

          {
            title: "Classes",

            url: "#",
          },

          {
            title: "Students",

            url: "#",
          },
        ],
      },
    ],
  };

  const { data: user } = useCurrentUser();

  const { data: classes, isLoading: sectionSwitcherLoading } = useAllClass();

  const currentClass = classes?.find((c) => c._id === classId);

  if (!user) return null;

  if (!classes) return null;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SectionSwitcher
          classes={classes.map((c) => ({ name: c.name, _id: c._id }))}
          currentClass={
            currentClass
              ? { name: currentClass.name, _id: currentClass._id }
              : undefined
          }
          isLoading={sectionSwitcherLoading}
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
