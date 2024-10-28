"use client"

import { Button } from "@/components/ui/button";
import { useAuthActions } from "@convex-dev/auth/react";

const ParentsPage = () => {
    const { signOut } = useAuthActions()

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
            <Button onClick={() => signOut()}>
                Logout
            </Button>
        </div>
    )
}

export default ParentsPage;