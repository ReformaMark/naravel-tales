import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const current = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)

        if (!userId) return null

        return await ctx.db.get(userId)
    }
})

export const role = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx)

        if (!userId) return null

        const user = await ctx.db.get(userId)

        if (!user) return null

        return user.role
    }
})

export const checkEmailExists = query({
    args: { email: v.string() },
    handler: async (ctx, { email }) => {
        const existingUser = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), email))
            .first();
        
        return !!existingUser;
    }
});