"use client";

import { useAtom } from "jotai";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { isShowInstructionsModalOpenAtom } from "@/features/settings/show-instructions";

export function InstructionsDialog() {
  const [isOpen, setIsOpen] = useAtom(isShowInstructionsModalOpenAtom);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <h1 className="text-center text-primary text-2xl font-bold">
          How to play
        </h1>

        <ul className="list-disc text-muted-foreground px-7">
          <li>Read the instruction text that appears.</li>
          <li>
            Look at the image and identify which part matches the instruction.
          </li>
          <li>Drag the image to the correct spot on the screen</li>
          <li>
            You are allowed to check the sequence only 3 times before the game
            automatically places it in the correct spot if you exceed this limit
          </li>
        </ul>

        <p className="text-muted-foreground mt-3">
          Goal: Correctly place the image in the designated area according to
          the instructions to score points!
        </p>
      </DialogContent>
    </Dialog>
  );
}
