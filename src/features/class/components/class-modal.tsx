"use client"

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { isClassModalOpenAtom } from "../class";

export function ClassModal() {
    const [isOpen, setIsOpen] = useAtom(isClassModalOpenAtom);
    const [className, setClassName] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    const createClass = useMutation(api.classes.create);
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setPending(true);

        if (className.length < 3) {
            setError("Class name must be at least 3 characters long");
            setPending(false);
            return;
        }

        if (className.length > 25) {
            setError("Class name must be less than 25 characters long");
            setPending(false);
            return;
        }

        const classId = await createClass({ name: className });
        setIsOpen(false);
        setClassName("");
        setError("");
        router.push(`/teachers/${classId}`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create a New Class</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Input
                            placeholder="Class Name ex: Class 1"
                            value={className}
                            onChange={(e) => {
                                setClassName(e.target.value);
                                setError("");
                            }}
                        />
                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                    <Button type="submit" className="w-full" disabled={pending}>
                        {pending ? "Creating..." : "Create Class"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
