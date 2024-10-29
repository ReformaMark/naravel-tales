import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseMyStudentsProps {
    classId: Id<"classes">;
    searchQuery?: string;
    page: number;
    limit: number;
}

export function useMyStudents({ classId, searchQuery = "", page, limit }: UseMyStudentsProps) {
    return useQuery(api.students.getMyStudents, {
        classId,
        searchQuery,
        page,
        limit
    });
}