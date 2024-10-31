"use client"

import { Button } from "@/components/ui/button";
import { useMyChildren } from "@/features/parents/api/use-my-children";
import { isEnterStudentCodeModalOpenAtom } from "@/features/parents/enter-student-code-jotai";
import { useAuthActions } from "@convex-dev/auth/react";
import { useSetAtom } from "jotai";
import { PlusCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const ParentsPage = () => {
    const { signOut } = useAuthActions()
    const setIsEnterStudentCodeModalOpenAtom = useSetAtom(isEnterStudentCodeModalOpenAtom)
    const router = useRouter()

    const { data: students, isLoading: studentsLoading } = useMyChildren()

    const studentId = useMemo(() => students?.[0]?._id, [students])

    useEffect(() => {
        if (studentsLoading) return

        if (studentId) {
            router.replace(`/parent/${studentId}`)
        }
    }, [studentId, router, studentsLoading])

    return (
        <>
            {studentId ?
                <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">Already have a linked student</h2>
                        <p className="text-muted-foreground">Redirecting to your student...</p>
                    </div>
                </div>
                : <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">No child/children linked into your account yet?</h2>
                        <p className="text-muted-foreground">Enter your child&apos;s code by clicking the button below!</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => signOut()}
                            size="lg"
                            variant="outline"
                        >
                            Logout
                        </Button>
                        <Button
                            onClick={() => setIsEnterStudentCodeModalOpenAtom(true)}
                            size="lg"
                        >
                            <PlusCircleIcon className="mr-2 h-5 w-5" />
                            Link here
                        </Button>
                    </div>
                </div>}

        </>
    )
}

export default ParentsPage;