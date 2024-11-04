import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const list = query({
  args: {
    searchQuery: v.optional(v.string()),
    page: v.number(),
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const stories = ctx.db.query("stories")
      .filter((q) => q.eq(q.field("isActive"), true));

    if (args.searchQuery && args.searchQuery.trim()) {
      const search = args.searchQuery.trim()

      const byTitle = await ctx.db
        .query("stories")
        .withSearchIndex("search_title", q => q.search("title", search))
        .collect()

       const storiesWithUrl = await Promise.all(
          (byTitle || []).map(async (story) => ({
            ...story,
            imageUrl: story.imageId ? await ctx.storage.getUrl(story.imageId) : null,
          }))
        );
      const startIndex = (args.page - 1) * args.limit
      const paginatedResults = storiesWithUrl.slice(startIndex, startIndex + args.limit)

      return {
        stories: paginatedResults,
        totalPages: Math.ceil(storiesWithUrl.length / args.limit),
      }
    }

    // if no search query, return all stories with just pagination.
    const allStories = await stories
      .order("desc")
      .collect()

    const storiesWithUrl = await Promise.all(
      (allStories || []).map(async (story) => ({
        ...story,
        imageUrl: story.imageId ? await ctx.storage.getUrl(story.imageId) : null,
      }))
    );
    const startIndex = (args.page - 1) * args.limit
    const paginatedResults = storiesWithUrl.slice(startIndex, startIndex + args.limit)

    return {
      stories: paginatedResults,
      totalPages: Math.ceil(storiesWithUrl.length / args.limit),
    }
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
export const editStory = mutation({
  args: {
    storyId: v.id('stories'),
    title: v.string(),
    content: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    ageGroup: v.union(v.literal("3-4"), v.literal("4-5"), v.literal("5-6")),
    imageId: v.optional(v.string()),
   
    minAge: v.number(),
    maxAge: v.number(),
    readingTime: v.number(), // in minutes
    points: v.number(), // points earned for completion
    tags: v.array(v.string()), // for cultural themes/values
    
    culturalNotes: v.string(),
    isActive: v.boolean(),
  
      
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args.storyId, {
      title: args.title,
      content: args.content,
      difficulty: args.difficulty,
      ageGroup: args.ageGroup,
      minAge: args.minAge,
      maxAge: args.maxAge,
      readingTime: args.readingTime, // in minutes
      points: args.points, // points earned for completion
      tags: args.tags,
      culturalNotes: args.culturalNotes,
      isActive: true,
      createdAt: Date.now(),
      imageId: args.imageId
    });
  },
});


export const addSequenceCards = mutation({
  args: {
    storyId: v.id('stories'),
    description: v.string(),
    imageId: v.string(),
    level: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Fetch the existing story document to get current sequence cards
    const story = await ctx.db.get(args.storyId);

    const storySequenceCardlegth = story?.sequenceCards.filter(card => card.level === args.level).length

    const cardId = `card${storySequenceCardlegth! + 1}-l${args.level}`
    // Ensure that the sequenceCards array is initialized
    const sequenceCards = story?.sequenceCards || [];

    // Add the new card to the sequenceCards array
    const newCard = {
      id: cardId,
      description: args.description,
      imageId: args.imageId,
      order: storySequenceCardlegth! + 1,
      level: args.level,
    };

    // Update the story with the new sequence card appended to the array
    await ctx.db.patch(args.storyId, {
      sequenceCards: [...sequenceCards, newCard],
      isActive: args.isActive
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

export const archiveStories = mutation({
  args:{
    storyId:v.id('stories')
  },
  handler: async(ctx, args)=>{
    
    return await ctx.db.patch(args.storyId, {
      isActive: false
    })
  }
})
export const restoreStory = mutation({
  args:{
    storyId:v.id('stories')
  },
  handler: async(ctx, args)=>{
    
    return await ctx.db.patch(args.storyId, {
      isActive: true
    })
  }
})

export const getArchivedtories = query({
  args: {
    searchQuery: v.optional(v.string()),
    page: v.number(),
    limit: v.number(),
  },
  handler: async(ctx, args) =>{
    const stories = await ctx.db.query('stories')
    .filter(q => q.eq(q.field('isActive'),false));
    
    if (args.searchQuery && args.searchQuery.trim()) {
      const search = args.searchQuery.trim()

      const byTitle = await ctx.db
        .query("stories")
        .withSearchIndex("search_title", q => q.search("title", search))
        .collect()
        const storiesWithUrl = await Promise.all(
          (byTitle || []).map(async (story) => ({
            ...story,
            imageUrl: story.imageId ? await ctx.storage.getUrl(story.imageId) : null,
          }))
        );
      const startIndex = (args.page - 1) * args.limit
      const paginatedResults = storiesWithUrl.slice(startIndex, startIndex + args.limit)

      return {
        stories: paginatedResults,
        totalPages: Math.ceil(storiesWithUrl.length / args.limit),
      }
    }

    // if no search query, return all stories with just pagination.
    const allStories = await stories.order('desc').collect();

    const storiesWithUrl = await Promise.all(
      (allStories || []).map(async (story) => ({
        ...story,
        imageUrl: story.imageId ? await ctx.storage.getUrl(story.imageId) : null,
      }))
    );
    const startIndex = (args.page - 1) * args.limit
    const paginatedResults = storiesWithUrl.slice(startIndex, startIndex + args.limit)

    return {
      stories: paginatedResults,
      totalPages: Math.ceil(storiesWithUrl.length / args.limit),
    }

  }
});