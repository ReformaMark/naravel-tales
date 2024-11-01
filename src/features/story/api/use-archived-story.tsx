
import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'

interface UseAllStoryParams {
    searchQuery?: string;
    page: number;
    limit: number;
}
export  const useArchivedStory = ({ searchQuery, page, limit }: UseAllStoryParams) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const result = useQuery(api.stories.getArchivedtories, {
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