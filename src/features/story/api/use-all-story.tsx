import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export const useAllStory = () => {
    const data = useQuery(api.stories.list)
    const isLoading = data === undefined

    return { data, isLoading }
}