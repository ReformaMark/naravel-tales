"use client"


import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { isEnterStudentCodeModalOpenAtom } from "@/features/parents/enter-student-code-jotai"
import { useSetAtom } from "jotai"
import { useRouter } from "next/navigation"
import { Id } from "../../convex/_generated/dataModel"

export function StudentSwitcher({
  students,
  currentStudent,
  isLoading,
}: {
  students: {
    name: string;
    _id: Id<"students">;
  }[]
  currentStudent: {
    name: string;
    _id: Id<"students">;
  } | undefined
  isLoading: boolean
}) {
  const { isMobile } = useSidebar()

  const setIsEnterStudentCodeModalOpenAtom = useSetAtom(isEnterStudentCodeModalOpenAtom)
  const router = useRouter();

  if (isLoading) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                <span className="text-xs">
                  {currentStudent?.name.charAt(0)}
                </span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentStudent?.name}
                </span>
                <span className="truncate text-xs">Student</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Students
            </DropdownMenuLabel>
            {students.map((student, index) => (
              <DropdownMenuItem
                key={student.name}
                onClick={() => router.push(`/parent/${student._id}`)}
                className="gap-2 p-2 cursor-pointer hover:bg-sidebar-accent"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border bg-primary text-sidebar-primary-foreground">
                  <span className="text-xs">{student.name.charAt(0)}</span>
                </div>
                <span className="truncate">{student.name}</span>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2 cursor-pointer"
              onClick={() => setIsEnterStudentCodeModalOpenAtom(true)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div
                className="font-medium text-muted-foreground"
              >
                Add student
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
