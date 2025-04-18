"use client";

import { SpeechControls } from "@/components/speech-controls";
import { Button } from "@/components/ui/button";
import { TeacherNoteModal } from "@/features/class/components/teacher-note-modal";
import type { Student } from "@/features/students/student-types";
import { fisherYatesShuffle, validateSequence } from "@/lib/algorithms";
import { useWindowSize } from "@/lib/hooks/use-window-size";
import { useGameSounds } from "@/lib/sounds";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, Users2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactConfetti from "react-confetti";
import { toast } from "sonner";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { QuizSection } from "./quiz-section";

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
  studentIds: Id<"students">[];
  sequenceCards: SequenceCard[];
  students: Student[];
}

const MAX_ATTEMPTS_PER_STORY = 3;

export function SequenceGame({
  storyId,
  sequenceCards,
  studentIds,
  students,
}: SequenceGameProps) {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [sourceCards, setSourceCards] = useState<SequenceCard[]>([]);
  const [targetCards, setTargetCards] = useState<(SequenceCard | null)[]>([]);
  const [mistakes, setMistakes] = useState<
    Array<{ index: number; expected: number; received: number }>
  >([]);
  const [showShake, setShowShake] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalStars, setFinalStars] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [startTime] = useState(Date.now());
  const [showQuiz, setShowQuiz] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [quizScore, setQuizScore] = useState(0);
  const [sequenceScore, setSequenceScore] = useState(0);
  const { width, height } = useWindowSize();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [attemptsPerLevel, setAttemptsPerLevel] = useState<
    Record<number, number>
  >({});
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameEndReason, setGameEndReason] = useState<
    "completed" | "max-attempts"
  >("completed");

  const totalAttempts = Object.values(attemptsPerLevel).reduce(
    (sum, count) => sum + count,
    0
  );

  const quizzes = useQuery(api.quiz.get, { storyId });

  const currentLevelCards = sequenceCards
    .filter((card) => card.level === currentLevel)
    .sort((a, b) => a.order - b.order);

  const { playSelect, playError, playSuccess, playLevelUp, playComplete } =
    useGameSounds();

  // const updateProgress = useMutation(api.progress.updateProgress);
  const updateMultipleProgress = useMutation(
    api.progress.updateMultipleProgress
  );
  const checkAndAwardAchievements = useMutation(
    api.achievements.checkAndAwardAchievements
  );

  // // Add a helper function to make the drag and drop behavior more intuitive:
  // const findEmptySlot = () => {
  //   return targetCards.findIndex((card) => card === null);
  // };

  // Initialize the game for the current level
  useEffect(() => {
    const levelCards = sequenceCards
      .filter((card) => card.level === currentLevel)
      .sort((a, b) => a.order - b.order);

    // Create empty target slots
    setTargetCards(Array(levelCards.length).fill(null));

    // Shuffle source cards
    setSourceCards(fisherYatesShuffle([...levelCards]));

    // Reset mistakes
    setMistakes([]);

    // Add a toast message to clarify the drag behavior
    // if (currentLevel === 1) {
    //   setShowInstructions(true);
    //   toast.info("Drag cards to any numbered position", {
    //     duration: 4000,
    //     id: "drag-instructions",
    //   });
    //   const timer = setTimeout(() => setShowInstructions(false), 5000);
    //   return () => clearTimeout(timer);
    // }
  }, [currentLevel, sequenceCards]);

  const reshuffleCards = () => {
    // Move all cards back to source
    const allCards = [...sourceCards];
    targetCards.forEach((card) => {
      if (card) allCards.push(card);
    });

    // Reset target slots
    setTargetCards(Array(currentLevelCards.length).fill(null));

    // Shuffle source cards
    setSourceCards(fisherYatesShuffle(allCards));

    // Clear mistakes
    setMistakes([]);
    setShowShake(false);
  };

  const handleDragStart = () => {
    playSelect();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Handle drag from source to target
    if (
      source.droppableId === "source" &&
      destination.droppableId === "target"
    ) {
      const sourceCardsCopy = [...sourceCards];
      const targetCardsCopy = [...targetCards];

      // Get the card being moved
      const [movedCard] = sourceCardsCopy.splice(source.index, 1);

      // Place the card exactly at the destination index
      // If there's already a card in the target position, swap them
      const existingCard = targetCardsCopy[destination.index];
      if (existingCard) {
        sourceCardsCopy.push(existingCard);
      }

      // Place the moved card in the target position
      targetCardsCopy[destination.index] = movedCard;

      setSourceCards(sourceCardsCopy);
      setTargetCards(targetCardsCopy);
      playSelect();
    }
    // Handle drag from target to source
    else if (
      source.droppableId === "target" &&
      destination.droppableId === "source"
    ) {
      const sourceCardsCopy = [...sourceCards];
      const targetCardsCopy = [...targetCards];

      // Get the card being moved
      const movedCard = targetCardsCopy[source.index];
      if (!movedCard) return;

      // Remove from target
      targetCardsCopy[source.index] = null;

      // Add to source at the exact destination index
      sourceCardsCopy.splice(destination.index, 0, movedCard);

      setSourceCards(sourceCardsCopy);
      setTargetCards(targetCardsCopy);
      playSelect();
    }
    // Handle reordering within target
    else if (
      source.droppableId === "target" &&
      destination.droppableId === "target"
    ) {
      const targetCardsCopy = [...targetCards];

      // Get the card being moved
      const movedCard = targetCardsCopy[source.index];
      if (!movedCard) return;

      // If there's already a card in the destination, swap them
      const existingCard = targetCardsCopy[destination.index];

      // Perform the swap
      targetCardsCopy[source.index] = existingCard;
      targetCardsCopy[destination.index] = movedCard;

      setTargetCards(targetCardsCopy);
      playSelect();
    }
    // Handle reordering within source
    else if (
      source.droppableId === "source" &&
      destination.droppableId === "source"
    ) {
      const sourceCardsCopy = [...sourceCards];

      // Reorder source cards
      const [movedCard] = sourceCardsCopy.splice(source.index, 1);
      sourceCardsCopy.splice(destination.index, 0, movedCard);

      setSourceCards(sourceCardsCopy);
      playSelect();
    }

    // Clear any mistake indicators
    setMistakes([]);
  };

  const calculateSequenceScore = (result: { score: number }) => {
    return Math.round((result.score / 100) * 50);
  };

  const checkSequence = async () => {
    // Check if all target slots are filled
    if (targetCards.some((card) => card === null)) {
      toast.error("Please fill all the sequence positions");
      return;
    }

    // Check if max attempts reached
    if (totalAttempts >= MAX_ATTEMPTS_PER_STORY) {
      return;
    }

    const correctSequence = sequenceCards
      .filter((card) => card.level === currentLevel)
      .sort((a, b) => a.order - b.order);

    // Filter out null values (shouldn't happen if we check above)
    const filledTargetCards = targetCards.filter(
      (card) => card
    ) as SequenceCard[];

    const result = validateSequence(filledTargetCards, correctSequence);
    setMistakes(result.mistakes);

    if (result.isCorrect) {
      playSuccess();
      if (currentLevel === 3) {
        const earnedStars = calculateStars(totalAttempts);
        const calculatedSequenceScore = calculateSequenceScore(result);
        setSequenceScore(calculatedSequenceScore);
        setFinalStars(earnedStars);
        setIsCompleted(true);
        playComplete();

        setGameEndReason("completed");

        await Promise.all(
          studentIds.map((studentId) =>
            checkAndAwardAchievements({
              studentId,
              storyId,
              sequenceScore: result.score,
              timeSpent: Math.floor((Date.now() - startTime) / 1000),
              stars: earnedStars,
            })
          )
        );

        toast.success("Game completed! Continue to quiz.");
      } else {
        playLevelUp();
        toast.success("Level completed! Moving to next level");
        setCurrentLevel((prev) => prev + 1);
      }
    } else {
      playError();
      reshuffleCards();
      setMistakes(result.mistakes);
      setShowShake(true);
      setTimeout(() => setShowShake(false), 1000);

      // Only increment attempts on incorrect answers
      setAttemptsPerLevel((prev) => ({
        ...prev,
        [currentLevel]: (prev[currentLevel] || 0) + 1,
      }));

      // Check if this attempt maxes out the limit
      if (totalAttempts + 1 >= MAX_ATTEMPTS_PER_STORY) {
        setIsCompleted(true);
        setGameEndReason("max-attempts");
        toast.error("Maximum attempts reached. Story ended.");
      } else {
        toast.error("Try again! The sequence is not correct.");
      }
    }
  };

  function calculateStars(attempts: number): number {
    if (attempts === 0) return 3; // Perfect score
    if (attempts <= 1) return 2; // 1 mistake
    return 1; // More than 1 mistake
  }

  // Since voices might load after page load, we need to handle that
  useEffect(() => {
    function handleVoicesChanged() {
      window.speechSynthesis.getVoices();
    }

    speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
    };
  }, []);

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

        <div className="max-w-7xl mx-auto space-y-8">
          <AnimatePresence mode="wait">
            {isCompleted ? (
              !showQuiz ? (
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
                    {/* <h2 className="text-4xl font-bold mb-4">
                      Game Completed! 🎉
                    </h2>
                    <p className="text-xl text-muted-foreground">
                      Great job! Let&apos;s continue with the quiz.
                    </p> */}
                    {gameEndReason === "completed" ? (
                      <>
                        <h2 className="text-4xl font-bold mb-4">
                          Game Completed! 🎉
                        </h2>
                        <p className="text-xl text-muted-foreground">
                          Great job! Let&apos;s continue with the quiz.
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-4xl font-bold mb-4 text-destructive">
                          Game Over
                        </h2>
                        <p className="text-xl text-muted-foreground">
                          Maximum attempts reached. Please try again.
                        </p>
                      </>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.6 }}
                    className="pt-8"
                  >
                    {/* <Button
                      onClick={() => setShowQuiz(true)}
                      size="lg"
                      className="px-8 py-6 text-xl font-semibold rounded-full"
                    >
                      Continue to Quiz
                    </Button> */}
                    {gameEndReason === "completed" ? (
                      <Button
                        onClick={() => setShowQuiz(true)}
                        size="lg"
                        className="px-8 py-6 text-xl font-semibold rounded-full"
                      >
                        Continue to Quiz
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          // Reset the game
                          setIsCompleted(false);
                          setCurrentLevel(1);
                          setAttemptsPerLevel({});
                          setMistakes([]);
                          // Reinitialize will happen via useEffect
                        }}
                        size="lg"
                        className="px-8 py-6 text-xl font-semibold rounded-full"
                      >
                        Try Again
                      </Button>
                    )}
                  </motion.div>
                </motion.div>
              ) : (
                <QuizSection
                  quizzes={quizzes || []}
                  finalStars={finalStars}
                  onComplete={async (quizScore) => {
                    setQuizScore(quizScore);
                    setShowConfetti(true);
                    setTimeout(() => setShowConfetti(false), 5000);

                    // Calculate total score (sequence + quiz)
                    const totalScore = sequenceScore + quizScore;

                    await updateMultipleProgress({
                      studentIds,
                      storyId,
                      completed: true,
                      sequenceAttempts: totalAttempts,
                      sequenceScore: sequenceScore,
                      quizScore: quizScore,
                      totalScore: totalScore,
                      timeSpent: Math.floor((Date.now() - startTime) / 1000),
                      stars: finalStars,
                    });

                    setShowNoteModal(true);

                    if (quizzes && quizzes.length > 0) {
                      toast.success("Quiz completed!");
                    } else {
                      toast.success(
                        `All ${students.length} students have been graded!`
                      );
                    }
                  }}
                />
              )
            ) : (
              <>
                <motion.div
                  key={`level-${currentLevel}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center space-y-4"
                >
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Users2Icon className="w-5 h-5 text-primary" />
                    <span className="font-medium text-primary">
                      Grading {students.length} student
                      {students.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  <motion.div
                    className="flex flex-col gap-3 items-center justify-center px-6 py-2 bg-primary/10 rounded-full"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-3xl font-bold text-primary">
                      Level {currentLevel}
                    </h2>

                    <SpeechControls
                      text={currentLevelCards
                        .map((c) => c.description)
                        .join(". ")}
                    />
                  </motion.div>
                  {/* <motion.p
                    className="text-lg text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Arrange the images in the correct sequence
                  </motion.p> */}
                  <motion.div
                    className="text-sm text-muted-foreground max-w-2xl mx-auto space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {currentLevelCards.map((c, index) => (
                      <p key={index}>{c.description}</p>
                    ))}
                  </motion.div>

                  <motion.div
                    className="text-sm text-muted-foreground max-w-2xl mx-auto space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h1 className="text-black text-base underline underline-offset-4">
                      Drag and position the image correctly based on the content
                      text provided.
                    </h1>
                  </motion.div>

                  {mistakes.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 text-destructive text-sm font-medium"
                    >
                      Found {mistakes.length} incorrect{" "}
                      {mistakes.length === 1 ? "position" : "positions"}
                    </motion.div>
                  )}
                </motion.div>

                {/* Game Instructions */}
                {/* <AnimatePresence>
                  {showInstructions && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-muted/80 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto mb-4 relative"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="font-medium mb-1">How to Play</h3>
                          <p className="text-sm text-muted-foreground">
                            Drag cards from the bottom row and place them in the
                            correct sequence in the top row.
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setShowInstructions(false)}
                      >
                        ✕
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence> */}

                <div className="w-full space-y-6">
                  <DragDropContext
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                  >
                    {/* Target Area (Top Row) */}
                    <div className="relative">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                      >
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full shadow-sm">
                          <span>Place cards here</span>
                          <ArrowDown className="w-3 h-3" />
                        </div>
                      </motion.div>

                      <Droppable droppableId="target" direction="horizontal">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`
                              flex justify-center items-center gap-4 p-6 mb-8 rounded-xl
                              min-h-[220px] border-2 border-dashed
                              ${snapshot.isDraggingOver ? "bg-primary/5 border-primary/50" : "bg-muted/30 border-muted"}
                              transition-colors duration-200
                            `}
                          >
                            {targetCards.map((card, index) => (
                              <div key={`target-${index}`} className="relative">
                                {card ? (
                                  <Draggable
                                    draggableId={`target-${card.id}`}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`
                                          w-[160px] h-[160px] relative 
                                          rounded-xl overflow-hidden
                                          transition-all duration-200
                                          shadow-lg hover:shadow-xl
                                          ${snapshot.isDragging ? "ring-4 ring-primary shadow-2xl z-10" : ""}
                                          ${
                                            mistakes.some(
                                              (m) => m.index === index
                                            ) && showShake
                                              ? "ring-2 ring-destructive animate-shake"
                                              : mistakes.some(
                                                    (m) => m.index === index
                                                  )
                                                ? "ring-2 ring-destructive"
                                                : "ring-1 ring-border hover:ring-2 hover:ring-primary/50"
                                          }
                                        `}
                                        style={provided.draggableProps.style}
                                      >
                                        <div className="w-full h-full">
                                          <Image
                                            src={card.url || ""}
                                            alt={card.description}
                                            fill
                                            className="object-cover transition-opacity duration-200"
                                            sizes="160px"
                                            priority={index < 2}
                                          />
                                        </div>
                                        <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                                          {index + 1}
                                        </div>
                                      </div>
                                    )}
                                  </Draggable>
                                ) : (
                                  <div
                                    className="w-[160px] h-[160px] rounded-xl border-2 border-dashed border-muted flex items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors"
                                    style={{
                                      boxShadow: snapshot.isDraggingOver
                                        ? "0 0 0 2px rgba(var(--primary), 0.3)"
                                        : "none",
                                    }}
                                  >
                                    <span className="text-2xl text-muted-foreground font-medium">
                                      {index + 1}
                                    </span>
                                  </div>
                                )}
                              </div>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>

                    {/* Source Area (Bottom Row) */}
                    <div className="relative">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                      >
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/80 px-3 py-1 rounded-full shadow-sm">
                          <ArrowUp className="w-3 h-3" />
                          <span>Drag cards from here</span>
                        </div>
                      </motion.div>

                      <Droppable droppableId="source" direction="horizontal">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`
                              flex flex-wrap justify-center gap-4 p-6 rounded-xl
                              min-h-[220px] border-2 border-dashed
                              ${snapshot.isDraggingOver ? "bg-primary/5 border-primary/50" : "bg-muted/30 border-muted"}
                              transition-colors duration-200
                            `}
                          >
                            {sourceCards.map((card, index) => (
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
                                      w-[160px] h-[160px] relative 
                                      rounded-xl overflow-hidden
                                      transition-all duration-200
                                      shadow-lg hover:shadow-xl
                                      ${snapshot.isDragging ? "ring-4 ring-primary shadow-2xl z-10" : ""}
                                      ring-1 ring-border hover:ring-2 hover:ring-primary/50
                                    `}
                                    style={provided.draggableProps.style}
                                  >
                                    <div className="w-full h-full">
                                      <Image
                                        src={card.url || ""}
                                        alt={card.description}
                                        fill
                                        className="object-cover transition-opacity duration-200"
                                        sizes="160px"
                                        priority={index < 2}
                                      />
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
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
                      disabled={targetCards.some((card) => card === null)}
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
                    <span>
                      Mistakes: {totalAttempts}/{MAX_ATTEMPTS_PER_STORY}
                    </span>
                    <span>•</span>
                    <span>Level {currentLevel} of 3</span>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showNoteModal && (
        <TeacherNoteModal
          isOpen={showNoteModal}
          onClose={() => setShowNoteModal(false)}
          studentIds={studentIds}
          studentsNames={students
            .map((s) => `${s.fname} ${s.lname}`)
            .join(", ")}
          storyId={storyId}
        />
      )}
    </>
  );
}

