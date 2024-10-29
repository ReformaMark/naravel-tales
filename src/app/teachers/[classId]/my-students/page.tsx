'use client'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useClassId } from "@/features/class/hooks/use-class-id"
import { isAddStudentModalOpenAtom } from "@/features/students/add-student-jotai"
import { useMyStudents } from "@/features/students/api/use-my-students"
import { NoStudentsFound } from "@/features/students/components/no-students-found"
import { StudentCard } from '@/features/students/components/student-card'
import { StudentCardSkeleton } from '@/features/students/components/student-card-skeleton'
import { useAtom } from "jotai"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useEffect, useState } from 'react'

const STUDENTS_PER_PAGE = 12

export default function StudentsPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [, setIsAddStudentDialogOpen] = useAtom(isAddStudentModalOpenAtom)

    const classId = useClassId()
    const result = useMyStudents({
        classId,
        searchQuery: debouncedSearch,
        page: currentPage,
        limit: STUDENTS_PER_PAGE
    })


    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
            setCurrentPage(1)
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery])

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleAddStudent = () => {
        setIsAddStudentDialogOpen(true)
    }

    const handleArchive = (id: string) => {
        // Archive logic
    }

    if (!result) {
        return (
            <>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-mut">Dashboard</BreadcrumbPage>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>My Students</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <Card className="w-full max-w-7xl m-auto">
                    <CardHeader className="flex flex-col space-y-4">
                        <div className="flex flex-row items-center justify-between">
                            <CardTitle>My Students</CardTitle>
                            <Button disabled>Add Student</Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or student code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6">
                        <ScrollArea className="h-[calc(100vh-300px)]">
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {Array.from({ length: STUDENTS_PER_PAGE }).map((_, index) => (
                                    <StudentCardSkeleton key={index} />
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </>
        )
    }

    const { students, totalPages } = result

    if (students.length === 0 && !searchQuery) {
        return <NoStudentsFound />
    }

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-mut">Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>My Students</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <Card className="w-full max-w-7xl m-auto">
                <CardHeader className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-between">
                        <CardTitle>My Students</CardTitle>
                        <Button onClick={handleAddStudent}>Add Student</Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or student code..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                        {students.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                No students found matching your search
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {students.map((student) => (
                                    <StudentCard
                                        key={student._id}
                                        student={student}
                                        onArchive={handleArchive}
                                    />
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-2 mt-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center justify-center min-w-[100px]">
                                <span className="text-sm text-muted-foreground">
                                    Page {currentPage} of {totalPages}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}
