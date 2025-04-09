// import { v } from "convex/values";
// import { mutation } from "./_generated/server";
// import { Id } from "./_generated/dataModel";

// export const checkAndAwardAchievements = mutation({
//   args: {
//     studentId: v.id("students"),
//     storyId: v.id("stories"),
//     sequenceScore: v.number(),
//     timeSpent: v.number(),
//     stars: v.number(),
//   },
//   handler: async (ctx, args) => {
//     // Get student's progress history
//     const progressHistory = await ctx.db
//       .query("progress")
//       .withIndex("by_student", q => q.eq("studentId", args.studentId))
//       .collect();

//     const existingAchievements = await ctx.db
//       .query("achievements")
//       .withIndex("by_student", q => q.eq("studentId", args.studentId))
//       .collect();

//     // Check for Sequence Master
//     if (args.sequenceScore === 100 && !existingAchievements.some(a => a.type === "sequence_master")) {
//       await ctx.db.insert("achievements", {
//         studentId: args.studentId,
//         name: "Sequence Master",
//         description: "Completed a sequence perfectly on first attempt",
//         type: "sequence_master",
//         criteria: { requiredScore: 100 },
//         earnedAt: Date.now(),
//         notificationSent: false
//       });
//     }

//     // Check for Quick Learner
//     if (args.sequenceScore >= 90 && args.timeSpent <= 120 && !existingAchievements.some(a => a.type === "quick_learner")) {
//       await ctx.db.insert("achievements", {
//         studentId: args.studentId,
//         name: "Quick Learner",
//         description: "Completed a sequence quickly with high accuracy",
//         type: "quick_learner",
//         criteria: { requiredScore: 90, requiredTime: 120 },
//         earnedAt: Date.now(),
//         notificationSent: false
//       });
//     }

//     // Check for Persistent Reader
//     const completedStories = new Set(progressHistory.map(p => p.storyId.toString())).size;
//     if (completedStories >= 5 && !existingAchievements.some(a => a.type === "persistent_reader")) {
//       await ctx.db.insert("achievements", {
//         studentId: args.studentId,
//         name: "Persistent Reader",
//         description: "Completed 5 different stories",
//         type: "persistent_reader",
//         criteria: { requiredCompletions: 5 },
//         earnedAt: Date.now(),
//         notificationSent: false
//       });
//     }

//     // Check for Story Expert
//     const threeStarStories = progressHistory.filter(p => p.stars === 3).length;
//     if (threeStarStories >= 3 && !existingAchievements.some(a => a.type === "story_expert")) {
//       await ctx.db.insert("achievements", {
//         studentId: args.studentId,
//         name: "Story Expert",
//         description: "Earned 3 stars on 3 different stories",
//         type: "story_expert",
//         criteria: { requiredStars: 3 },
//         earnedAt: Date.now(),
//         notificationSent: false
//       });
//     }

//     // Check for Practice Star
//     const recentProgress = progressHistory
//       .sort((a, b) => b.lastPlayed - a.lastPlayed)
//       .slice(0, 5);

//     const hasConsecutiveDays = recentProgress.length === 5 && 
//       recentProgress.every((p, i) => {
//         if (i === 0) return true;
//         const prevDay = new Date(recentProgress[i-1].lastPlayed).getDate();
//         const currentDay = new Date(p.lastPlayed).getDate();
//         return prevDay - currentDay === 1;
//       });

//     if (hasConsecutiveDays && !existingAchievements.some(a => a.type === "practice_star")) {
//       await ctx.db.insert("achievements", {
//         studentId: args.studentId,
//         name: "Practice Star",
//         description: "Completed stories for 5 consecutive days",
//         type: "practice_star",
//         criteria: { requiredCompletions: 5 },
//         earnedAt: Date.now(),
//         notificationSent: false
//       });
//     }
//   },
// });

import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Individual achievements handler
export const checkAndAwardAchievements = mutation({
  args: {
    studentId: v.id("students"),
    storyId: v.id("stories"),
    sequenceScore: v.number(),
    timeSpent: v.number(),
    stars: v.number(),
  },
  handler: async (ctx, args) => {
    // ... existing individual achievement checks ...
    const progressHistory = await ctx.db
      .query("progress")
      .withIndex("by_student", q => q.eq("studentId", args.studentId))
      .collect();

    const existingAchievements = await ctx.db
      .query("achievements")
      .withIndex("by_student", q => q.eq("studentId", args.studentId))
      .collect();

    // Existing achievement checks remain the same
    await checkSequenceMaster(ctx, args, existingAchievements);
    await checkQuickLearner(ctx, args, existingAchievements);
    await checkPersistentReader(ctx, args, progressHistory, existingAchievements);
    await checkStoryExpert(ctx, progressHistory, existingAchievements, args);
    await checkPracticeStar(ctx, progressHistory, existingAchievements, args);
  },
});

