import { usePathname } from "next/navigation"
import { Id } from "../../../../convex/_generated/dataModel"

export const useStudentId = () => {
    const pathname = usePathname()

    const studentId = pathname?.split('/').filter(segment => segment)[1]

    return studentId as Id<"students">
}