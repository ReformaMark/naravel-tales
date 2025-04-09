import { Id } from "../../convex/_generated/dataModel";

export interface GroupMember {
    studentId: Id<"students">;
    name: string;
}

export interface Group {
    id: string;
    name: string;
    members: GroupMember[];
}