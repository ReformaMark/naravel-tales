import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"

export const useRoleCheck = () => {
    const data = useQuery(api.users.role)
    const isLoading = data === undefined

    return { data, isLoading }
}