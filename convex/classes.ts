import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc } from "./_generated/dataModel";

export const create = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, { name }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const user = await ctx.db.get(userId);
        if (!user || user.role !== "teacher") throw new Error("Unauthorized");

        const classId = await ctx.db.insert("classes", {
            name,
            teacherId: userId,
            createdAt: Date.now(),
        });


        await ctx.db.patch(userId, {
            onboarding: true,
        });

        return classId;
    },
});

export const getClasses = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const classes = await ctx.db
            .query("classes")
            .filter((q) => q.eq(q.field("teacherId"), userId))
            .collect();

        return classes.map((c) => ({
            name: c.name,
            _id: c._id,
        }));
    }
})

export const getCurrentClass = query({
    args: {
        classId: v.id("classes"),
    },
    handler: async (ctx, { classId }) => {
        const currentClass = await ctx.db.get(classId)
        return currentClass
    }
})

export const getStudentsByClass = query({
    args: {
        classId: v.id("classes"),
    },
    handler: async (ctx, { classId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const currentClass = await ctx.db.get(classId);
        if (!currentClass || currentClass.teacherId !== userId) {
            throw new Error("Unauthorized");
        }

        const students = await ctx.db
            .query("students")
            .withIndex("by_class", q => q.eq("classId", classId))
            .collect();

        return students;
    }
});

export const getClassAchievements = query({
    args: {
        classId: v.id("classes")
    },
    handler: async (ctx, { classId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const currentClass = await ctx.db.get(classId);
        if (!currentClass || currentClass.teacherId !== userId) {
            throw new Error("Unauthorized");
        }

        const students = await ctx.db
            .query("students")
            .withIndex("by_class", q => q.eq("classId", classId))
            .collect();

        const achievements = await Promise.all(
            students.map(async (student) => {
                return await ctx.db
                    .query("achievements")
                    .withIndex("by_student", q => q.eq("studentId", student._id))
                    .collect();
            })
        );

        return achievements.flat();
    }
});

export const getClassProgress = query({
    args: {
        classId: v.id("classes")
    },
    handler: async (ctx, { classId }) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return []

        const currentClass = await ctx.db.get(classId)
        if (!currentClass || currentClass.teacherId !== userId) return []

        const students = await ctx.db
            .query("students")
            .withIndex("by_class", q => q.eq("classId", classId))
            .collect();

        const progressEntries = await Promise.all(
            students.map(async (student) => {
                const progress = await ctx.db
                    .query("progress")
                    .withIndex("by_student", q => q.eq("studentId", student._id))
                    .collect();

                const latestProgress = progress.reduce((latest, current) => {
                    return !latest || current.lastPlayed > latest.lastPlayed ? current : latest;
                }, null as Doc<"progress"> | null);

                return {
                    studentId: student._id,
                    progress: calculateOverallProgress(progress),
                    lastPlayed: latestProgress?.lastPlayed || 0
                };
            })
        )

        return progressEntries;
    }
})

export const getClassStats = query({
    args: {
        classId: v.id("classes")
    },
    handler: async (ctx, { classId }) => {
        const userId = await getAuthUserId(ctx)
        if (!userId) return []

        const currentClass = await ctx.db.get(classId)
        if (!currentClass || currentClass.teacherId !== userId) return []

        const students = await ctx.db
            .query("students")
            .withIndex("by_class", q => q.eq("classId", classId))
            .collect();

        const achievements = await ctx.db
            .query("achievements")
            .filter(q => {
                const studentIds = students.map(s => s._id);
                return studentIds.some(id => q.eq(q.field("studentId"), id));
            })
            .collect();

        const progress = await ctx.db
            .query("progress")
            .filter(q => {
                const studentIds = students.map(s => s._id);
                return studentIds.some(id => q.eq(q.field("studentId"), id));
            })
            .collect();

        return {
            totalStudents: students.length,
            activeStudents: progress.filter(p => p.lastPlayed > Date.now() - 7 * 24 * 60 * 60 * 1000).length,
            totalAchievements: achievements.length,
            averageProgress: Math.round(progress.reduce((acc, p) => acc + p.stars, 0) / progress.length)
        }
    }
})

function calculateOverallProgress(progressEntries: Doc<"progress">[]) {
    if (progressEntries.length === 0) return 0;

    const totalStars = progressEntries.reduce((sum, entry) => {
        return sum + (entry.stars || 0);
    }, 0);

    return Math.round(totalStars / progressEntries.length);
}