// Old game mechanics --

// "use client";

// import { SpeechControls } from "@/components/speech-controls";
// import { Button } from "@/components/ui/button";
// import { TeacherNoteModal } from "@/features/class/components/teacher-note-modal";
// import { Student } from "@/features/students/student-types";
// import { fisherYatesShuffle, validateSequence } from "@/lib/algorithms";
// import { useWindowSize } from "@/lib/hooks/use-window-size";
// import { useGameSounds } from "@/lib/sounds";
// import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
// import { useMutation, useQuery } from "convex/react";
// import { AnimatePresence, motion } from "framer-motion";
// import { Users2Icon } from "lucide-react";
// import Image from "next/image";
// import { useEffect, useState } from "react";
// import ReactConfetti from "react-confetti";
// import { toast } from "sonner";
// import { api } from "../../../../convex/_generated/api";
// import { Id } from "../../../../convex/_generated/dataModel";
// import { QuizSection } from "./quiz-section";

// export interface SequenceCard {
//   url: string | null;
//   id: string;
//   description: string;
//   order: number;
//   level: number;
//   imageId: string;
// }

// interface SequenceGameProps {
//   storyId: Id<"stories">;
//   studentIds: Id<"students">[]; // Changed from single studentId to array
//   sequenceCards: SequenceCard[];
//   students: Student[]; // Changed from single student to array
// }

