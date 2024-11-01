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

export const getChildWithStats = query({
    args: {
        studentId: v.id("students")
    },
    handler: async (ctx, { studentId }) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Unauthorized");
        }

        // Get the student
        const student = await ctx.db.get(studentId);
        if (!student) {
            throw new ConvexError("Student not found");
        }

        // Verify this parent has access to this student
        if (student.parentId !== userId) {
            throw new ConvexError("Unauthorized access to student information");
        }

        // Get related data
        const stats = await ctx.db
            .query("gamificationStats")
            .withIndex("by_student", q => q.eq("studentId", studentId))
            .first();

        const achievements = await ctx.db
            .query("achievements")
            .withIndex("by_student", q => q.eq("studentId", studentId))
            .collect();

        // Return combined data
        return {
            student,
            stats,
            achievements,
        };
    }
});
export const getAllParent = query({
    handler: async(ctx)=>{
        const parents = await ctx.db.query("users").filter(q=>q.eq(q.field('role'), "parent")).collect();

        return parents
    }
})