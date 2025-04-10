import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// export const updateProgress = mutation({
//     args: {
//         studentId: v.optional(v.id("students")),
//         groupId: v.optional(v.string()),
//         groupMembers: v.optional(v.array(v.object({
//             studentId: v.id("students"),
//             name: v.string()
//         }))),
//         storyId: v.id("stories"),
//         completed: v.boolean(),
//         sequenceAttempts: v.number(),
//         sequenceScore: v.number(),
//         timeSpent: v.number(),
//         teacherNotes: v.optional(v.string()),
//         stars: v.number(),
//     },
//     async handler(ctx, args) {
//         // Handle individual progress
//         if (args.studentId) {
//             const existingProgress = await ctx.db
//                 .query("progress")
//                 .withIndex("by_student", (q) =>
//                     q.eq("studentId", args.studentId)
//                 )
//                 .filter((q) =>
//                     q.eq(q.field("storyId"), args.storyId)
//                 )
//                 .first();

//             if (existingProgress) {
//                 return await ctx.db.patch(existingProgress._id, {
//                     completed: args.completed,
//                     sequenceAttempts: args.sequenceAttempts,
//                     sequenceScore: args.sequenceScore,
//                     timeSpent: args.timeSpent,
//                     teacherNotes: args.teacherNotes,
//                     stars: args.stars,
//                     lastPlayed: Date.now(),
//                 });
//             }

//             return await ctx.db.insert("progress", {
//                 studentId: args.studentId,
//                 storyId: args.storyId,
//                 completed: args.completed,
//                 sequenceAttempts: args.sequenceAttempts,
//                 sequenceScore: args.sequenceScore,
//                 timeSpent: args.timeSpent,
//                 teacherNotes: args.teacherNotes,
//                 stars: args.stars,
//                 lastPlayed: Date.now(),
//             });
//         }

//         // Handle group progress
//         if (args.groupId && args.groupMembers) {
//             const existingProgress = await ctx.db
//                 .query("progress")
//                 .withIndex("by_group", (q) =>
//                     q.eq("groupId", args.groupId)
//                 )
//                 .filter((q) =>
//                     q.eq(q.field("storyId"), args.storyId)
//                 )
//                 .first();

//             if (existingProgress) {
//                 return await ctx.db.patch(existingProgress._id, {
//                     completed: args.completed,
//                     sequenceAttempts: args.sequenceAttempts,
//                     sequenceScore: args.sequenceScore,
//                     timeSpent: args.timeSpent,
//                     teacherNotes: args.teacherNotes,
//                     stars: args.stars,
//                     lastPlayed: Date.now(),
//                 });
//             }

//             return await ctx.db.insert("progress", {
//                 groupId: args.groupId,
//                 groupMembers: args.groupMembers,
//                 storyId: args.storyId,
//                 completed: args.completed,
//                 sequenceAttempts: args.sequenceAttempts,
//                 sequenceScore: args.sequenceScore,
//                 timeSpent: args.timeSpent,
//                 teacherNotes: args.teacherNotes,
//                 stars: args.stars,
//                 lastPlayed: Date.now(),
//             });
//         }
//     },
// });

// export const updateProgress = mutation({
//     args: {
//         studentId: v.optional(v.id("students")),
//         groupId: v.optional(v.string()),
//         groupMembers: v.optional(v.array(v.object({
//             studentId: v.id("students"),
//             name: v.string()
//         }))),
//         storyId: v.id("stories"),
//         completed: v.boolean(),
//         sequenceAttempts: v.number(),
//         sequenceScore: v.number(),
//         timeSpent: v.number(),
//         teacherNotes: v.optional(v.string()),
//         stars: v.number(),
//     },
//     async handler(ctx, args) {
//         if (args.groupId && args.groupMembers) {
//             // First create/update group progress
//             const groupProgress = await handleGroupProgress(ctx, args);

//             // Then create/update individual progress for each member
//             await Promise.all(
//                 args.groupMembers.map(async (member) => {
//                     const existingProgress = await ctx.db
//                         .query("progress")
//                         .withIndex("by_student", (q) =>
//                             q.eq("studentId", member.studentId)
//                         )
//                         .filter((q) =>
//                             q.eq(q.field("storyId"), args.storyId)
//                         )
//                         .first();

//                     if (existingProgress) {
//                         await ctx.db.patch(existingProgress._id, {
//                             completed: args.completed,
//                             sequenceAttempts: args.sequenceAttempts,
//                             sequenceScore: args.sequenceScore,
//                             timeSpent: args.timeSpent,
//                             stars: args.stars,
//                             lastPlayed: Date.now(),
//                             groupId: args.groupId, // Link to group progress
//                         });
//                     } else {
//                         await ctx.db.insert("progress", {
//                             studentId: member.studentId,
//                             storyId: args.storyId,
//                             completed: args.completed,
//                             sequenceAttempts: args.sequenceAttempts,
//                             sequenceScore: args.sequenceScore,
//                             timeSpent: args.timeSpent,
//                             stars: args.stars,
//                             lastPlayed: Date.now(),
//                             groupId: args.groupId, // Link to group progress
//                         });
//                     }

