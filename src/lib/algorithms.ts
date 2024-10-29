import { SequenceCard } from "@/features/story/components/sequence-game";

// Fisher-Yates Shuffle Algorithm - Only for initial display
export function fisherYatesShuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Sequence Validation - Check if cards are in correct order
export function validateSequence(
    currentSequence: SequenceCard[],
    correctSequence: SequenceCard[]
): {
    isCorrect: boolean;
    score: number;
    mistakes: { index: number; expected: number; received: number }[];
} {
    const mistakes: { index: number; expected: number; received: number }[] = [];
    let correctCount = 0;

    // Compare each position with the expected order
    currentSequence.forEach((card, index) => {
        // Find the correct card that should be at this position
        const correctCard = correctSequence.find(c => c.order === index + 1);
        
        if (correctCard && card.id === correctCard.id) {
            correctCount++;
        } else {
            mistakes.push({
                index,
                expected: index + 1,
                received: card.order
            });
        }
    });

    const score = Math.round((correctCount / currentSequence.length) * 100);

    return {
        isCorrect: mistakes.length === 0,
        score,
        mistakes
    };
}