// const MAX_ATTEMPTS_PER_STORY = 3;

// export function SequenceGame({
//   storyId,
//   sequenceCards,
//   studentIds,
//   students,
// }: SequenceGameProps) {
//   const [currentLevel, setCurrentLevel] = useState(1);
//   const [cards, setCards] = useState<SequenceCard[]>([]);
//   const [mistakes, setMistakes] = useState<
//     Array<{ index: number; expected: number; received: number }>
//   >([]);
//   const [showShake, setShowShake] = useState(false);
//   const [isCompleted, setIsCompleted] = useState(false);
//   const [finalStars, setFinalStars] = useState(0);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [showNoteModal, setShowNoteModal] = useState(false);
//   const [startTime] = useState(Date.now());
//   const [showQuiz, setShowQuiz] = useState(false);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [quizScore, setQuizScore] = useState(0);
//   const [sequenceScore, setSequenceScore] = useState(0);
//   const { width, height } = useWindowSize();
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [shuffledCards, setShuffledCards] = useState<SequenceCard[]>([]);
//   const [attemptsPerLevel, setAttemptsPerLevel] = useState<
//     Record<number, number>
//   >({});
//   const totalAttempts = Object.values(attemptsPerLevel).reduce(
//     (sum, count) => sum + count,
//     0
//   );
//   const [sequenceSlots, setSequenceSlots] = useState<(SequenceCard | null)[]>(
//     []
//   );

