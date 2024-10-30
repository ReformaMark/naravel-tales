import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const list = query({
  handler: async (ctx) => {
    const stories =  await ctx.db.query("stories")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

      return Promise.all(stories.map(async(story)=>{
        return {
          ...story,
          ...(story.imageId === undefined)
          ? ""
          : { url: await ctx.storage.getUrl(story.imageId) },
        }
      }))
  },
});

export const getById = query({
  args: { id: v.id("stories") },
  handler: async (ctx, args) => {
    const story = await ctx.db.get(args.id);

    // If there are sequence cards, fetch URLs for each imageId
    const sequenceCardsWithUrls = await Promise.all(
      (story?.sequenceCards || []).map(async (card) => ({
        ...card,
        url: card.imageId ? await ctx.storage.getUrl(card.imageId) : null,
      }))
    );

    return {
      ...story,
      url: story?.imageId ? await ctx.storage.getUrl(story.imageId) : null,
      sequenceCards: sequenceCardsWithUrls,
    };
  },
});

export const createStory = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    ageGroup: v.union(v.literal("3-4"), v.literal("4-5"), v.literal("5-6")),
    imageId: v.optional(v.string()),
    sequenceCards: v.array(v.object({
        id: v.string(),
        imageId: v.string(),
        description: v.string(),
        order: v.number(),
        level: v.number(),
    })),
    minAge: v.number(),
    maxAge: v.number(),
    readingTime: v.number(), // in minutes
    points: v.number(), // points earned for completion
    tags: v.array(v.string()), // for cultural themes/values
    quizQuestions: v.array(v.object({
        question: v.string(),
        options: v.array(v.string()),
        correctAnswer: v.number(),
        points: v.number()
    })),
    culturalNotes: v.string(),
    isActive: v.boolean(),
      
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("stories", {
      ...args,
      isActive: true,
      createdAt: Date.now(),
      imageId: args.imageId
    });
  },
});


export const addSequenceCards = mutation({
  args: {
    storyId: v.id('stories'),
    id: v.string(),
    description: v.string(),
    imageId: v.string(),
    order: v.number(),
    level: v.number(),
  },
  handler: async (ctx, args) => {
    // Fetch the existing story document to get current sequence cards
    const story = await ctx.db.get(args.storyId);

    // Ensure that the sequenceCards array is initialized
    const sequenceCards = story?.sequenceCards || [];

    // Add the new card to the sequenceCards array
    const newCard = {
      id: args.id,
      description: args.description,
      imageId: args.imageId,
      order: args.order,
      level: args.level,
    };

    // Update the story with the new sequence card appended to the array
    await ctx.db.patch(args.storyId, {
      sequenceCards: [...sequenceCards, newCard],
    });
  },
});

export const removeSequenceCard = mutation({
  args: {
    storyId: v.id("stories"),
    orderToRemove: v.number(),
    level: v.number(),
  },
  handler: async (ctx, { storyId, orderToRemove, level }) => {
    const story = await ctx.db.get(storyId);

    if (!story || !story.sequenceCards) {
      throw new Error("Story or sequence cards not found");
    }

    // Filter out the card to remove and reassign orders for remaining cards in the specified level
    const updatedSequenceCards = story.sequenceCards
      .filter((card) => !(card.level === level && card.order === orderToRemove))
      .map((card) => {
        if (card.level === level && card.order > orderToRemove) {
          return {
            ...card,
            order: card.order - 1,
            id: `card${card.order - 1}-l${level}`,
          };
        }
        return card;
      });

    // Update the story with the modified sequenceCards array
    await ctx.db.patch(storyId, {
      sequenceCards: updatedSequenceCards,
    });

    return { success: true, sequenceCards: updatedSequenceCards };
  },
});