"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button";
import { useSetAtom } from "jotai";
import { PlusCircle } from "lucide-react";
import { isClassModalOpenAtom } from "@/features/class/class";
import { useAllClass } from "@/features/class/api/use-all-class";
import { useEffect, useMemo } from "react";

const TeachersPage = () => {
  const router = useRouter()
  const setIsClassModalOpen = useSetAtom(isClassModalOpenAtom);

  const { data: classes, isLoading } = useAllClass()

  const classId = useMemo(() => classes?.[0]?._id, [classes])

  useEffect(() => {
    if (isLoading) return

    if (classId) {
      router.replace(`/teachers/${classId}`)
    }
  }, [classId, router, isLoading])

  return (
    <>
      {classId ? <>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Already have an existing class</h2>
            <p className="text-muted-foreground">Redirecting to your class...</p>
          </div>
        </div>
      </> : <>
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
      </>}
    </>
  )
}

export default TeachersPage;