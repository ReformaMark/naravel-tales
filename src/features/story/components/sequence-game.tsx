'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useMutation } from 'convex/react'

import Image from 'next/image'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { useGameSounds } from '@/lib/sounds'
import { fisherYatesShuffle, validateSequence } from '@/lib/algorithms'

export interface SequenceCard {
  id: string;
  imageUrl: string;
  description: string;
  order: number;
  level: number;
}

interface SequenceGameProps {
  storyId: Id<"stories">;
  studentId: Id<"students">;
  sequenceCards: SequenceCard[];
}

export function SequenceGame({ storyId, studentId, sequenceCards }: SequenceGameProps) {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [cards, setCards] = useState<SequenceCard[]>([])
  const [attempts, setAttempts] = useState(0)
  const [mistakes, setMistakes] = useState<Array<{ index: number; expected: number; received: number }>>([])

  const {
    playSuccess,
    playError,
    playLevelUp,
    playComplete
  } = useGameSounds()

  const updateProgress = useMutation(api.progress.updateProgress)

  useEffect(() => {
    // Filter cards for current level and shuffle only for initial display
    const levelCards = sequenceCards
      .filter(card => card.level === currentLevel)
      .sort((a, b) => a.order - b.order); // Sort by correct order first

    // Only shuffle for initial display
    setCards(fisherYatesShuffle(levelCards));
    setMistakes([]);
  }, [currentLevel, sequenceCards])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCards(items);
    setMistakes([]);
  }

  const checkSequence = () => {
    // Get correct sequence for current level
    const correctSequence = sequenceCards
      .filter(card => card.level === currentLevel)
      .sort((a, b) => a.order - b.order);

    // Validate the current sequence
    const result = validateSequence(cards, correctSequence);
    setMistakes(result.mistakes);

    if (result.isCorrect) {
      if (currentLevel === 3) {
        playComplete();
        updateProgress({
          studentId,
          storyId,
          completed: true,
          sequenceAttempts: attempts,
          sequenceScore: result.score,
          timeSpent: 0,
          stars: calculateStars(attempts),
        });
        toast.success('Congratulations! You completed all levels!');
      } else {
        playLevelUp();
        toast.success('Level completed! Moving to next level');
        setCurrentLevel(prev => prev + 1);
        setAttempts(0);
      }
    } else {
      playError();
      setAttempts(prev => prev + 1);
      toast.error('Try again! The sequence is not correct.');
    }
  }

  function calculateStars(attempts: number): number {
    if (attempts <= 3) return 3;
    if (attempts <= 5) return 2;
    return 1;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Level {currentLevel}</h2>
        <p>Arrange the images in the correct order</p>
        {mistakes.length > 0 && (
          <div className="mt-2 text-red-500 text-sm">
            Found {mistakes.length} incorrect positions
          </div>
        )}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="cards" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-4 mb-6"
            >
              {cards.map((card, index) => (
                <Draggable
                  key={card.id}
                  draggableId={card.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`
                                            w-48 aspect-square relative 
                                            ${mistakes.some(m => m.index === index)
                          ? 'ring-2 ring-red-500'
                          : ''}
                                        `}
                    >
                      <Image
                        src={card.imageUrl}
                        alt={card.description}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button
        onClick={checkSequence}
        className="w-full"
      >
        Check Sequence
      </Button>
    </div>
  )
}