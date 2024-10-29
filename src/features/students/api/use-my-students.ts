import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

export const useMyStudents = ({ classId }: { classId: Id<"classes"> }) => {
    const data = useQuery(api.students.getMyStudents, { classId })
    const isLoading = data === undefined

    return {
        data,
        isLoading,
    }
}