//   const quizzes = useQuery(api.quiz.get, { storyId });

//   const currentCards = sequenceCards
//     .filter((card) => card.level === currentLevel)
//     .sort((a, b) => a.order - b.order);

//   const { playSelect, playError, playSuccess, playLevelUp, playComplete } =
//     useGameSounds();

//   // const updateProgress = useMutation(api.progress.updateProgress);
//   const updateMultipleProgress = useMutation(
//     api.progress.updateMultipleProgress
//   );
//   const checkAndAwardAchievements = useMutation(
//     api.achievements.checkAndAwardAchievements
//   );

//   useEffect(() => {
//     const levelCards = sequenceCards.filter(
//       (card) => card.level === currentLevel
//     );
//     const shuffledImages = fisherYatesShuffle(
//       levelCards.map((card) => ({ ...card }))
//     );
//     setCards(shuffledImages);
//     setSequenceSlots(new Array(levelCards.length).fill(null));
//   }, [currentLevel, sequenceCards]);

//   const reshuffleCards = () => {
//     const levelCards = sequenceCards.filter(
//       (card) => card.level === currentLevel
//     );
//     const shuffledImages = fisherYatesShuffle(
//       levelCards.map((card) => ({ ...card, description: "" }))
//     );
//     setShuffledCards(shuffledImages);
//     setCards(shuffledImages);
//   };

