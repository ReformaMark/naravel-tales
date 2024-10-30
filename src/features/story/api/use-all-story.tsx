import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

interface UseAllStoryParams {
    searchQuery?: string;
    page: number;
    limit: number;
}

export const useAllStory = ({ searchQuery, page, limit }: UseAllStoryParams) => {
    const result = useQuery(api.stories.list, {
        searchQuery,
        page,
        limit
    });

    return {
        data: result?.stories ?? [],
        totalPages: result?.totalPages ?? 0,
        isLoading: result === undefined
    }
}