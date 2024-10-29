import { SequenceCard } from "@/features/story/components/sequence-game";

// Fisher-Yates Shuffle Algorithm
export function fisherYatesShuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Greedy Algorithm for Sequence Validation
export function validateSequenceGreedy(
    currentSequence: SequenceCard[],
    correctSequence: SequenceCard[]
): {
    isCorrect: boolean;
    score: number;
    mistakes: { index: number; expected: number; received: number }[];
} {
    const mistakes: { index: number; expected: number; received: number }[] = [];
    let correctCount = 0;

    // Compare each position
    currentSequence.forEach((card, index) => {
        const expectedOrder = correctSequence[index].order;
        if (card.order === expectedOrder) {
            correctCount++;
        } else {
            mistakes.push({
                index,
                expected: expectedOrder,
                received: card.order
            });
        }
    });

    // Calculate score based on correct positions
    const score = Math.round((correctCount / currentSequence.length) * 100);

    return {
        isCorrect: mistakes.length === 0,
        score,
        mistakes
    };
}