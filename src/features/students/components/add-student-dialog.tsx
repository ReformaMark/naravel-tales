'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from 'react'
import { Student } from '../student-types'
import { useClassId } from "@/features/class/hooks/use-class-id"
import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { toast } from "sonner"
import { cn, isValidName } from "@/lib/utils"
import { useAtom } from "jotai"
import { isAddStudentModalOpenAtom } from "../add-student-jotai"

export function AddStudentDialog() {
    const [isOpen, setIsOpen] = useAtom(isAddStudentModalOpenAtom)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [newStudent, setNewStudent] = useState({
        fname: '',
        lname: '',
    })

    const classId = useClassId()
    const create = useMutation(api.students.createStudent)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!classId) return

        try {
            setIsPending(true)
            setError(null)

            if (!isValidName(newStudent.fname)) {
                setError('First name must be at least 2 characters long')
                setIsPending(false)
                return
            }

            if (!isValidName(newStudent.lname)) {
                setError('Last name must be at least 2 characters long')
                setIsPending(false)
                return
            }

            if (newStudent.fname.length > 50 || newStudent.lname.length > 50) {
                setError('Names cannot be longer than 50 characters')
                setIsPending(false)
                return
            }

            const nameRegex = /^[a-zA-Z\s-']+$/
            if (!nameRegex.test(newStudent.fname) || !nameRegex.test(newStudent.lname)) {
                setError('Names can only contain letters, spaces, hyphens and apostrophes')
                setIsPending(false)
                return
            }

            await create({ classId, fname: newStudent.fname.trim(), lname: newStudent.lname.trim() })

            toast.success("Student added successfully")
            setNewStudent({ fname: '', lname: '' })
            setIsOpen(false)
        } catch (error) {
            toast.error("Failed to add student")
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Add New Student</DialogTitle>
                    </DialogHeader>
                    {error && <p className="text-red-500">* {error}</p>}
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="fname" className="text-left">First Name</Label>
                            <Input
                                id="fname"
                                name="fname"
                                value={newStudent.fname}
                                onChange={(e) => setNewStudent({ ...newStudent, fname: e.target.value })}
                                className={cn(error && 'border-red-500', "col-span-3")}
                                disabled={isPending}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="lname" className="text-left">Last Name</Label>
                            <Input
                                id="lname"
                                name="lname"
                                value={newStudent.lname}
                                onChange={(e) => setNewStudent({ ...newStudent, lname: e.target.value })}
                                className={cn(error && 'border-red-500', "col-span-3")}
                                disabled={isPending}
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Adding..." : "Add Student"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}