//                     // Update gamification stats for each student
//                     await updateGamificationStats(ctx, {
//                         studentId: member.studentId,
//                         completed: args.completed,
//                         sequenceScore: args.sequenceScore,
//                         stars: args.stars,
//                     });
//                 })
//             );

//             return groupProgress;
//         } else if (args.studentId) {
//             // Handle individual progress as before
//             return await handleIndividualProgress(ctx, args);
//         }
//     },
// });

// export const updateMultipleStudentProgress = mutation({
//     args: {
//         studentIds: v.array(v.id("students")),
//         storyId: v.id("stories"),
//         completed: v.boolean(),
//         sequenceAttempts: v.number(),
//         sequenceScore: v.number(),
//         timeSpent: v.number(),
//         stars: v.number(),
//     },
//     handler: async (ctx, args) => {
//         // Update progress for each student
//         await Promise.all(
//             args.studentIds.map(async (studentId) => {
//                 const existingProgress = await ctx.db
//                     .query("progress")
//                     .withIndex("by_student", (q) =>
//                         q.eq("studentId", studentId)
//                     )
//                     .filter((q) =>
//                         q.eq(q.field("storyId"), args.storyId)
//                     )
//                     .first();

//                 if (existingProgress) {
//                     await ctx.db.patch(existingProgress._id, {
//                         completed: args.completed,
//                         sequenceAttempts: args.sequenceAttempts,
//                         sequenceScore: args.sequenceScore,
//                         timeSpent: args.timeSpent,
//                         stars: args.stars,
//                         lastPlayed: Date.now(),
//                     });
//                 } else {
//                     await ctx.db.insert("progress", {
//                         studentId,
//                         storyId: args.storyId,
//                         completed: args.completed,
//                         sequenceAttempts: args.sequenceAttempts,
//                         sequenceScore: args.sequenceScore,
//                         timeSpent: args.timeSpent,
//                         stars: args.stars,
//                         lastPlayed: Date.now(),
//                     });
//                 }

//                 // Update gamification stats for each student
//                 await updateGamificationStats(ctx, {
//                     studentId,
//                     completed: args.completed,
//                     sequenceScore: args.sequenceScore,
//                     stars: args.stars,
//                 });

//                 // Award achievements for each student
//                 await ctx.scheduler.runAfter(0, api.achievements.checkAndAwardAchievements, {
//                     studentId,
//                     storyId: args.storyId,
//                     sequenceScore: args.sequenceScore,
//                     timeSpent: args.timeSpent,
//                     stars: args.stars,
//                 });
//             })
//         );
//     },
// });

export const updateMultipleProgress = mutation({
    args: {
        studentIds: v.array(v.id("students")),
        storyId: v.id("stories"),
        note: v.optional(v.string()),
        completed: v.optional(v.boolean()),
        sequenceAttempts: v.optional(v.number()),
        sequenceScore: v.optional(v.number()),
        quizScore: v.optional(v.number()),
        totalScore: v.optional(v.number()),
        timeSpent: v.optional(v.number()),
        stars: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        await Promise.all(
            args.studentIds.map(async (studentId) => {
                const existingProgress = await ctx.db
                    .query("progress")
                    .withIndex("by_student", (q) => q.eq("studentId", studentId))
                    .filter((q) => q.eq(q.field("storyId"), args.storyId))
                    .first();

                if (existingProgress) {
                    // Preserve existing values if not provided in the update
                    const updateData: {
                        lastPlayed: number;
                        quizScore: number;
                        totalScore: number;
                        sequenceScore: number;
                        completed: boolean;
                        sequenceAttempts: number;
                        timeSpent: number;
                        stars: number;
                        teacherNotes?: string;
                    } = {
                        lastPlayed: Date.now(),
                        quizScore: args.quizScore ?? existingProgress.quizScore ?? 0,
                        totalScore: args.totalScore ?? existingProgress.totalScore ?? 0,
                        sequenceScore: args.sequenceScore ?? existingProgress.sequenceScore ?? 0,
                        completed: args.completed ?? existingProgress.completed,
                        sequenceAttempts: args.sequenceAttempts ?? existingProgress.sequenceAttempts,
                        timeSpent: args.timeSpent ?? existingProgress.timeSpent,
                        stars: args.stars ?? existingProgress.stars,
                    };

                    if (args.note !== undefined) {
                        updateData.teacherNotes = args.note;
                    }

                    await ctx.db.patch(existingProgress._id, updateData);
                } else {
                    // For new entries, use provided values or defaults
                    const newData: {
                        studentId: Id<"students">;
                        storyId: Id<"stories">;
                        lastPlayed: number;
                        quizScore: number;
                        totalScore: number;
                        sequenceScore: number;
                        completed: boolean;
                        sequenceAttempts: number;
                        timeSpent: number;
                        stars: number;
                        teacherNotes?: string; // Added teacherNotes property
                    } = {
                        studentId,
                        storyId: args.storyId,
                        lastPlayed: Date.now(),
                        quizScore: args.quizScore ?? 0,
                        totalScore: args.totalScore ?? 0,
                        sequenceScore: args.sequenceScore ?? 0,
                        completed: args.completed ?? false,
                        sequenceAttempts: args.sequenceAttempts ?? 0,
                        timeSpent: args.timeSpent ?? 0,
                        stars: args.stars ?? 0,
                    };

                    if (args.note !== undefined) {
                        newData.teacherNotes = args.note;
                    }

                    await ctx.db.insert("progress", newData);
                }

                // Update gamification stats
                await updateGamificationStats(ctx, {
                    studentId,
                    completed: args.completed || existingProgress?.completed || false,
                    sequenceScore: args.sequenceScore || existingProgress?.sequenceScore || 0,
                    stars: args.stars || existingProgress?.stars || 0,
                    storyId: args.storyId,
                    totalScore: args.totalScore || 0,
                });
            })
        );

        return true;
    },
});

