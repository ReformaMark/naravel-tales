'use client'

import { Button } from '@/components/ui/button'
import { fisherYatesShuffle, validateSequence } from '@/lib/algorithms'
import { useWindowSize } from '@/lib/hooks/use-window-size'
import { useGameSounds } from '@/lib/sounds'
import { cn } from '@/lib/utils'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { useMutation } from 'convex/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Star, Speaker } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import ReactConfetti from 'react-confetti'
import { toast } from 'sonner'
import { api } from '../../../../convex/_generated/api'
import { Id } from '../../../../convex/_generated/dataModel'
import { TeacherNoteModal } from "@/features/class/components/teacher-note-modal"
import { Student } from '@/features/students/student-types'

export interface SequenceCard {
  url: string | null;
  id: string;
  description: string;
  order: number;
  level: number;
  imageId: string;
}

interface SequenceGameProps {
  storyId: Id<"stories">;
  studentId: Id<"students">;
  sequenceCards: SequenceCard[];
  student: Student;
}

export function SequenceGame({ storyId, studentId, sequenceCards, student }: SequenceGameProps) {
  const [currentLevel, setCurrentLevel] = useState(1)
  const [cards, setCards] = useState<SequenceCard[]>([])
  const [attempts, setAttempts] = useState(0)
  const [mistakes, setMistakes] = useState<Array<{ index: number; expected: number; received: number }>>([])
  const [showShake, setShowShake] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false)
  const [finalStars, setFinalStars] = useState(0)
  const [showConfetti, setShowConfetti] = useState(false)
  const [showNoteModal, setShowNoteModal] = useState(false)
  const [progressId, setProgressId] = useState<Id<"progress"> | null>(null)
  const [startTime] = useState(Date.now())
  const { width, height } = useWindowSize()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [shuffledCards, setShuffledCards] = useState<SequenceCard[]>([])

  const currentCards = sequenceCards
    .filter(card => card.level === currentLevel)
    .sort((a, b) => a.order - b.order)

  const {
    playSelect,
    playError,
    playSuccess,
    playLevelUp,
    playComplete
  } = useGameSounds()

  const updateProgress = useMutation(api.progress.updateProgress)
  const checkAndAwardAchievements = useMutation(api.achievements.checkAndAwardAchievements)

  useEffect(() => {
    const levelCards = sequenceCards
      .filter(card => card.level === currentLevel)
      .sort((a, b) => a.order - b.order);
    setCards(fisherYatesShuffle(levelCards));
    setMistakes([]);
    reshuffleCards();
  }, [currentLevel, sequenceCards])

  const reshuffleCards = () => {
    const levelCards = sequenceCards.filter(card => card.level === currentLevel);
    const shuffledImages = fisherYatesShuffle(levelCards.map(card => ({ ...card, description: '' })));
    setShuffledCards(shuffledImages);
    setCards(shuffledImages);
  };

  const handleDragStart = () => {
    playSelect()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    playSelect()
    setCards(items);
    setMistakes([]);
  }

  const checkSequence = async () => {
    const correctSequence = sequenceCards
      .filter(card => card.level === currentLevel)
      .sort((a, b) => a.order - b.order);

    const result = validateSequence(cards, correctSequence);
    setMistakes(result.mistakes);

    if (result.isCorrect) {
      playSuccess()
      if (currentLevel === 3) {
        const earnedStars = calculateStars(attempts)
        setFinalStars(earnedStars)
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
        setIsCompleted(true)
        playComplete()

        // Update this section
        const progress = await updateProgress({
          studentId,
          storyId,
          completed: true,
          sequenceAttempts: attempts,
          sequenceScore: result.score,
          timeSpent: Math.floor((Date.now() - startTime) / 1000),
          stars: earnedStars,
        })

        await checkAndAwardAchievements({
          studentId,
          storyId,
          sequenceScore: result.score,
          timeSpent: Math.floor((Date.now() - startTime) / 1000),
          stars: earnedStars,
        })

        setProgressId(progress)
        setShowNoteModal(true)
        toast.success('Congratulations! You completed all levels!')
      } else {
        playLevelUp()
        toast.success('Level completed! Moving to next level')
        setCurrentLevel(prev => prev + 1)
      }
    } else {
      playError()
      reshuffleCards()
      setAttempts(prev => prev + 1)
      setMistakes(result.mistakes)
      setShowShake(true)
      setTimeout(() => setShowShake(false), 1000)
      toast.error('Try again! The sequence is not correct.')
    }
  }

  function calculateStars(attempts: number): number {
    if (attempts <= 3) return 3;
    if (attempts <= 5) return 2;
    return 1;
  }

  const speak = (text: string) => {
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)

    // Get available voices and select Zira
    const voices = window.speechSynthesis.getVoices()
    const ziraVoice = voices.find(voice => voice.name === 'Microsoft Zira - English (United States)')

    if (ziraVoice) {
      utterance.voice = ziraVoice
    }

    // Optimize parameters for Zira's voice
    utterance.rate = 0.9     // Slightly slower for better clarity
    utterance.pitch = 1.1    // Slightly higher pitch but not too much
    utterance.volume = 1     // Full volume

    window.speechSynthesis.speak(utterance)
  }

  // Since voices might load after page load, we need to handle that
  useEffect(() => {
    function handleVoicesChanged() {
      window.speechSynthesis.getVoices()
    }

    speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged)
    return () => {
      speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
    }
  }, [])

  return (
    <>
      <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] relative">
        {showConfetti && (
          <ReactConfetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.2}
          />
        )}

        <div className="max-w-7xl mx-auto space-y-12">
          <AnimatePresence mode="wait">
            {!isCompleted ? (
              // Game Content
              <>
                <motion.div
                  key={`level-${currentLevel}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-4"
                >
                  <motion.div
                    className="inline-block px-6 py-2 bg-primary/10 rounded-full"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-3xl font-bold text-primary">Level {currentLevel}</h2>

                    <Button
                      size="icon"
                      variant="default"
                      className="absolute bottom-3 -right-5 w-8 h-8 rounded-full opacity-80 hover:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation()
                        // @ts-expect-error this is correctly-typed
                        speak(currentCards.map(c => c.description))
                      }}
                    >
                      <Speaker className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <motion.p
                    className="text-lg text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Arrange the images in the correct sequence
                  </motion.p>
                  <motion.p
                    className="text-sm text-muted-foreground max-w-2xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {/* {cards.map(card => (card.description + ".")).join('\n')} */}
                    {/* {sequenceCards.map(s => (s.description + ".")).join('\n')} */}
                    {currentCards.map(c => (c.description + ".")).join('\n')}
                  </motion.p>
                  {mistakes.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-destructive text-sm font-medium"
                    >
                      Found {mistakes.length} incorrect {mistakes.length === 1 ? 'position' : 'positions'}
                    </motion.div>
                  )}
                </motion.div>

                <div className="w-full">
                  <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
                    <Droppable droppableId="cards" direction="horizontal">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="flex flex-wrap gap-6 justify-center items-start min-h-[220px] px-4 py-2 mx-auto"
                        >
                          {cards.map((card, index) => (
                            <Draggable
                              key={card.id}
                              draggableId={card.id}
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`
                                    w-[180px] h-[180px] relative 
                                    rounded-xl overflow-hidden
                                    transition-all duration-200
                                    shadow-lg hover:shadow-xl
                                    ${snapshot.isDragging ? 'ring-4 ring-primary shadow-2xl z-10' : ''}
                                    ${mistakes.some(m => m.index === index) && showShake
                                      ? 'ring-2 ring-destructive animate-shake'
                                      : mistakes.some(m => m.index === index)
                                        ? 'ring-2 ring-destructive'
                                        : 'ring-1 ring-border hover:ring-2 hover:ring-primary/50'}
                                  `}
                                  style={provided.draggableProps.style}
                                >
                                  <div className="w-full h-full">
                                    <Image
                                      src={card.url || ""}
                                      alt={card.description}
                                      fill
                                      className="object-cover transition-opacity duration-200"
                                      sizes="180px"
                                      priority={index < 2}
                                    />
                                    {/* <Button
                                      size="icon"
                                      variant="secondary"
                                      className="absolute bottom-2 right-2 w-8 h-8 rounded-full opacity-80 hover:opacity-100"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        speak(card.description)
                                      }}
                                    >
                                      <Speaker className="w-4 h-4" />
                                    </Button> */}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>

                <div className="space-y-8">
                  <motion.div
                    className="flex justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={checkSequence}
                      size="lg"
                      className="px-12 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow"
                    >
                      Check Sequence
                    </Button>
                  </motion.div>

                  <motion.div
                    className="flex justify-center gap-6 text-sm text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <span>Attempts: {attempts}</span>
                    <span>•</span>
                    <span>Level {currentLevel} of 3</span>
                  </motion.div>
                </div>
              </>
            ) : (
              // Completion Content
              <motion.div
                key="completion"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-8 py-12"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-4xl font-bold mb-4">Story Completed! 🎉</h2>
                  <p className="text-xl text-muted-foreground">
                    You&apos;ve successfully arranged all sequences!
                  </p>
                </motion.div>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex justify-center gap-6 py-8"
                >
                  {[1, 2, 3].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + star * 0.2 }}
                    >
                      <Star
                        size={64}
                        className={cn(
                          'transition-all duration-300',
                          star <= finalStars
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        )}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="space-y-4 text-center"
                >
                  <div className="text-xl">
                    <span className="text-muted-foreground">Total Attempts:</span>{' '}
                    <span className="font-semibold">{attempts}</span>
                  </div>
                  <div className="text-xl">
                    <span className="text-muted-foreground">Stars Earned:</span>{' '}
                    <span className="font-semibold">{finalStars} of 3</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="pt-8"
                >
                  <Button
                    onClick={() => window.location.reload()}
                    size="lg"
                    className="px-8 py-6 text-xl font-semibold rounded-full"
                  >
                    Play Again
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showNoteModal && progressId && (
        <TeacherNoteModal
          isOpen={showNoteModal}
          onClose={() => setShowNoteModal(false)}
          progressId={progressId}
          studentName={`${student.fname} ${student.lname}`}
        />
      )}
    </>
  )
}