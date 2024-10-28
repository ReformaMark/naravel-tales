import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export const useAllClass = () => {
    const data = useQuery(api.classes.getClasses)
    const isLoading = data === undefined

    return { data, isLoading }
}