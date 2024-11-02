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

interface InquiryResponseDialogProps {
    inquiryId: Id<"inquiries"> | null
    onClose: () => void
}

export function InquiryResponseDialog({ inquiryId, onClose }: InquiryResponseDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [response, setResponse] = useState("")
    const respondToInquiry = useMutation(api.inquiries.respond)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inquiryId || !response.trim() || response.length < 10) {
            toast.error("Please enter a response of at least 10 characters")
            return
        }

        setIsSubmitting(true)
        try {
            await respondToInquiry({
                inquiryId,
                response: response.trim(),
            })
            toast.success("Response sent successfully")
            setResponse("")
            onClose()
        } catch {
            toast.error("Failed to send response")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={!!inquiryId} onOpenChange={() => onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Respond to Inquiry</DialogTitle>
                    <DialogDescription>
                        Write your response to the parent&apos;s inquiry
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <Textarea
                            placeholder="Type your response here..."
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            className="min-h-[150px]"
                        />
                        {response.length > 0 && response.length < 10 && (
                            <p className="text-sm text-destructive">
                                Response must be at least 10 characters
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            Send Response
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
} 