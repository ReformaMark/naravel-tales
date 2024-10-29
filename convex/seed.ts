import { mutation } from "./_generated/server";

export const seedStories = mutation({
    args: {},
    handler: async (ctx) => {
        await ctx.db.insert("stories", {
            title: "The Legend of Mariang Makiling",
            content: "Long ago, in the mystical mountain of Makiling, there lived a beautiful forest fairy named Maria. She was known for her kindness to farmers and hunters who ventured into her domain. She blessed the land with abundance and protected the creatures of the forest. However, when humans became greedy and started destroying her forest, she disappeared, only to be seen by those pure of heart.",
            difficulty: "easy",
            ageGroup: "3-4",
            imageUrl: "https://utfs.io/f/a97bc715-4598-430d-b14f-3c2da998346b-qx92ki.jpg",
            sequenceCards: [
                // Level 1 Cards
                {
                    id: "card1-l1",
                    imageUrl: "https://utfs.io/f/7268e002-4516-4999-8db7-2ebf3fd91ea7-f7oen6.jpg",
                    description: "Maria blessing the farmers with good harvest",
                    order: 1,
                    level: 1
                },
                {
                    id: "card2-l1",
                    imageUrl: "https://utfs.io/f/91a5b51c-17d5-453d-ad42-124be12ded5c-cfxymp.png",
                    description: "People destroying the forest",
                    order: 2,
                    level: 1
                },
                {
                    id: "card3-l1",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Maria disappearing into the mountain",
                    order: 3,
                    level: 1
                },
                // Level 2 Cards (4 cards)
                {
                    id: "card1-l2",
                    imageUrl: "https://utfs.io/f/7268e002-4516-4999-8db7-2ebf3fd91ea7-f7oen6.jpg",
                    description: "Maria watching over her forest",
                    order: 1,
                    level: 2
                },
                {
                    id: "card2-l2",
                    imageUrl: "https://utfs.io/f/91a5b51c-17d5-453d-ad42-124be12ded5c-cfxymp.png",
                    description: "Farmers receiving blessings",
                    order: 2,
                    level: 2
                },
                {
                    id: "card3-l2",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Forest being destroyed",
                    order: 3,
                    level: 2
                },
                {
                    id: "card4-l2",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Maria's farewell",
                    order: 4,
                    level: 2
                },
                // Level 3 Cards (5 cards)
                {
                    id: "card1-l3",
                    imageUrl: "https://utfs.io/f/7268e002-4516-4999-8db7-2ebf3fd91ea7-f7oen6.jpg",
                    description: "Peaceful forest beginning",
                    order: 1,
                    level: 3
                },
                {
                    id: "card2-l3",
                    imageUrl: "https://utfs.io/f/91a5b51c-17d5-453d-ad42-124be12ded5c-cfxymp.png",
                    description: "Maria helping farmers",
                    order: 2,
                    level: 3
                },
                {
                    id: "card3-l3",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "People becoming greedy",
                    order: 3,
                    level: 3
                },
                {
                    id: "card4-l3",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Forest destruction",
                    order: 4,
                    level: 3
                },
                {
                    id: "card5-l3",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Maria's disappearance",
                    order: 5,
                    level: 3
                }
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
            imageUrl: "https://utfs.io/f/f8f07596-2a76-4056-9529-ed25c14e58b6-veczax.png",
            sequenceCards: [
                // Level 1 Cards
                {
                    id: "card1-l1",
                    imageUrl: "https://utfs.io/f/7268e002-4516-4999-8db7-2ebf3fd91ea7-f7oen6.jpg",
                    description: "Maria blessing the farmers with good harvest",
                    order: 1,
                    level: 1
                },
                {
                    id: "card2-l1",
                    imageUrl: "https://utfs.io/f/91a5b51c-17d5-453d-ad42-124be12ded5c-cfxymp.png",
                    description: "People destroying the forest",
                    order: 2,
                    level: 1
                },
                {
                    id: "card3-l1",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Maria disappearing into the mountain",
                    order: 3,
                    level: 1
                },
                // Level 2 Cards (4 cards)
                {
                    id: "card1-l2",
                    imageUrl: "https://utfs.io/f/7268e002-4516-4999-8db7-2ebf3fd91ea7-f7oen6.jpg",
                    description: "Maria watching over her forest",
                    order: 1,
                    level: 2
                },
                {
                    id: "card2-l2",
                    imageUrl: "https://utfs.io/f/91a5b51c-17d5-453d-ad42-124be12ded5c-cfxymp.png",
                    description: "Farmers receiving blessings",
                    order: 2,
                    level: 2
                },
                {
                    id: "card3-l2",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Forest being destroyed",
                    order: 3,
                    level: 2
                },
                {
                    id: "card4-l2",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Maria's farewell",
                    order: 4,
                    level: 2
                },
                // Level 3 Cards (5 cards)
                {
                    id: "card1-l3",
                    imageUrl: "https://utfs.io/f/7268e002-4516-4999-8db7-2ebf3fd91ea7-f7oen6.jpg",
                    description: "Peaceful forest beginning",
                    order: 1,
                    level: 3
                },
                {
                    id: "card2-l3",
                    imageUrl: "https://utfs.io/f/91a5b51c-17d5-453d-ad42-124be12ded5c-cfxymp.png",
                    description: "Maria helping farmers",
                    order: 2,
                    level: 3
                },
                {
                    id: "card3-l3",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "People becoming greedy",
                    order: 3,
                    level: 3
                },
                {
                    id: "card4-l3",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Forest destruction",
                    order: 4,
                    level: 3
                },
                {
                    id: "card5-l3",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Maria's disappearance",
                    order: 5,
                    level: 3
                }
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
            imageUrl: "https://utfs.io/f/208cc353-1128-4127-b536-7563f598b253-p0d523.png",
            sequenceCards: [
                // Level 1 Cards
                {
                    id: "card1-l1",
                    imageUrl: "https://utfs.io/f/7268e002-4516-4999-8db7-2ebf3fd91ea7-f7oen6.jpg",
                    description: "Maria blessing the farmers with good harvest",
                    order: 1,
                    level: 1
                },
                {
                    id: "card2-l1",
                    imageUrl: "https://utfs.io/f/91a5b51c-17d5-453d-ad42-124be12ded5c-cfxymp.png",
                    description: "People destroying the forest",
                    order: 2,
                    level: 1
                },
                {
                    id: "card3-l1",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Maria disappearing into the mountain",
                    order: 3,
                    level: 1
                },
                // Level 2 Cards (4 cards)
                {
                    id: "card1-l2",
                    imageUrl: "https://utfs.io/f/7268e002-4516-4999-8db7-2ebf3fd91ea7-f7oen6.jpg",
                    description: "Maria watching over her forest",
                    order: 1,
                    level: 2
                },
                {
                    id: "card2-l2",
                    imageUrl: "https://utfs.io/f/91a5b51c-17d5-453d-ad42-124be12ded5c-cfxymp.png",
                    description: "Farmers receiving blessings",
                    order: 2,
                    level: 2
                },
                {
                    id: "card3-l2",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Forest being destroyed",
                    order: 3,
                    level: 2
                },
                {
                    id: "card4-l2",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Maria's farewell",
                    order: 4,
                    level: 2
                },
                // Level 3 Cards (5 cards)
                {
                    id: "card1-l3",
                    imageUrl: "https://utfs.io/f/7268e002-4516-4999-8db7-2ebf3fd91ea7-f7oen6.jpg",
                    description: "Peaceful forest beginning",
                    order: 1,
                    level: 3
                },
                {
                    id: "card2-l3",
                    imageUrl: "https://utfs.io/f/91a5b51c-17d5-453d-ad42-124be12ded5c-cfxymp.png",
                    description: "Maria helping farmers",
                    order: 2,
                    level: 3
                },
                {
                    id: "card3-l3",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "People becoming greedy",
                    order: 3,
                    level: 3
                },
                {
                    id: "card4-l3",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Forest destruction",
                    order: 4,
                    level: 3
                },
                {
                    id: "card5-l3",
                    imageUrl: "https://utfs.io/f/5c82ee06-8ccd-4c30-9c7f-b31ce6bdae69-9jes6x.png",
                    description: "Maria's disappearance",
                    order: 5,
                    level: 3
                }
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