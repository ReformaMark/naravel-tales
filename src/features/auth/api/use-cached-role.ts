import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useEffect } from "react";
import { useAtom } from 'jotai';
import { roleAtom, roleLoadingAtom } from "../roleAtom";


export function useCachedRole() {
    const [cachedRole, setCachedRole] = useAtom(roleAtom);
    const [isLoading, setIsLoading] = useAtom(roleLoadingAtom);
    const role = useQuery(api.users.role);

    useEffect(() => {
        if (role && !cachedRole) {
            setCachedRole(role);
            setIsLoading(false);
        }
    }, [role, cachedRole, setCachedRole, setIsLoading]);

    return {
        role: cachedRole,
        isLoading
    };
}