// New group achievements handler
export const checkAndAwardGroupAchievements = mutation({
  args: {
    groupMembers: v.array(v.object({
      studentId: v.id("students"),
      name: v.string()
    })),
    storyId: v.id("stories"),
    sequenceScore: v.number(),
    timeSpent: v.number(),
    stars: v.number(),
  },
  handler: async (ctx, args) => {
    // Award team achievements to all group members
    await Promise.all(
      args.groupMembers.map(async (member) => {
        // Check if member already has the Team Player achievement
        const existingTeamAchievement = await ctx.db
          .query("achievements")
          .withIndex("by_student", q => q.eq("studentId", member.studentId))
          .filter(q => q.eq(q.field("type"), "team_player"))
          .first();

        if (!existingTeamAchievement) {
          // Award Team Player achievement
          await ctx.db.insert("achievements", {
            studentId: member.studentId,
            name: "Team Player",
            description: "Completed a story in group mode",
            type: "team_player",
            criteria: { requiredCompletions: 1 },
            earnedAt: Date.now(),
            notificationSent: false
          });
        }

        // Check if perfect score in group mode
        if (args.sequenceScore === 100) {
          const existingGroupMaster = await ctx.db
            .query("achievements")
            .withIndex("by_student", q => q.eq("studentId", member.studentId))
            .filter(q => q.eq(q.field("type"), "group_master"))
            .first();

          if (!existingGroupMaster) {
            await ctx.db.insert("achievements", {
              studentId: member.studentId,
              name: "Group Master",
              description: "Achieved perfect score in group mode",
              type: "group_master",
              criteria: { requiredScore: 100 },
              earnedAt: Date.now(),
              notificationSent: false
            });
          }
        }

        // Get progress history for the member
        const progressHistory = await ctx.db
          .query("progress")
          .withIndex("by_student", q => q.eq("studentId", member.studentId))
          .collect();

        const existingAchievements = await ctx.db
          .query("achievements")
          .withIndex("by_student", q => q.eq("studentId", member.studentId))
          .collect();

        // Check individual achievements directly
        await checkSequenceMaster(ctx, {
          ...args,
          studentId: member.studentId
        }, existingAchievements);

        await checkQuickLearner(ctx, {
          ...args,
          studentId: member.studentId
        }, existingAchievements);

        await checkPersistentReader(ctx, {
          ...args,
          studentId: member.studentId
        }, progressHistory, existingAchievements);

        await checkStoryExpert(ctx,
          progressHistory,
          existingAchievements,
          { ...args, studentId: member.studentId }
        );

        await checkPracticeStar(ctx,
          progressHistory,
          existingAchievements,
          { ...args, studentId: member.studentId }
        );
      })
    );
  },
});

// Helper functions for individual achievements
async function checkSequenceMaster(ctx: any, args: any, existingAchievements: any[]) {
  if (args.sequenceScore === 100 && !existingAchievements.some(a => a.type === "sequence_master")) {
    await ctx.db.insert("achievements", {
      studentId: args.studentId,
      name: "Sequence Master",
      description: "Completed a sequence perfectly on first attempt",
      type: "sequence_master",
      criteria: { requiredScore: 100 },
      earnedAt: Date.now(),
      notificationSent: false
    });
  }
}

async function checkQuickLearner(ctx: any, args: any, existingAchievements: any[]) {
  if (args.sequenceScore >= 90 && args.timeSpent <= 120 && !existingAchievements.some(a => a.type === "quick_learner")) {
    await ctx.db.insert("achievements", {
      studentId: args.studentId,
      name: "Quick Learner",
      description: "Completed a sequence quickly with high accuracy",
      type: "quick_learner",
      criteria: { requiredScore: 90, requiredTime: 120 },
      earnedAt: Date.now(),
      notificationSent: false
    });
  }
}

async function checkPersistentReader(ctx: any, args: any, progressHistory: any[], existingAchievements: any[]) {
  const completedStories = new Set(progressHistory.map(p => p.storyId.toString())).size;
  if (completedStories >= 5 && !existingAchievements.some(a => a.type === "persistent_reader")) {
    await ctx.db.insert("achievements", {
      studentId: args.studentId,
      name: "Persistent Reader",
      description: "Completed 5 different stories",
      type: "persistent_reader",
      criteria: { requiredCompletions: 5 },
      earnedAt: Date.now(),
      notificationSent: false
    });
  }
}

async function checkStoryExpert(ctx: any, progressHistory: any[], existingAchievements: any[], args: any) {
  const threeStarStories = progressHistory.filter(p => p.stars === 3).length;
  if (threeStarStories >= 3 && !existingAchievements.some(a => a.type === "story_expert")) {
    await ctx.db.insert("achievements", {
      studentId: args.studentId,
      name: "Story Expert",
      description: "Earned 3 stars on 3 different stories",
      type: "story_expert",
      criteria: { requiredStars: 3 },
      earnedAt: Date.now(),
      notificationSent: false
    });
  }
}

async function checkPracticeStar(ctx: any, progressHistory: any[], existingAchievements: any[], args: any) {
  const recentProgress = progressHistory
    .sort((a, b) => b.lastPlayed - a.lastPlayed)
    .slice(0, 5);

  const hasConsecutiveDays = recentProgress.length === 5 &&
    recentProgress.every((p, i) => {
      if (i === 0) return true;
      const prevDay = new Date(recentProgress[i - 1].lastPlayed).getDate();
      const currentDay = new Date(p.lastPlayed).getDate();
      return prevDay - currentDay === 1;
    });

  if (hasConsecutiveDays && !existingAchievements.some(a => a.type === "practice_star")) {
    await ctx.db.insert("achievements", {
      studentId: args.studentId,
      name: "Practice Star",
      description: "Completed stories for 5 consecutive days",
      type: "practice_star",
      criteria: { requiredCompletions: 5 },
      earnedAt: Date.now(),
      notificationSent: false
    });
  }
}