//   const handleDragStart = () => {
//     playSelect();
//   };

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const handleDragEnd = (result: any) => {
//     if (!result.destination) return;

//     const { source, destination } = result;

//     // Handle dropping into sequence slots
//     if (destination.droppableId === "sequence-slots") {
//       const newSlots = [...sequenceSlots];
//       const cardIndex = source.index;
//       const slotIndex = destination.index;

//       // Move card to slot
//       newSlots[slotIndex] = cards[cardIndex];
//       setSequenceSlots(newSlots);

//       // Remove card from cards array
//       const newCards = [...cards];
//       newCards.splice(cardIndex, 1);
//       setCards(newCards);

//       playSelect();
//     }

//     // Handle reordering in cards area
//     if (destination.droppableId === "cards") {
//       const items = Array.from(cards);
//       const [reorderedItem] = items.splice(source.index, 1);
//       items.splice(destination.index, 0, reorderedItem);
//       setCards(items);
//       playSelect();
//     }
//   };

//   // const checkSequence = async () => {
//   //   const correctSequence = sequenceCards
//   //     .filter((card) => card.level === currentLevel)
//   //     .sort((a, b) => a.order - b.order);

//   //   const result = validateSequence(cards, correctSequence);
//   //   setMistakes(result.mistakes);

//   //   if (result.isCorrect) {
//   //     playSuccess();
//   //     if (currentLevel === 3) {
//   //       const earnedStars = calculateStars(attempts);
//   //       setFinalStars(earnedStars);
//   //       setShowConfetti(true);
//   //       setTimeout(() => setShowConfetti(false), 5000);
//   //       setIsCompleted(true);
//   //       playComplete();

//   //       // Update this section
//   //       const progress = await updateProgress({
//   //         studentId,
//   //         storyId,
//   //         completed: true,
//   //         sequenceAttempts: attempts,
//   //         sequenceScore: result.score,
//   //         timeSpent: Math.floor((Date.now() - startTime) / 1000),
//   //         stars: earnedStars,
//   //       });

//   //       await checkAndAwardAchievements({
//   //         studentId,
//   //         storyId,
//   //         sequenceScore: result.score,
//   //         timeSpent: Math.floor((Date.now() - startTime) / 1000),
//   //         stars: earnedStars,
//   //       });

//   //       setProgressId(progress);
//   //       setShowNoteModal(true);
//   //       toast.success("Congratulations! You completed all levels!");
//   //     } else {
//   //       playLevelUp();
//   //       toast.success("Level completed! Moving to next level");
//   //       setCurrentLevel((prev) => prev + 1);
//   //     }
//   //   } else {
//   //     playError();
//   //     reshuffleCards();
//   //     setAttempts((prev) => prev + 1);
//   //     setMistakes(result.mistakes);
//   //     setShowShake(true);
//   //     setTimeout(() => setShowShake(false), 1000);
//   //     toast.error("Try again! The sequence is not correct.");
//   //   }
//   // };

//   const calculateSequenceScore = (result: { score: number }) => {
//     return Math.round((result.score / 100) * 50);
//   };

//   const checkSequence = async () => {
//     // Check if max attempts reached
//     if (totalAttempts >= MAX_ATTEMPTS_PER_STORY) {
//       return;
//     }

//     const correctSequence = sequenceCards
//       .filter((card) => card.level === currentLevel)
//       .sort((a, b) => a.order - b.order);

//     const result = validateSequence(cards, correctSequence);
//     setMistakes(result.mistakes);

//     if (result.isCorrect) {
//       playSuccess();
//       if (currentLevel === 3) {
//         const earnedStars = calculateStars(totalAttempts);
//         const calculatedSequenceScore = calculateSequenceScore(result);
//         setSequenceScore(calculatedSequenceScore);
//         setFinalStars(earnedStars);
//         setIsCompleted(true);
//         playComplete();

//         // const progress = await updateProgress({
//         //   studentId: isGroupMode ? undefined : (studentId as Id<"students">),
//         //   groupId: isGroupMode ? group?.id : undefined,
//         //   groupMembers: isGroupMode ? group?.members : undefined,
//         //   storyId,
//         //   completed: true,
//         //   sequenceAttempts: totalAttempts,
//         //   sequenceScore: result.score,
//         //   timeSpent: Math.floor((Date.now() - startTime) / 1000),
//         //   stars: earnedStars,
//         // });

//         // if (isGroupMode && group) {
//         //   await Promise.all(
//         //     group.members.map((member) =>
//         //       checkAndAwardAchievements({
//         //         studentId: member.studentId,
//         //         storyId,
//         //         sequenceScore: result.score,
//         //         timeSpent: Math.floor((Date.now() - startTime) / 1000),
//         //         stars: earnedStars,
//         //       })
//         //     )
//         //   );
//         // }

//         // setProgressId(progress);
//         // setShowNoteModal(true);
//         // toast.success("Congratulations! You completed all levels!");

//         // await updateMultipleProgress({
//         //   studentIds,
//         //   storyId,
//         //   completed: true,
//         //   sequenceAttempts: totalAttempts,
//         //   sequenceScore: calculatedSequenceScore,
//         //   timeSpent: Math.floor((Date.now() - startTime) / 1000),
//         //   stars: earnedStars,
//         //   quizScore: 0, // Initialize with 0
//         //   totalScore: calculatedSequenceScore, // Initially just the sequence score
//         // });

//         await Promise.all(
//           studentIds.map((studentId) =>
//             checkAndAwardAchievements({
//               studentId,
//               storyId,
//               sequenceScore: result.score,
//               timeSpent: Math.floor((Date.now() - startTime) / 1000),
//               stars: earnedStars,
//             })
//           )
//         );

//         toast.success("Game completed! Continue to quiz.");
//       } else {
//         playLevelUp();
//         toast.success("Level completed! Moving to next level");
//         setCurrentLevel((prev) => prev + 1);
//       }
//     } else {
//       playError();
//       reshuffleCards();
//       setMistakes(result.mistakes);
//       setShowShake(true);
//       setTimeout(() => setShowShake(false), 1000);

//       // Only increment attempts on incorrect answers
//       setAttemptsPerLevel((prev) => ({
//         ...prev,
//         [currentLevel]: (prev[currentLevel] || 0) + 1,
//       }));

//       // Check if this attempt maxes out the limit
//       if (totalAttempts + 1 >= MAX_ATTEMPTS_PER_STORY) {
//         setIsCompleted(true);
//         toast.error("Maximum attempts reached. Story ended.");
//       } else {
//         toast.error("Try again! The sequence is not correct.");
//       }
//     }
//   };

//   function calculateStars(attempts: number): number {
//     if (attempts === 0) return 3; // Perfect score
//     if (attempts <= 1) return 2; // 1 mistake
//     return 1; // More than 1 mistake
//   }

//   // const speak = (text: string) => {
//   //   window.speechSynthesis.cancel();

//   //   const utterance = new SpeechSynthesisUtterance(text);

//   //   // Get available voices and select Zira
//   //   const voices = window.speechSynthesis.getVoices();
//   //   const ziraVoice = voices.find(
//   //     (voice) => voice.name === "Microsoft Zira - English (United States)"
//   //   );

//   //   if (ziraVoice) {
//   //     utterance.voice = ziraVoice;
//   //   }

//   //   // Optimize parameters for Zira's voice
//   //   utterance.rate = 0.9; // Slightly slower for better clarity
//   //   utterance.pitch = 1.1; // Slightly higher pitch but not too much
//   //   utterance.volume = 1; // Full volume

//   //   window.speechSynthesis.speak(utterance);
//   // };

//   // Since voices might load after page load, we need to handle that
//   useEffect(() => {
//     function handleVoicesChanged() {
//       window.speechSynthesis.getVoices();
//     }

//     speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged);
//     return () => {
//       speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged);
//     };
//   }, []);

//   return (
//     <>
//       <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-4rem)] relative">
//         {showConfetti && (
//           <ReactConfetti
//             width={width}
//             height={height}
//             recycle={false}
//             numberOfPieces={500}
//             gravity={0.2}
//           />
//         )}

//         <div className="max-w-7xl mx-auto space-y-12">
//           <AnimatePresence mode="wait">
//             {isCompleted ? (
//               !showQuiz ? (
//                 <motion.div
//                   key="completion"
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   className="text-center space-y-8 py-12"
//                 >
//                   <motion.div
//                     initial={{ scale: 0.8, opacity: 0 }}
//                     animate={{ scale: 1, opacity: 1 }}
//                     transition={{ delay: 0.2 }}
//                   >
//                     <h2 className="text-4xl font-bold mb-4">
//                       Game Completed! 🎉
//                     </h2>
//                     <p className="text-xl text-muted-foreground">
//                       Great job! Let&apos;s continue with the quiz.
//                     </p>
//                   </motion.div>

//                   <motion.div
//                     initial={{ y: 20, opacity: 0 }}
//                     animate={{ y: 0, opacity: 1 }}
//                     transition={{ delay: 1.6 }}
//                     className="pt-8"
//                   >
//                     <Button
//                       onClick={() => setShowQuiz(true)}
//                       size="lg"
//                       className="px-8 py-6 text-xl font-semibold rounded-full"
//                     >
//                       Continue to Quiz
//                     </Button>
//                   </motion.div>
//                 </motion.div>
//               ) : (
//                 <QuizSection
//                   quizzes={quizzes || []}
//                   finalStars={finalStars}
//                   onComplete={async (quizScore) => {
//                     setQuizScore(quizScore);
//                     setShowConfetti(true);
//                     setTimeout(() => setShowConfetti(false), 5000);

//                     // Calculate total score (sequence + quiz)
//                     const totalScore = sequenceScore + quizScore;

//                     await updateMultipleProgress({
//                       studentIds,
//                       storyId,
//                       completed: true,
//                       sequenceAttempts: totalAttempts,
//                       sequenceScore: sequenceScore,
//                       quizScore: quizScore,
//                       totalScore: totalScore,
//                       timeSpent: Math.floor((Date.now() - startTime) / 1000),
//                       stars: finalStars,
//                     });

//                     setShowNoteModal(true);

//                     if (quizzes && quizzes.length > 0) {
//                       toast.success("Quiz completed!");
//                     } else {
//                       toast.success(
//                         "All ${students.length} students have been graded!"
//                       );
//                     }
//                   }}
//                 />
//               )
//             ) : (
//               <>
//                 <motion.div
//                   key={`level-${currentLevel}`}
//                   initial={{ opacity: 0, y: -20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 20 }}
//                   transition={{ duration: 0.5 }}
//                   className="text-center space-y-4"
//                 >
//                   {/* {isGroupMode && group && (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="flex items-center justify-center gap-2 mb-4"
//                     >
//                       <Users2Icon className="w-5 h-5 text-primary" />
//                       <span className="font-medium text-primary">
//                         {group.name}
//                       </span>
//                       <span className="text-sm text-muted-foreground">
//                         ({group.members.length} members)
//                       </span>
//                     </motion.div>
//                   )} */}
//                   <div className="flex items-center justify-center gap-2 mb-4">
//                     <Users2Icon className="w-5 h-5 text-primary" />
//                     <span className="font-medium text-primary">
//                       Grading {students.length} student/s
//                     </span>
//                   </div>

//                   <motion.div
//                     className="flex flex-col gap-3 items-center justify-center px-6 py-2 bg-primary/10 rounded-full"
//                     initial={{ scale: 0.8 }}
//                     animate={{ scale: 1 }}
//                     transition={{ delay: 0.2 }}
//                   >
//                     <h2 className="text-3xl font-bold text-primary">
//                       Level {currentLevel}
//                     </h2>

//                     {/* <Button
//                       size="icon"
//                       variant="default"
//                       className="absolute bottom-3 -right-5 w-8 h-8 rounded-full opacity-80 hover:opacity-100"
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         // @ts-expect-error this is correctly-typed
//                         speak(currentCards.map(c => c.description))
//                       }}
//                     >
//                       <Speaker className="w-4 h-4" />
//                     </Button> */}

//                     <SpeechControls
//                       text={currentCards.map((c) => c.description).join(". ")}
//                     />
//                   </motion.div>
//                   <motion.p
//                     className="text-lg text-muted-foreground"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.3 }}
//                   >
//                     Arrange the images in the correct sequence
//                   </motion.p>
//                   <motion.p
//                     className="text-sm text-muted-foreground max-w-2xl mx-auto"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.3 }}
//                   >
//                     {/* {cards.map(card => (card.description + ".")).join('\n')} */}
//                     {/* {sequenceCards.map(s => (s.description + ".")).join('\n')} */}
//                     {currentCards.map((c) => c.description + ".").join("\n")}
//                   </motion.p>
//                   {mistakes.length > 0 && (
//                     <motion.div
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       className="mt-2 text-destructive text-sm font-medium"
//                     >
//                       Found {mistakes.length} incorrect{" "}
//                       {mistakes.length === 1 ? "position" : "positions"}
//                     </motion.div>
//                   )}
//                 </motion.div>

//                 <div className="w-full">
//                   <DragDropContext
//                     onDragEnd={handleDragEnd}
//                     onDragStart={handleDragStart}
//                   >
//                     {/* First row - Sequence slots */}
//                     <div className="grid grid-cols-1 gap-8">
//                       <Droppable
//                         droppableId="sequence-slots"
//                         direction="horizontal"
//                       >
//                         {(provided) => (
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.droppableProps}
//                             className="grid grid-cols-3 gap-4 p-4 bg-muted/20 rounded-lg min-h-[200px]"
//                           >
//                             {sequenceSlots.map((slot, index) => (
//                               <div
//                                 key={`slot-${index}`}
//                                 className={`
//               aspect-square rounded-xl border-2 border-dashed
//               ${slot ? "border-primary/50" : "border-muted-foreground/30"}
//               flex items-center justify-center relative
//               ${mistakes.some((m) => m.index === index) ? "ring-2 ring-destructive" : ""}
//             `}
//                               >
//                                 {slot ? (
//                                   <Image
//                                     src={slot.url || ""}
//                                     alt={slot.description}
//                                     fill
//                                     className="object-cover rounded-lg"
//                                     sizes="180px"
//                                   />
//                                 ) : (
//                                   <motion.div
//                                     initial={{ opacity: 0.5 }}
//                                     animate={{ opacity: 1 }}
//                                     className="text-muted-foreground text-sm"
//                                   >
//                                     Sequence {index + 1}
//                                   </motion.div>
//                                 )}
//                               </div>
//                             ))}
//                             {provided.placeholder}
//                           </div>
//                         )}
//                       </Droppable>

