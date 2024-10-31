"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { api } from "../../../../convex/_generated/api"
import { isEnterStudentCodeModalOpenAtom } from "../enter-student-code-jotai"
import { getConvexErrorMessage } from "@/lib/utils"
import { toast } from "sonner"

export const EnterStudentCodeModal = () => {
    const [isOpen, setIsOpen] = useAtom(isEnterStudentCodeModalOpenAtom)
    const [code, setCode] = useState<string>("")
    const router = useRouter()

    const { mutate, isPending, error } = useMutation({
        mutationFn: useConvexMutation(api.students.linkParentToStudent),
        onSuccess: (data) => {
            setCode("")
            setIsOpen(false)
            toast.success("Student linked successfully!")
            router.push(`/parent/${data}`)
        },
    })

    const invalidCode = code.length !== 6

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (invalidCode) return

        mutate({
            code: code.trim()
        })
    }

    const errorMessage = error ? getConvexErrorMessage(error) : ""


    return (
        <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <DialogContent>
                <DialogHeader>
                    {/* TODO: Create an indepth popup where it talks about what the student code is  */}
                    <DialogTitle>Enter student code</DialogTitle>
                    <DialogDescription>
                        Note: you get student code from asking the teacher.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={onSubmit}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Input
                            type="text"
                            required
                            onChange={(e) => setCode(e.target.value)}
                            value={code}
                            className={`${errorMessage ? "border-red-500" : ""}`}
                        />
                        {errorMessage && (
                            <p className="text-sm text-red-500">
                                {errorMessage}
                            </p>
                        )}
                    </div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={isPending || invalidCode}
                    >
                        {isPending ? "Linking..." : "Save"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}