"use client"

import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { EmptyClassState } from './empty-class-state';
import { ClassModal } from './class-modal';

interface ClassContainerProps {
    children: React.ReactNode;
}

export function ClassContainer({ children }: ClassContainerProps) {
    const user = useQuery(api.users.current);
    
    if (!user?.onboarding) {
        return (
            <>
                <EmptyClassState />
                <ClassModal />
            </>
        );
    }

    return children;
}
