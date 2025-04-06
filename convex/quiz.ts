import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { asyncMap } from "convex-helpers";

export const create = mutation({
    args:{
        storyId: v.id("stories"),
        questions: v.array(v.object({
            id: v.number(),
            question: v.string(),
            answer: v.string(),
            points: v.number(),
        }))
    },
    handler: async (ctx, args ) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("User not authenticated");
        if (!args.storyId) throw new ConvexError("Story ID is required");
        if (!args.questions) throw new ConvexError("Questions are required");
        if (args.questions.length === 0) throw new ConvexError("At least one question is required");
        if (args.questions.some(q => q.points <= 0 || isNaN(q.points))) throw new ConvexError("Points must be greater than 0");
        if (args.questions.some(q => q.question === "")) throw new ConvexError("Question cannot be empty");
        if (args.questions.some(q => q.answer === "")) throw new ConvexError("Answer cannot be empty");

            await asyncMap(args.questions, async (quiz) =>{
                await ctx.db.insert("quiz", {
                    question: quiz.question,
                    answer: quiz.answer,
                    points: quiz.points,
                    createdBy: userId,
                    storyId: args.storyId,
                })
        })  
    }
})

export const get = query({
    args:{
        storyId: v.id("stories"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("User not authenticated");
        if (!args.storyId) throw new ConvexError("Story ID is required");
        const quiz = await ctx.db.query("quiz")
            .filter(q => q.eq(q.field('storyId'), args.storyId))
            .filter(q => q.eq(q.field('createdBy'), userId))
            .order("desc")
            .collect()

        return quiz
    }
})

export const remove = mutation({
    args:{
        quizId: v.id("quiz"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("User not authenticated");
        if (!args.quizId) throw new ConvexError("Quiz ID is required");
        const quiz = await ctx.db.get(args.quizId)
        if (!quiz) throw new ConvexError("Quiz not found");
        if (quiz.createdBy !== userId) throw new ConvexError("You are not authorized to delete this quiz");

        await ctx.db.delete(args.quizId)
        return { success: true }
    }
});
export const edit = mutation({
    args:{
        quizId: v.id("quiz"),
        question: v.string(),
        answer: v.string(),
        points: v.number(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) throw new ConvexError("User not authenticated");
        if (!args.quizId) throw new ConvexError("Quiz ID is required");
        const quiz = await ctx.db.get(args.quizId)
        if (!quiz) throw new ConvexError("Quiz not found");
        if (quiz.createdBy !== userId) throw new ConvexError("You are not authorized to update this quiz");

        await ctx.db.patch(args.quizId,{
            question: args.question,
            answer: args.answer,
            points: args.points,
        })
        return { success: true }
    }
});