// Helper functions to update gamification stats
async function updateGamificationStats(
    ctx: any,
    args: {
        studentId: Id<"students">;
        completed: boolean;
        sequenceScore: number;
        stars: number;
        storyId: Id<"stories">;
        totalScore: number;
    }
) {
    const existingProgress = await ctx.db
        .query("progress")
        .withIndex("by_student", (q: any) => q.eq("studentId", args.studentId))
        .filter((q: any) => q.eq(q.field("storyId"), args.storyId))
        .first();

    const stats = await ctx.db
        .query("gamificationStats")
        .withIndex("by_student", (q: any) =>
            q.eq("studentId", args.studentId)
        )
        .first();

    const points = calculatePoints(args.sequenceScore, args.stars);
    const isFirstTimeCompletion = !existingProgress?.completed;

    if (stats) {
        await ctx.db.patch(stats._id, {
            totalPoints: stats.totalPoints + points,
            weeklyPoints: stats.weeklyPoints + points,
            monthlyPoints: stats.monthlyPoints + points,
            storiesCompleted: args.completed && isFirstTimeCompletion
                ? stats.storiesCompleted + 1
                : stats.storiesCompleted,
            totalStarsEarned: isFirstTimeCompletion
                ? stats.totalStarsEarned + args.stars
                : stats.totalStarsEarned,
            averageAccuracy: calculateNewAverage(
                stats.averageAccuracy,
                args.totalScore,
                stats.storiesCompleted
            ),
            lastUpdated: Date.now(),
        });
    } else {
        await ctx.db.insert("gamificationStats", {
            studentId: args.studentId,
            totalPoints: points,
            level: 1,
            currentExp: points,
            nextLevelExp: 1000,
            storiesCompleted: args.completed ? 1 : 0,
            totalStarsEarned: args.stars,
            averageAccuracy: args.totalScore,
            weeklyPoints: points,
            monthlyPoints: points,
            weekStartDate: getWeekStartDate(),
            monthStartDate: getMonthStartDate(),
            lastUpdated: Date.now(),
        });
    }
}

// Helper functions for calculations
function calculatePoints(sequenceScore: number, stars: number): number {
    const basePoints = sequenceScore;
    const starBonus = stars * 50;
    return basePoints + starBonus;
}

function calculateNewAverage(
    currentAverage: number,
    newScore: number,
    totalStories: number
): number {
    const weightedScore = newScore === 100 ? 100 : newScore;

    return Math.round(
        (currentAverage * totalStories + weightedScore) / (totalStories + 1)
    );
}

function getWeekStartDate(): number {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek.getTime();
}

function getMonthStartDate(): number {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1).getTime();
}

