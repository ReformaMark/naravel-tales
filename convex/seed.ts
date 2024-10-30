import { mutation } from "./_generated/server";

export const seedStories = mutation({
    args: {},
    handler: async (ctx) => {
        await ctx.db.insert("stories", {
            title: "The Legend of Mariang Makiling",
            content: "Long ago, in the mystical mountain of Makiling, there lived a beautiful forest fairy named Maria. She was known for her kindness to farmers and hunters who ventured into her domain. She blessed the land with abundance and protected the creatures of the forest. However, when humans became greedy and started destroying her forest, she disappeared, only to be seen by those pure of heart.",
            difficulty: "easy",
            ageGroup: "3-4",
            imageId: "https://utfs.io/f/a97bc715-4598-430d-b14f-3c2da998346b-qx92ki.jpg",
            sequenceCards: [
               
            ],
            minAge: 3,
            maxAge: 4,
            readingTime: 5,
            points: 100,
            tags: ["nature", "kindness", "conservation"],
            quizQuestions: [
                {
                    question: "Who is Maria Makiling?",
                    options: ["A farmer", "A forest fairy", "A hunter", "A mountain"],
                    correctAnswer: 1,
                    points: 10
                }
            ],
            culturalNotes: "This story teaches the importance of respecting nature and living harmoniously with the environment, a key value in Filipino culture.",
            isActive: true,
            createdAt: Date.now(),
        });

        await ctx.db.insert("stories", {
            title: "The Golden Shell",
            content: "In a small coastal village lived a poor fisherman's son who found a magical golden shell. Every time he helped someone in need, the shell would produce golden pearls. But when he became selfish and stopped helping others, the shell stopped giving pearls. He learned that true wealth comes from kindness and helping others.",
            difficulty: "easy",
            ageGroup: "4-5",
            imageId: "",
            sequenceCards: [
               
            ],
            minAge: 4,
            maxAge: 5,
            readingTime: 7,
            points: 150,
            tags: ["kindness", "generosity", "magic"],
            quizQuestions: [
                {
                    question: "What did the golden shell produce?",
                    options: ["Silver coins", "Golden pearls", "Diamonds", "Food"],
                    correctAnswer: 1,
                    points: 10
                }
            ],
            culturalNotes: "This story reflects Filipino values of bayanihan (community spirit) and the importance of sharing blessings with others.",
            isActive: true,
            createdAt: Date.now(),
        });

        await ctx.db.insert("stories", {
            title: "The First Monkey",
            content: "Once there was a lazy boy who never helped his parents with housework. One day, a fairy cast a spell on him, turning him into a monkey. He had to learn to work hard gathering food and building his own shelter. Through this experience, he learned the value of hard work and responsibility.",
            difficulty: "medium",
            ageGroup: "5-6",
            imageId: "",
            sequenceCards: [
              
            ],
            minAge: 5,
            maxAge: 6,
            readingTime: 10,
            points: 200,
            tags: ["hard work", "responsibility", "transformation"],
            quizQuestions: [
                {
                    question: "What did the lazy boy turn into?",
                    options: ["A bird", "A monkey", "A fish", "A cat"],
                    correctAnswer: 1,
                    points: 10
                }
            ],
            culturalNotes: "This story teaches the Filipino value of sipag (industriousness) and the importance of helping one's family.",
            isActive: true,
            createdAt: Date.now(),
        });
    },
});