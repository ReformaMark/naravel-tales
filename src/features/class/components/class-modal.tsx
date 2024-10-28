"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAtom } from "jotai";
import { isClassModalOpenAtom } from "../class";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function ClassModal() {
    const [isOpen, setIsOpen] = useAtom(isClassModalOpenAtom);
    const [className, setClassName] = useState("");
    const [error, setError] = useState("");
    const createClass = useMutation(api.classes.create);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (className.length < 3) {
            setError("Class name must be at least 3 characters long");
            return;
        }

        if (className.length > 25) {
            setError("Class name must be less than 25 characters long");
            return;
        }

        await createClass({ name: className });
        setIsOpen(false);
        setClassName("");
        setError("");
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
                    <Button type="submit" className="w-full">Create Class</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