export const getByStory = query({
    args: {
        storyId: v.id("stories"),
        studentIds: v.array(v.id("students")),
    },
    handler: async (ctx, args) => {
        if (args.studentIds.length === 0) {
            return [];
        }

        const progress = await ctx.db
            .query("progress")
            .withIndex("by_story", (q) => q.eq("storyId", args.storyId))
            .filter((q) =>
                q.or(
                    ...args.studentIds.map(studentId =>
                        q.eq(q.field("studentId"), studentId)
                    )
                )
            )
            .collect();

        const gamificationStats = await ctx.db
            .query("gamificationStats")
            .withIndex("by_student")
            .filter((q) =>
                q.or(
                    ...args.studentIds.map(studentId =>
                        q.eq(q.field("studentId"), studentId)
                    )
                )
            )
            .collect();

        return progress.map(p => {
            const stats = gamificationStats.find(
                g => g.studentId === p.studentId
            );

            return {
                ...p,
                totalPoints: stats?.totalPoints ?? 0,
                level: stats?.level ?? 1,
                averageAccuracy: stats?.averageAccuracy ?? 0,
            };
        });
    },
});

export const getStudentProgress = query({
    args: {
        storyId: v.id("stories"),
        studentId: v.id("students"),
    },
    handler: async (ctx, args) => {
        const progress = await ctx.db
            .query("progress")
            .withIndex("by_story", (q) => q.eq("storyId", args.storyId))
            .filter((q) => q.eq(q.field("studentId"), args.studentId))
            .first();

        if (!progress) {
            return null;
        }

        // Get gamification stats
        const stats = await ctx.db
            .query("gamificationStats")
            .withIndex("by_student")
            .filter((q) => q.eq(q.field("studentId"), args.studentId))
            .first();

        return {
            ...progress,
            totalPoints: stats?.totalPoints ?? 0,
            level: stats?.level ?? 1,
            averageAccuracy: stats?.averageAccuracy ?? 0,
        };
    },
});

export const addTeacherNote = mutation({
    args: {
        progressId: v.id("progress"),
        note: v.string(),
    },
    handler: async (ctx, { progressId, note }) => {
        const progress = await ctx.db.get(progressId);
        if (!progress) {
            throw new Error("Progress entry not found");
        }

        await ctx.db.patch(progressId, {
            teacherNotes: note
        });
    }
});

export const getGroupProgress = query({
    args: {
        groupId: v.string(),
        storyId: v.id("stories"),
    },
    handler: async (ctx, args) => {
        const progress = await ctx.db
            .query("progress")
            .withIndex("by_group", (q) => q.eq("groupId", args.groupId))
            .filter((q) => q.eq(q.field("storyId"), args.storyId))
            .first();

        if (!progress) {
            return null;
        }

        return progress;
    },
});


// Helper function to handle group progress
// eslint-disable-next-line @no-explicit-any no convex types
async function handleGroupProgress(ctx: any, args: any) {
    const existingProgress = await ctx.db
        .query("progress")
        // @ts-expect-error no convex types
        .withIndex("by_group", (q) =>
            q.eq("groupId", args.groupId)
        )
        // @ts-expect-error no convex types
        .filter((q) =>
            q.eq(q.field("storyId"), args.storyId)
        )
        .first();

    if (existingProgress) {
        return await ctx.db.patch(existingProgress._id, {
            completed: args.completed,
            sequenceAttempts: args.sequenceAttempts,
            sequenceScore: args.sequenceScore,
            timeSpent: args.timeSpent,
            teacherNotes: args.teacherNotes,
            stars: args.stars,
            lastPlayed: Date.now(),
        });
    }

    return await ctx.db.insert("progress", {
        groupId: args.groupId,
        groupMembers: args.groupMembers,
        storyId: args.storyId,
        completed: args.completed,
        sequenceAttempts: args.sequenceAttempts,
        sequenceScore: args.sequenceScore,
        timeSpent: args.timeSpent,
        teacherNotes: args.teacherNotes,
        stars: args.stars,
        lastPlayed: Date.now(),
    });
}

// Helper function to handle individual progress
// eslint-disable-next-line @no-explicit-any no convex types
async function handleIndividualProgress(ctx: any, args: any) {
    const existingProgress = await ctx.db
        .query("progress")
        // @ts-expect-error no convex types
        .withIndex("by_student", (q) =>
            q.eq("studentId", args.studentId)
        )
        // @ts-expect-error no convex types
        .filter((q) =>
            q.eq(q.field("storyId"), args.storyId)
        )
        .first();

    if (existingProgress) {
        return await ctx.db.patch(existingProgress._id, {
            completed: args.completed,
            sequenceAttempts: args.sequenceAttempts,
            sequenceScore: args.sequenceScore,
            timeSpent: args.timeSpent,
            teacherNotes: args.teacherNotes,
            stars: args.stars,
            lastPlayed: Date.now(),
        });
    }

    return await ctx.db.insert("progress", {
        studentId: args.studentId,
        storyId: args.storyId,
        completed: args.completed,
        sequenceAttempts: args.sequenceAttempts,
        sequenceScore: args.sequenceScore,
        timeSpent: args.timeSpent,
        teacherNotes: args.teacherNotes,
        stars: args.stars,
        lastPlayed: Date.now(),
    });
}