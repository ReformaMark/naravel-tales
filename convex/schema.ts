import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
    ...authTables,
    users: defineTable({
        image: v.optional(v.string()),
        email: v.optional(v.string()),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),
        fname: v.optional(v.string()),
        lname: v.optional(v.string()),
        role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("parent"))),
        address: v.optional(v.string()),
    })
});

export default schema;