//                       {/* Second row - Shuffled cards */}
//                       <Droppable droppableId="cards" direction="horizontal">
//                         {(provided) => (
//                           <div
//                             ref={provided.innerRef}
//                             {...provided.droppableProps}
//                             className="grid grid-cols-3 gap-4 p-4"
//                           >
//                             {cards.map((card, index) => (
//                               <Draggable
//                                 key={card.id}
//                                 draggableId={card.id}
//                                 index={index}
//                               >
//                                 {(provided, snapshot) => (
//                                   <div
//                                     ref={provided.innerRef}
//                                     {...provided.draggableProps}
//                                     {...provided.dragHandleProps}
//                                     className={`
//                   aspect-square relative rounded-xl overflow-hidden
//                   transition-all duration-200 shadow-lg hover:shadow-xl
//                   ${snapshot.isDragging ? "ring-4 ring-primary shadow-2xl z-10" : ""}
//                   ring-1 ring-border hover:ring-2 hover:ring-primary/50
//                 `}
//                                   >
//                                     <Image
//                                       src={card.url || ""}
//                                       alt={card.description}
//                                       fill
//                                       className="object-cover"
//                                       sizes="180px"
//                                       priority={index < 2}
//                                     />
//                                   </div>
//                                 )}
//                               </Draggable>
//                             ))}
//                             {provided.placeholder}
//                           </div>
//                         )}
//                       </Droppable>
//                     </div>
//                   </DragDropContext>
//                 </div>

