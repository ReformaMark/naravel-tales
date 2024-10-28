// note: this only returns fname, lname, email and image / avatar proceed to api if want to modify

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export const useCurrentUser = () => {
    const data = useQuery(api.users.current)
    const isLoading = data === undefined
    return {
        data,
        isLoading
    }
}