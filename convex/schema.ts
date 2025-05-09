import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const schema = defineSchema({
    ...authTables,
    users: defineTable({
        image: v.optional(v.string()),
        email: v.string(),
        emailVerificationTime: v.optional(v.number()),
        phone: v.optional(v.string()),
        phoneVerificationTime: v.optional(v.number()),
        isAnonymous: v.optional(v.boolean()),
        fname: v.optional(v.string()),
        lname: v.optional(v.string()),
        role: v.optional(v.union(v.literal("teacher"), v.literal("admin"), v.literal("parent"))),
        address: v.optional(v.string()),
        onboarding: v.optional(v.boolean()),
        isVerified: v.optional(v.boolean()),
    }).index('email', ['email']),

    classes: defineTable({
        name: v.string(),
        teacherId: v.id("users"),
        createdAt: v.number(),
        students: v.optional(v.array(v.id("students"))),
    }).index("by_teacher", ["teacherId"]),

    studentCodes: defineTable({
        studentId: v.id("students"),
        code: v.string(), // 6-digit code (e.g., "A0A0A0")
        isActive: v.boolean(),
        createdAt: v.number(),
        expiresAt: v.optional(v.number()),
        claimedBy: v.optional(v.id("users")),
        claimedAt: v.optional(v.number()),
    }).index("by_code", ["code"]).index("by_student", ["studentId"]),

    students: defineTable({
        classId: v.id("classes"),
        parentId: v.optional(v.id("users")),
        fname: v.string(),
        lname: v.string(),
        createdAt: v.number(),
        studentCode: v.optional(v.string()),
    })
        .searchIndex("search_name", {
            searchField: "fname",
            filterFields: ["classId"]
        })
        .searchIndex("search_lname", {
            searchField: "lname",
            filterFields: ["classId"]
        })
        .searchIndex("search_code", {
            searchField: "studentCode",
            filterFields: ["classId"]
        })
        .index("by_class", ["classId"])
        .index("by_parent", ["parentId"]),

    inquiries: defineTable({
        parentId: v.id("users"),
        teacherId: v.id("users"),
        studentId: v.id("students"),
        subject: v.string(),
        message: v.string(),
        status: v.union(v.literal("pending"), v.literal("responded")),
        response: v.optional(v.string()),
        createdAt: v.number(),
        respondedAt: v.optional(v.number()),
    }).index("by_teacher", ["teacherId"]).index("by_student", ["studentId"]),

    storyCategories: defineTable({
        name: v.string(),
        description: v.optional(v.string()),
        imageId: v.optional(v.string()),
    }),

    storyLanguages: defineTable({
        name: v.string(),
    }),

    stories: defineTable({
        title: v.string(),
        content: v.string(),
        author: v.optional(v.string()),
        categoryId: v.optional(v.id("storyCategories")),
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
        createdAt: v.number(),
        language: v.optional(v.id("storyLanguages")), // Language of the story
    }).searchIndex("search_title", {
        searchField: "title",
        filterFields: ["isActive"]
    }).index('by_languageId', ['language']),

    progress: defineTable({
        studentId: v.optional(v.id("students")),
        groupId: v.optional(v.string()),
        groupMembers: v.optional(v.array(v.object({
            studentId: v.id("students"),
            name: v.string()
        }))),
        storyId: v.id("stories"),
        completed: v.boolean(),
        lastPlayed: v.number(),
        // Sequence activity specific fields
        sequenceAttempts: v.number(),
        sequenceScore: v.number(), // 50% of total score
        quizScore: v.optional(v.number()), // 50% of total score
        totalScore: v.optional(v.number()), // Combined score (0-100)
        timeSpent: v.number(), // in seconds
        teacherNotes: v.optional(v.string()),
        // Simple star rating for gamification (1-3 stars)
        stars: v.number(),
    }).index("by_student", ["studentId"]).index("by_story", ["storyId"]).index("by_group", ["groupId"]),

    achievements: defineTable({
        studentId: v.id("students"),
        name: v.string(),
        description: v.string(),
        type: v.union(
            v.literal("sequence_master"), // Complete sequence perfectly
            v.literal("quick_learner"), // Complete under certain time
            v.literal("persistent_reader"), // Complete multiple stories
            v.literal("story_expert"), // Get 3 stars on multiple stories
            v.literal("practice_star"), // Practice consistently
            v.literal("team_player"),
            v.literal("group_master"),
        ),
        criteria: v.object({
            requiredScore: v.optional(v.number()),
            requiredTime: v.optional(v.number()),
            requiredCompletions: v.optional(v.number()),
            requiredStars: v.optional(v.number())
        }),
        imageUrl: v.optional(v.string()), // Badge or trophy image
        earnedAt: v.number(),
        notificationSent: v.boolean(), // Track if parents/teachers were notified
    }).index("by_student", ["studentId"]).index("by_type", ["type"]),

    rewards: defineTable({
        studentId: v.id("students"),
        type: v.union(
            v.literal("story_completion"),
            v.literal("achievement_unlock"),
            v.literal("practice_streak"),
            v.literal("perfect_score")
        ),
        points: v.number(),
        earnedAt: v.number(),
        isRedeemed: v.boolean(),
        redeemedAt: v.optional(v.number()),
        // For teacher/parent tracking
        acknowledgedBy: v.array(v.object({
            userId: v.id("users"),
            role: v.union(v.literal("teacher"), v.literal("parent")),
            timestamp: v.number()
        }))
    }).index("by_student", ["studentId"]).index("by_type", ["type"]),

    gamificationStats: defineTable({
        studentId: v.id("students"),
        // Core Stats for Leaderboard
        totalPoints: v.number(),
        level: v.number(),
        currentExp: v.number(),
        nextLevelExp: v.number(),

        // Quick Dashboard Stats
        storiesCompleted: v.number(),
        totalStarsEarned: v.number(),
        averageAccuracy: v.number(), // 0-100%

        // Weekly/Monthly Stats for Rankings
        weeklyPoints: v.number(),
        monthlyPoints: v.number(),
        weekStartDate: v.number(), // timestamp
        monthStartDate: v.number(), // timestamp

        lastUpdated: v.number(),
    }).index("by_student", ["studentId"])
        .index("by_total_points", ["totalPoints"])
        .index("by_weekly_points", ["weeklyPoints"])
        .index("by_monthly_points", ["monthlyPoints"]),

    quiz: defineTable({
        question: v.string(),
        answer: v.string(),
        points: v.number(),
        createdBy: v.id("users"),
        storyId: v.id("stories"),
    })

});


export default schema;