//                 <div className="space-y-8">
//                   <motion.div
//                     className="flex justify-center"
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.4 }}
//                   >
//                     <Button
//                       onClick={checkSequence}
//                       size="lg"
//                       className="px-12 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow"
//                     >
//                       Check Sequence
//                     </Button>
//                   </motion.div>

//                   <motion.div
//                     className="flex justify-center gap-6 text-sm text-muted-foreground"
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: 0.5 }}
//                   >
//                     <span>
//                       Mistakes: {totalAttempts}/{MAX_ATTEMPTS_PER_STORY}
//                     </span>
//                     <span>•</span>
//                     <span>Level {currentLevel} of 3</span>
//                   </motion.div>
//                 </div>
//               </>
//             )}

//             {/* {!isCompleted ? (
//               // Game Content

//             ) : (
//               // Completion Content
//               <motion.div
//                 key="completion"
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="text-center space-y-8 py-12"
//               >
//                 <motion.div
//                   initial={{ scale: 0.8, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   transition={{ delay: 0.2 }}
//                 >
//                   <h2 className="text-4xl font-bold mb-4">
//                     {totalAttempts >= MAX_ATTEMPTS_PER_STORY
//                       ? "Story Ended"
//                       : "Story Completed! 🎉"}
//                   </h2>
//                   <p className="text-xl text-muted-foreground">
//                     {totalAttempts >= MAX_ATTEMPTS_PER_STORY
//                       ? "Maximum attempts reached. Try again?"
//                       : "You've successfully arranged all sequences!"}
//                   </p>
//                 </motion.div> */}

