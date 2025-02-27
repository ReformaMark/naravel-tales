'use client'

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useSetAtom } from 'jotai'
import { isAddStudentModalOpenAtom } from "../add-student-jotai"

export function NoStudentsFound() {
    const setIsAddStudentModalOpen = useSetAtom(isAddStudentModalOpenAtom)

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">No Students Yet</h2>
                <p className="text-muted-foreground">Add your first student to get started</p>
            </div>
            <Button onClick={() => setIsAddStudentModalOpen(true)} size="lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Student
            </Button>
        </div>
    )
}