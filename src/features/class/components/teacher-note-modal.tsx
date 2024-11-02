"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useMutation } from "convex/react"
import { useState } from "react"
import { toast } from "sonner"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

interface TeacherNoteModalProps {
    isOpen: boolean
    onClose: () => void
    progressId: Id<"progress">
    studentName: string
}

export function TeacherNoteModal({ isOpen, onClose, progressId, studentName }: TeacherNoteModalProps) {
    const [note, setNote] = useState("")
    const addNote = useMutation(api.progress.addTeacherNote)

    const handleSubmit = async () => {
        try {
            await addNote({
                progressId,
                note: note.trim()
            })
            toast.success("Note added successfully")
            onClose()
        } catch (error) {
            toast.error("Failed to add note")
            console.error(error)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Teacher&apos;s Note</DialogTitle>
                    <DialogDescription>
                        Add feedback for {studentName}&apos;s performance in this story.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Textarea
                        placeholder="Enter your feedback here..."
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!note.trim()}>Save Note</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}