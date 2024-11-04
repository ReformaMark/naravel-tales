'use client'
import {
    BookOpen,
    SquareTerminal
  } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
  } from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavUser } from "./nav-user"
import { UserSidebarType } from "@/types"
import { useCurrentUser } from "@/features/auth/api/use-current-user"
import Link from "next/link"
import Image from "next/image"

export default function AdminSidebar() {
    const { data: user } = useCurrentUser()
    
    const data = {
    navMain: [
        {
        title: "Dashboard",
        url: `#`,
        icon: SquareTerminal,
        isActive: true,
        items: [
            {
            title: "Overview",
            url: `/admin/overview`,
            },
        ],
        },
        {
        title: "Stories",
        url: "#",
        icon: BookOpen,
        items: [
            {
            title: "Create Stories",
            url: "/admin/create-stories",
            },
            {
            title: "List of Stories",
            url: `/admin/list-of-stories`,
            },
            {
            title: "Inactive Stories",
            url: "/admin/archived-stories",
            },
           
          
        ],
        },
    ],
   
    }

    return (
      <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link className="flex items-center justify-center" href="/admin">
          <Image 
            src="/logo.svg" 
            alt="Reading App Logo" 
            className="h-8 w-auto pointer-events-none" 
            height="32" 
            width="32" 
          />
          <span className="sr-only">Reading App</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
       
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user as UserSidebarType} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
    )
}