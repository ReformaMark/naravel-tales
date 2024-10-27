import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export function useEmailCheck(email: string) {
    const checkEmail = useQuery(api.users.checkEmailExists, { email })
    return checkEmail
}
