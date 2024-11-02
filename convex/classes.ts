import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

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