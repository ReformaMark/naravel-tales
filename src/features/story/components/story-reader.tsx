"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Student } from "@/features/students/student-types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";
import { StudentSelectDialog } from "./student-select-dialog";

export interface StoryReaderProps {
  story: {
    _id: Id<"stories">;
    title: string;
    content: string;
    url: string;
  };
}

export function StoryReader({
  story,
  classId,
}: StoryReaderProps & { classId: Id<"classes"> }) {
  // const [showModeSelect, setShowModeSelect] = useState(false);
  const [showStudentSelect, setShowStudentSelect] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<{
    ids: Id<"students">[];
    students: Student[];
  }>({ ids: [], students: [] });
  const router = useRouter();

  const handleStudentSelect = (
    selectedIds: Id<"students">[],
    students: Student[]
  ) => {
    setSelectedStudents({ ids: selectedIds, students });
  };

  const handlePlayClick = () => {
    if (selectedStudents.ids.length > 0) {
      const searchParams = new URLSearchParams();
      selectedStudents.ids.forEach((id) =>
        searchParams.append("studentIds[]", id)
      );
      router.push(
        `/teachers/${classId}/play/${story._id}?${searchParams.toString()}`
      );
    }
    setShowStudentSelect(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <Card className="overflow-hidden bg-card/50 backdrop-blur-sm shadow-xl min-h-[80vh] relative">
        <div className="flex flex-col h-full">
          <div className="px-8 pb-4 pt-4">
            <div className="relative w-full aspect-video max-h-[400px]">
              <Image
                src={story.url}
                alt={story.title}
                fill
                className="object-cover rounded-lg"
                priority
              />
            </div>
          </div>

          <div className="p-8 flex-1 flex flex-col">
            <ScrollArea className="flex-1 pr-6">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {story.content.split("\n\n").map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-xl leading-relaxed font-serif text-justify mb-6 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollArea>

            <div className="pt-6 border-t mt-6">
              <Button
                onClick={() => setShowStudentSelect(true)}
                className="w-full text-lg py-6 font-semibold"
                size="lg"
              >
                Start Reading Journey
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* <Dialog open={showModeSelect} onOpenChange={setShowModeSelect}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center mb-6">
              Choose Reading Mode
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              onClick={() => {
                setShowModeSelect(false);
                setShowStudentSelect(true);
              }}
            >
              <Users2 className="h-8 w-8" />
              <span className="text-lg font-medium">Select Students</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog> */}

      <StudentSelectDialog
        open={showStudentSelect}
        onOpenChange={setShowStudentSelect}
        classId={classId}
        storyId={story._id}
        onSelect={handleStudentSelect}
        selectedIds={selectedStudents.ids}
        onPlayClick={handlePlayClick} // Add this new prop
      />
    </div>
  );
}