//             {/* Only show stars and confetti for successful completion */}
//             {/* {totalAttempts < MAX_ATTEMPTS_PER_STORY && (
//                   <>
//                     {showConfetti && (
//                       <ReactConfetti
//                         width={width}
//                         height={height}
//                         recycle={false}
//                         numberOfPieces={500}
//                         gravity={0.2}
//                       />
//                     )}

//                     <motion.div
//                       initial={{ scale: 0.8, opacity: 0 }}
//                       animate={{ scale: 1, opacity: 1 }}
//                       transition={{ delay: 0.6 }}
//                       className="flex justify-center gap-6 py-8"
//                     >
//                       {[1, 2, 3].map((star) => (
//                         <motion.div
//                           key={star}
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           transition={{ delay: 0.8 + star * 0.2 }}
//                         >
//                           <Star
//                             size={64}
//                             className={cn(
//                               "transition-all duration-300",
//                               star <= finalStars
//                                 ? "fill-yellow-400 text-yellow-400"
//                                 : "fill-gray-200 text-gray-200"
//                             )}
//                           />
//                         </motion.div>
//                       ))}
//                     </motion.div>
//                   </>
//                 )}

//                 <motion.div
//                   initial={{ y: 20, opacity: 0 }}
//                   animate={{ y: 0, opacity: 1 }}
//                   transition={{ delay: 1.6 }}
//                   className="pt-8"
//                 >
//                   <Button
//                     onClick={() => window.location.reload()}
//                     size="lg"
//                     className="px-8 py-6 text-xl font-semibold rounded-full"
//                   >
//                     {totalAttempts >= MAX_ATTEMPTS_PER_STORY
//                       ? "Try Again"
//                       : "Play Again"}
//                   </Button>
//                 </motion.div>
//               </motion.div>
//             )} */}
//           </AnimatePresence>
//         </div>
//       </div>

//       {showNoteModal && (
//         <TeacherNoteModal
//           isOpen={showNoteModal}
//           onClose={() => setShowNoteModal(false)}
//           studentIds={studentIds}
//           studentsNames={students
//             .map((s) => `${s.fname} ${s.lname}`)
//             .join(", ")}
//           storyId={storyId}
//         />
//       )}
//     </>
//   );
// }
