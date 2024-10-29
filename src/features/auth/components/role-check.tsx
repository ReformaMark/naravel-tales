"use client"
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useCachedRole } from '../api/use-cached-role';

interface RoleCheckProps {
    allowedRoles: string[];
}

export function RoleCheck({ allowedRoles }: RoleCheckProps) {
    const { role, isLoading } = useCachedRole();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!role) {
                router.replace('/');
            } else if (!allowedRoles.includes(role)) {
                switch (role) {
                    case 'teacher':
                        router.replace('/teachers');
                        break;
                    case 'parent':
                        router.replace('/parent');
                        break;
                    case 'admin':
                        router.replace('/admin');
                        break;
                    default:
                        router.replace('/');
                }
            }
        }
    }, [role, isLoading, allowedRoles, router]);

    // if (isLoading) {
    //     return <LoaderComponent />;
    // }

    return null;
}