"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useStudentId } from "@/features/students/hooks/use-student-id"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { FormEvent, useState } from "react"
import { api } from "../../../../convex/_generated/api"

export function InquiryFormDialog() {
    const studentId = useStudentId()
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const { mutate: createInquiry, isPending } = useMutation({
        mutationFn: useConvexMutation(api.inquiries.create),
        onSuccess: () => {
            setSubject("")
            setMessage("")
            setIsOpen(false)
        },
    })

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()

        await createInquiry({
            studentId,
            subject: subject.trim(),
            message: message.trim(),
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Send Message</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Send Inquiry to Teacher</DialogTitle>
                    <DialogDescription>
                        Send a message to your child&apos;s teacher. They will respond as soon as possible.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                            minLength={3}
                        />
                    </div>
                    <div className="space-y-2">
                        <Textarea
                            placeholder="Your message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            minLength={10}
                            className="min-h-[150px]"
                        />
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Sending..." : "Send Inquiry"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
} 