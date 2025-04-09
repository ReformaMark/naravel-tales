"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface TeacherNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentIds: Id<"students">[];
  studentsNames: string;
  storyId: Id<"stories">; // Add this prop
}

export function TeacherNoteModal({
  isOpen,
  onClose,
  studentIds,
  studentsNames,
  storyId,
}: TeacherNoteModalProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateProgress = useMutation(api.progress.updateMultipleProgress);

  const handleSubmit = async () => {
    if (!note.trim()) return;

    try {
      setIsSubmitting(true);

      // Only send the note update
      await updateProgress({
        studentIds,
        storyId,
        note: note.trim(),
      });

      toast.success("Notes added successfully for all students");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add notes");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Teacher&apos;s Note</DialogTitle>
          <DialogDescription>
            Add feedback for: {studentsNames}
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
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!note.trim() || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Notes for All Students"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
