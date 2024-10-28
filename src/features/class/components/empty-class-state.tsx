"use client"

import { Button } from "@/components/ui/button";
import { useSetAtom } from "jotai";
import { isClassModalOpenAtom } from "../class";
import { PlusCircle } from "lucide-react";

export function EmptyClassState() {
    const setIsClassModalOpen = useSetAtom(isClassModalOpenAtom);

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">No Classes Yet</h2>
                <p className="text-muted-foreground">Create your first class to get started</p>
            </div>
            <Button onClick={() => setIsClassModalOpen(true)} size="lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                Add Class
            </Button>
        </div>
    );
}
