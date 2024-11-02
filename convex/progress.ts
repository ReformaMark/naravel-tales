import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const updateProgress = mutation({
    args: {
        studentId: v.id("students"),
        storyId: v.id("stories"),
        completed: v.boolean(),
        sequenceAttempts: v.number(),
        sequenceScore: v.number(),
        timeSpent: v.number(),
        teacherNotes: v.optional(v.string()),
        stars: v.number(),
    },
    async handler(ctx, args) {
        const existingProgress = await ctx.db
            .query("progress")
            .withIndex("by_student", (q) =>
                q.eq("studentId", args.studentId)
            )
            .filter((q) =>
                q.eq(q.field("storyId"), args.storyId)
            )
            .first();


        await updateGamificationStats(ctx, args);

        if (existingProgress) {
            return await ctx.db.patch(existingProgress._id, {
                completed: args.completed,
                sequenceAttempts: args.sequenceAttempts,
                sequenceScore: args.sequenceScore,
                timeSpent: args.timeSpent,
                teacherNotes: args.teacherNotes,
                stars: args.stars,
                lastPlayed: Date.now(),
            });
        }

        const score = Math.max(0, Math.min(100, args.sequenceScore));

        const progress = await ctx.db.insert("progress", {
            studentId: args.studentId,
            storyId: args.storyId,
            completed: args.completed,
            sequenceAttempts: args.sequenceAttempts,
            sequenceScore: score,
            timeSpent: args.timeSpent,
            teacherNotes: args.teacherNotes,
            stars: args.stars,
            lastPlayed: Date.now(),
        });

        return progress;
    },
});

// Helper functions to update gamification stats
async function updateGamificationStats(
    ctx: any,
    args: {
        studentId: Id<"students">;
        completed: boolean;
        sequenceScore: number;
        stars: number;
    }
) {
    const stats = await ctx.db
        .query("gamificationStats")
        .withIndex("by_student", (q: any) =>
            q.eq("studentId", args.studentId)
        )
        .first();

    const points = calculatePoints(args.sequenceScore, args.stars);

    if (stats) {
        await ctx.db.patch(stats._id, {
            totalPoints: stats.totalPoints + points,
            weeklyPoints: stats.weeklyPoints + points,
            monthlyPoints: stats.monthlyPoints + points,
            storiesCompleted: args.completed
                ? stats.storiesCompleted + 1
                : stats.storiesCompleted,
            totalStarsEarned: stats.totalStarsEarned + args.stars,
            averageAccuracy: calculateNewAverage(
                stats.averageAccuracy,
                args.sequenceScore,
                stats.storiesCompleted
            ),
            lastUpdated: Date.now(),
        });
    } else {
        await ctx.db.insert("gamificationStats", {
            studentId: args.studentId,
            totalPoints: points,
            level: 1,
            currentExp: points,
            nextLevelExp: 1000,
            storiesCompleted: args.completed ? 1 : 0,
            totalStarsEarned: args.stars,
            averageAccuracy: args.sequenceScore,
            weeklyPoints: points,
            monthlyPoints: points,
            weekStartDate: getWeekStartDate(),
            monthStartDate: getMonthStartDate(),
            lastUpdated: Date.now(),
        });
    }
}

// Helper functions for calculations
function calculatePoints(sequenceScore: number, stars: number): number {
    const basePoints = sequenceScore;
    const starBonus = stars * 50;
    return basePoints + starBonus;
}

function calculateNewAverage(
    currentAverage: number,
    newScore: number,
    totalStories: number
): number {
    return Math.round(
        (currentAverage * totalStories + newScore) / (totalStories + 1)
    );
}

function getWeekStartDate(): number {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek.getTime();
}

function getMonthStartDate(): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
}

export const getByStory = query({
    args: {
        storyId: v.id("stories"),
        studentIds: v.array(v.id("students")),
    },
    handler: async (ctx, args) => {
        if (args.studentIds.length === 0) {
            return [];
        }

        const progress = await ctx.db
            .query("progress")
            .withIndex("by_story", (q) => q.eq("storyId", args.storyId))
            .filter((q) =>
                q.or(
                    ...args.studentIds.map(studentId =>
                        q.eq(q.field("studentId"), studentId)
                    )
                )
            )
            .collect();

        const gamificationStats = await ctx.db
            .query("gamificationStats")
            .withIndex("by_student")
            .filter((q) =>
                q.or(
                    ...args.studentIds.map(studentId =>
                        q.eq(q.field("studentId"), studentId)
                    )
                )
            )
            .collect();

        return progress.map(p => {
            const stats = gamificationStats.find(
                g => g.studentId === p.studentId
            );

            return {
                ...p,
                totalPoints: stats?.totalPoints ?? 0,
                level: stats?.level ?? 1,
                averageAccuracy: stats?.averageAccuracy ?? 0,
            };
        });
    },
});

export const getStudentProgress = query({
    args: {
        storyId: v.id("stories"),
        studentId: v.id("students"),
    },
    handler: async (ctx, args) => {
        const progress = await ctx.db
            .query("progress")
            .withIndex("by_story", (q) => q.eq("storyId", args.storyId))
            .filter((q) => q.eq(q.field("studentId"), args.studentId))
            .first();

        if (!progress) {
            return null;
        }

        // Get gamification stats
        const stats = await ctx.db
            .query("gamificationStats")
            .withIndex("by_student")
            .filter((q) => q.eq(q.field("studentId"), args.studentId))
            .first();

        return {
            ...progress,
            totalPoints: stats?.totalPoints ?? 0,
            level: stats?.level ?? 1,
            averageAccuracy: stats?.averageAccuracy ?? 0,
        };
    },
});

export const addTeacherNote = mutation({
    args: {
        progressId: v.id("progress"),
        note: v.string(),
    },
    handler: async (ctx, { progressId, note }) => {
        const progress = await ctx.db.get(progressId);
        if (!progress) {
            throw new Error("Progress entry not found");
        }

        await ctx.db.patch(progressId, {
            teacherNotes: note
        });
    }
});