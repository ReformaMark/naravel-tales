import { mutation } from "./_generated/server";
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
