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

import { isClassModalOpenAtom } from "@/features/class/class"
import { useSetAtom } from "jotai"
import { useRouter } from "next/navigation"
import { Id } from "../../convex/_generated/dataModel"

export function SectionSwitcher({
  classes,
  currentClass,
  isLoading,
}: {
  classes: {
    name: string;
    _id: Id<"classes">;
  }[]
  currentClass: {
    name: string;
    _id: Id<"classes">;
  } | undefined
  isLoading: boolean
}) {
  const { isMobile } = useSidebar()

  const setIsClassModalOpen = useSetAtom(isClassModalOpenAtom);
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
                  {currentClass?.name.charAt(0)}
                </span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {currentClass?.name}
                </span>
                <span className="truncate text-xs">Class</span>
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
              Classes
            </DropdownMenuLabel>
            {classes.map((classItem, index) => (
              <DropdownMenuItem
                key={classItem.name}
                onClick={() => router.push(`/teachers/${classItem._id}`)}
                className="gap-2 p-2 cursor-pointer hover:bg-sidebar-accent"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border bg-primary text-sidebar-primary-foreground">
                  <span className="text-xs">{classItem.name.charAt(0)}</span>
                </div>
                <span className="truncate">{classItem.name}</span>
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2 cursor-pointer"
              onClick={() => setIsClassModalOpen(true)}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div
                className="font-medium text-muted-foreground"
              >
                Add section
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
