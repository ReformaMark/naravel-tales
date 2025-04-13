"use client";

import { SoundToggle } from "@/components/sound-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { SequenceGame } from "@/features/story/components/sequence-game";
import { useQuery } from "convex/react";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { useAtom } from "jotai";
import { isShowInstructionsModalOpenAtom } from "@/features/settings/show-instructions";

const PlayGamePage = ({
  params: { classId, storyId },
}: {
  params: { classId: Id<"classes">; storyId: Id<"stories"> };
}) => {
  const [, setIsOpen] = useAtom(isShowInstructionsModalOpenAtom);
  const searchParams = useSearchParams();

  const studentIds = searchParams.getAll("studentIds[]") as Id<"students">[];
  const studentId = searchParams.get("studentId") as Id<"students"> | null;

  // const isGroupMode = searchParams.get("mode") === "group";
  // const groupId = searchParams.get("groupId");

  // const [showModeSelect, setShowModeSelect] = useState(!studentId);
  // const [showStudentSelect, setShowStudentSelect] = useState(false);
  // const [showGroupSelect, setShowGroupSelect] = useState(false);
  // const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  // const router = useRouter();

  const story = useQuery(api.stories.getById, { id: storyId });

  const students = useQuery(api.students.getByIds, {
    ids: studentIds.length > 0 ? studentIds : studentId ? [studentId] : [],
  });

  // const student = studentId
  //   ? useQuery(api.students.getById, { id: studentId })
  //   : null;

  // Show mode selection if no student or group is selected
  // if (showModeSelect && !selectedGroup && !isGroupMode) {
  //   return (
  //     <div className="container max-w-2xl mx-auto py-8 px-4">
  //       <Button
  //         variant="ghost"
  //         className="mb-8"
  //         onClick={() => window.history.back()}
  //       >
  //         <ArrowLeftIcon className="w-4 h-4 mr-2" />
  //         Back
  //       </Button>

  //       <div className="text-center space-y-6 mb-12">
  //         <h1 className="text-3xl font-bold text-primary">
  //           {story?.title || "Loading..."}
  //         </h1>
  //         <p className="text-xl text-muted-foreground">Choose reading mode</p>
  //       </div>

  //       <div className="grid gap-4">
  //         <Card
  //           className="cursor-pointer hover:border-primary transition-colors"
  //           onClick={() => setShowStudentSelect(true)}
  //         >
  //           <CardContent className="flex items-center gap-4 p-6">
  //             <User className="w-8 h-8 text-primary" />
  //             <div>
  //               <h2 className="text-xl font-semibold">Individual Mode</h2>
  //               <p className="text-muted-foreground">
  //                 Play with a single student
  //               </p>
  //             </div>
  //           </CardContent>
  //         </Card>

  //         <Card
  //           className="cursor-pointer hover:border-primary transition-colors"
  //           onClick={() => setShowGroupSelect(true)}
  //         >
  //           <CardContent className="flex items-center gap-4 p-6">
  //             <Users2 className="w-8 h-8 text-primary" />
  //             <div>
  //               <h2 className="text-xl font-semibold">Group Mode</h2>
  //               <p className="text-muted-foreground">
  //                 Play with a group of students
  //               </p>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>

  //       <StudentSelectDialog
  //         open={showStudentSelect}
  //         onOpenChange={setShowStudentSelect}
  //         classId={classId}
  //         storyId={storyId}
  //         mode="individual"
  //         onSelect={(ids) => {
  //           if (ids.length > 0) {
  //             router.push(
  //               `/teachers/${classId}/play/${storyId}?studentId=${ids[0]}`
  //             );
  //           }
  //         }}
  //       />

  //       <GroupSelectDialog
  //         open={showGroupSelect}
  //         onOpenChange={setShowGroupSelect}
  //         classId={classId}
  //         storyId={storyId}
  //         onGroupSelect={setSelectedGroup}
  //       />
  //     </div>
  //   );
  // }

  // if (!isGroupMode && !studentId) {
  //   return (
  //     <div className="flex flex-col items-center justify-center p-4 sm:p-8 max-w-2xl mx-auto">
  //       <p className="text-lg sm:text-xl mb-4">Invalid game session</p>
  //       <Button asChild>
  //         <Link href={`/teachers/${classId}/list`}>
  //           <ArrowLeftIcon className="mr-2 h-4 w-4" />
  //           Back to Stories
  //         </Link>
  //       </Button>
  //     </div>
  //   );
  // }

  // if (!story || (!student && !isGroupMode)) {
  //   return (
  //     <div className="container mx-auto p-4 max-w-7xl">
  //       <Skeleton className="h-[300px] sm:h-[600px] w-full rounded-lg" />
  //     </div>
  //   );
  // }

  // if (!studentId || !classId) {
  //   return (
  //     <div className="flex flex-col items-center justify-center p-4 sm:p-8 max-w-2xl mx-auto">
  //       <p className="text-lg sm:text-xl mb-4">Invalid game session</p>
  //       <Button asChild>
  //         <Link href={`/teachers/${classId}/list`}>
  //           <ArrowLeftIcon className="mr-2 h-4 w-4" />
  //           Back to Stories
  //         </Link>
  //       </Button>
  //     </div>
  //   );
  // }

  // if (!story || (!student && !selectedGroup)) {
  //   return (
  //     <div className="container mx-auto p-4 max-w-7xl">
  //       <Skeleton className="h-[300px] sm:h-[600px] w-full rounded-lg" />
  //     </div>
  //   );
  // }

  // if (!story) {
  //   return (
  //     <div className="container mx-auto p-4 max-w-7xl">
  //       <Skeleton className="h-[300px] sm:h-[600px] w-full rounded-lg" />
  //     </div>
  //   );
  // }

  if (!studentIds.length && !studentId) {
    return (
      <div className="flex flex-col items-center justify-center p-4 sm:p-8 max-w-2xl mx-auto">
        <p className="text-lg sm:text-xl mb-4">Invalid game session</p>
        <Button asChild>
          <Link href={`/teachers/${classId}/list`}>
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to Stories
          </Link>
        </Button>
      </div>
    );
  }

  if (!story || !students) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <Skeleton className="h-[300px] sm:h-[600px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-mut">Stories</BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Game</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="min-h-screen p-2 sm:p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="p-3 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  <Link href={`/teachers/${classId}/list`}>
                    <ArrowLeftIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Exit Game
                  </Link>
                </Button>

                <div className="text-center flex-1">
                  <h1 className="text-lg sm:text-2xl font-bold text-primary mb-0.5 sm:mb-1 line-clamp-1">
                    {story.title}
                  </h1>
                  <p className="text-xs sm:text-base text-muted-foreground">
                    {students.length > 1
                      ? `Grading ${students.length} students`
                      : `Playing as ${students[0]?.fname} ${students[0]?.lname}`}
                  </p>
                </div>

                <div className="w-full flex justify-center mt-3 lg:mt-0">
                  <Button
                    variant="default"
                    className="text-sm sm:text-base lg:w-[250px]"
                    onClick={() => setIsOpen(true)}
                  >
                    How to Play
                  </Button>
                </div>
              </div>
              <div className="w-full sm:w-[100px] flex justify-end">
                <SoundToggle />
              </div>
            </CardHeader>

            <CardContent className="p-2 sm:p-4 md:p-6 overflow-hidden">
              <div className="w-full overflow-x-hidden">
                <SequenceGame
                  storyId={storyId}
                  studentIds={studentIds.length > 0 ? studentIds : [studentId!]}
                  students={students}
                  sequenceCards={story.sequenceCards}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PlayGamePage;
