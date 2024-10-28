"use client"


import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavParents } from "@/components/nav-parents"
import { NavUser } from "@/components/nav-user"
import { SectionSwitcher } from "@/components/section-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useCurrentUser } from "@/features/auth/api/use-current-user"

interface UserSidebarType {
  fname: string;
  lname: string;
  email: string;
  avatar: string;
}

const data = {
  teams: [
    {
      name: "201-A Class",
      logo: GalleryVerticalEnd,
      plan: "Mabuhay",
    },
    {
      name: "201-B Class",
      logo: AudioWaveform,
      plan: "Matapat",
    },
    {
      name: "201-C Class",
      logo: Command,
      plan: "Masigla",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/teachers",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/teachers",
        },
        {
          title: "Monitoring",
          url: "/teachers/monitoring",
        },
        {
          title: "Reports",
          url: "/teachers/reports",
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
          url: "#",
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
          title: "Start Reading",
          url: "#",
        },
        {
          title: "List of Stories",
          url: "#",
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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: user } = useCurrentUser()

  if (!user) return null

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SectionSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavParents projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user as UserSidebarType} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}