"use client"
import { LoaderComponent } from '@/components/loader';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRoleCheck } from '../api/use-role-check';

interface RoleCheckProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export function RoleCheck({ children, allowedRoles }: RoleCheckProps) {
    const { data: role, isLoading } = useRoleCheck();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!role) {
                // Redirect to home if not logged in
                router.push('/');
            } else if (!allowedRoles.includes(role)) {
                // Redirect to the respective page based on role
                switch (role) {
                    case 'teacher':
                        router.push('/teachers');
                        break;
                    case 'parent':
                        router.push('/parent');
                        break;
                    case 'admin':
                        router.push('/admin');
                        break;
                    default:
                        router.push('/');
                }
            }
        }
    }, [role, isLoading, allowedRoles, router]);

    if (isLoading) {
        return <LoaderComponent />;
    }

    if (!role || !allowedRoles.includes(role)) {
        return null;
    }

    return <>{children}</>;
}
