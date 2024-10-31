import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export const useMyChildren = () => {
    const data = useQuery(api.parents.getAllMyChildren)
    const isLoading = data === undefined

    return {
        data,
        isLoading,
    }
}