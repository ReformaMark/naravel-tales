import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getAllMyChildren = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)

        if (!userId) throw new ConvexError("Unauthorized")

        const user = await ctx.db.get(userId);

        if (!user || user.role !== "parent") {
            throw new ConvexError("Only parents can access this information");
        }

        const myChildren = await ctx.db
            .query("students")
            .filter(q => q.eq(q.field("parentId"), userId))
            .collect()

        return myChildren
    }
})

export const getChildDashboardOverview = query({
    args: {
        studentId: v.id("students")
    },
    handler: async (ctx, { studentId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        const student = await ctx.db.get(studentId);
        if (!student || student.parentId !== userId) {
            throw new ConvexError("Unauthorized access");
        }

        const stats = await ctx.db
            .query("gamificationStats")
            .withIndex("by_student", q => q.eq("studentId", studentId))
            .first()

        const recentProgress = await ctx.db
            .query("progress")
            .withIndex("by_student", q => q.eq("studentId", studentId))
            .order("desc")
            .take(5)

        const recentAchievements = await ctx.db
            .query("achievements")
            .withIndex("by_student", q => q.eq("studentId", studentId))
            .order("desc")
            .take(3);

        return {
            stats,
            recentProgress,
            recentAchievements
        };
    }
})

export const getAllParent = query({
    handler: async (ctx) => {
        const parents = await ctx.db.query("users").filter(q => q.eq(q.field('role'), "parent")).collect();

        return parents
    }
})

export const getChildRecentActivities = query({
    args: {
        studentId: v.id("students")
    },
    handler: async (ctx, { studentId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        const student = await ctx.db.get(studentId);
        if (!student || student.parentId !== userId) {
            throw new ConvexError("Unauthorized access");
        }

        const recentProgress = await ctx.db
            .query("progress")
            .withIndex("by_student", q => q.eq("studentId", studentId))
            .order("desc")
            .take(10)

        const storyIds = Array.from(
            new Set(recentProgress.map(p => p.storyId))
        )

        const stories = await Promise.all(
            storyIds.map(id => ctx.db.get(id))
        )

        const progressWithStories = recentProgress.map((progress) => ({
            ...progress,
            story: stories.find(s => s?._id === progress.storyId)
        }))

        return {
            recentProgress: progressWithStories
        }
    }
})

export const getChildLearningProgress = query({
    args: {
        studentId: v.id("students")
    },
    handler: async (ctx, { studentId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("Unauthorized");

        const student = await ctx.db.get(studentId);
        if (!student || student.parentId !== userId) {
            throw new ConvexError("Unauthorized access");
        }

        const progressEntries = await ctx.db
            .query("progress")
            .withIndex("by_student", q => q.eq("studentId", studentId))
            .collect()

        const storyIds = Array.from(
            new Set(progressEntries.map(p => p.storyId))
        )

        const stories = await Promise.all(
            storyIds.map(id => ctx.db.get(id))
        )

        const stats = await ctx.db
            .query("gamificationStats")
            .withIndex("by_student", q => q.eq("studentId", studentId))
            .first()

        const difficultyProgress = {
            easy: progressEntries.filter(p =>
                stories.find(s => s?._id === p.storyId)?.difficulty === "easy"
            ),
            medium: progressEntries.filter(p =>
                stories.find(s => s?._id === p.storyId)?.difficulty === "medium"
            ),
            hard: progressEntries.filter(p =>
                stories.find(s => s?._id === p.storyId)?.difficulty === "hard"
            )
        }

        return {
            stats,
            progressEntries: progressEntries.map(progress => ({
                ...progress,
                story: stories.find(s => s?._id === progress.storyId)
            })),
            difficultyProgress,
        }
    }
})
