import { usePathname } from "next/navigation"
import { Id } from "../../../../convex/_generated/dataModel"

export const useClassId = () => {
    const pathname = usePathname()
    
    const classId = pathname?.split('/').filter(segment => segment)[1]

    return classId as Id<"classes">
}