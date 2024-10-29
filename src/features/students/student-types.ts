import { Id } from "../../../convex/_generated/dataModel";

export interface Student {
    _id: Id<"students">;
    _creationTime: number;
    classId: Id<"classes">;
    parentId?: Id<"users">;
    fname: string;
    lname: string;
    createdAt: number;
    studentCode?: string;
}

export interface StudentCode {
    _id: Id<"studentCodes">;
    _creationTime: number;
    studentId: Id<"students">;
    code: string;
    isActive: boolean;
    createdAt: number;
    expiresAt?: number;
    claimedBy?: Id<"users">;
    claimedAt?: number;
}

export interface StudentProgress {
    _id: Id<"progress">;
    _creationTime: number;
    studentId: Id<"students">;
    storyId: Id<"stories">;
    completed: boolean;
    lastPlayed: number;
    sequenceAttempts: number;
    sequenceScore: number;
    timeSpent: number;
    teacherNotes?: string;
    stars: number;
}

export interface StudentAchievement {
    _id: Id<"achievements">;
    _creationTime: number;
    studentId: Id<"students">;
    name: string;
    description: string;
    type: "sequence_master" | "quick_learner" | "persistent_reader" | "story_expert" | "practice_star";
    criteria: {
        requiredScore?: number;
        requiredTime?: number;
        requiredCompletions?: number;
        requiredStars?: number;
    };
    imageUrl: string;
    earnedAt: number;
    notificationSent: boolean;
}

export interface StudentReward {
    _id: Id<"rewards">;
    _creationTime: number;
    studentId: Id<"students">;
    type: "story_completion" | "achievement_unlock" | "practice_streak" | "perfect_score";
    points: number;
    earnedAt: number;
    isRedeemed: boolean;
    redeemedAt?: number;
    acknowledgedBy: Array<{
        userId: Id<"users">;
        role: "teacher" | "parent";
        timestamp: number;
    }>;
}

export interface StudentGamificationStats {
    _id: Id<"gamificationStats">;
    _creationTime: number;
    studentId: Id<"students">;
    totalPoints: number;
    level: number;
    currentExp: number;
    nextLevelExp: number;
    storiesCompleted: number;
    totalStarsEarned: number;
    averageAccuracy: number;
    weeklyPoints: number;
    monthlyPoints: number;
    weekStartDate: number;
    monthStartDate: number;
    lastUpdated: number;
}