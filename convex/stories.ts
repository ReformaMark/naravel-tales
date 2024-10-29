import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
    page: v.number(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    let stories = ctx.db.query("stories")
      .filter((q) => q.eq(q.field("isActive"), true));

    if (args.searchQuery && args.searchQuery.trim()) {
      const search = args.searchQuery.trim()

      const byTitle = await ctx.db
        .query("stories")
        .withSearchIndex("search_title", q => q.search("title", search))
        .collect()

      const startIndex = (args.page - 1) * args.limit
      const paginatedResults = byTitle.slice(startIndex, startIndex + args.limit)

      return {
        stories: paginatedResults,
        totalPages: Math.ceil(byTitle.length / args.limit),
      }
    }

    // if no search query, return all stories with just pagination.
    const allStories = await stories
      .order("desc")
      .collect()

    const startIndex = (args.page - 1) * args.limit
    const paginatedResults = allStories.slice(startIndex, startIndex + args.limit)

    return {
      stories: paginatedResults,
      totalPages: Math.ceil(allStories.length / args.limit),
    }
  },
});

export const getById = query({
  args: { id: v.id("stories") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const createStory = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    ageGroup: v.union(v.literal("3-4"), v.literal("4-5"), v.literal("5-6")),
    imageUrl: v.string(),
    // Level 1: 3 cards, Level 2: 4 cards, Level 3: 5 cards
    sequenceCards: v.array(v.object({
      id: v.string(),
      imageUrl: v.string(),
      description: v.string(),
      order: v.number(),
      level: v.number(), // 1, 2, or 3
    })),
    culturalNotes: v.string(),
    points: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("stories", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
      minAge: 3,
      maxAge: 6,
      readingTime: 5,
      tags: [],
      quizQuestions: [],
    });
  },
});