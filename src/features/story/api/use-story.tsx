import { useQuery } from 'convex/react'

import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'

export const useeStory = ({storyId}:{
    storyId: Id<'stories'>
}) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const data = useQuery(api.stories.getById, {id: storyId})
    const isLoading = data === undefined

    return { data, isLoading }
}