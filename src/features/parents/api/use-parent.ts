import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export const useParent = () => {
    const data = useQuery(api.parents.getAllParent)
    const isLoading = data === undefined

    return {
        data,
        isLoading,
    }
}