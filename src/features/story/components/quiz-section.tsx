import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

interface QuizSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  quizzes: any[];
  onComplete: (score: number) => void;
  finalStars: number;
}

export function QuizSection({
  quizzes,
  onComplete,
  finalStars,
}: QuizSectionProps) {
  const params = useParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizResults, setQuizResults] = useState<{
    score: number;
    totalPoints: number;
    answers: Record<string, { isCorrect: boolean; points: number }>;
  } | null>(null);

  // If there are no quizzes, show completion screen
  if (!quizzes || quizzes.length === 0 || isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto text-center space-y-8 py-12"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold mb-4">Story Completed! 🎉</h2>
          <p className="text-xl text-muted-foreground">
            {quizzes.length === 0
              ? "You've successfully completed the sequence game!"
              : "You've completed both the game and quiz!"}
          </p>
        </motion.div>

        {/* Stars Display */}
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
                className={`transition-all duration-300 ${
                  star <= finalStars
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Quiz Results */}
        {quizResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="max-w-md mx-auto"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Quiz Results</span>
                  <span className="text-xl font-bold text-primary">
                    {Math.round(
                      (quizResults.score / quizResults.totalPoints) * 100
                    )}
                    %
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-1">
                  <p className="text-2xl font-bold text-primary">
                    {quizResults.score} / {quizResults.totalPoints}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
                <div className="space-y-3">
                  {quizzes.map((quiz, index) => (
                    <div
                      key={quiz._id}
                      className={`p-3 rounded-lg text-sm ${
                        quizResults.answers[quiz._id]?.isCorrect
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>Question {index + 1}</span>
                        <span className="font-semibold">
                          {quizResults.answers[quiz._id]?.points} /{" "}
                          {quiz.points} points
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="pt-8 flex gap-4 justify-center"
        >
          {/* <Button
            onClick={() => onComplete(0)}
            size="lg"
            className="px-8 py-6 text-xl font-semibold rounded-full"
          >
            Continue to Teacher Notes
          </Button> */}
          <Button
            asChild
            variant="outline"
            size="lg"
            className="px-8 py-6 text-xl font-semibold rounded-full"
          >
            <Link href={`/teachers/${params.classId}/list/${params.storyId}`}>
              Play Another Story
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // Rest of the quiz UI for when there are quizzes
  const handleSubmit = () => {
    let score = 0;
    let totalPoints = 0;
    const answerResults: Record<
      string,
      { isCorrect: boolean; points: number }
    > = {};

    quizzes.forEach((quiz) => {
      const userAnswer = answers[quiz._id]?.trim().toLowerCase() || "";
      const correctAnswer = quiz.answer.trim().toLowerCase();
      const isCorrect = userAnswer === correctAnswer;

      if (isCorrect) {
        score += quiz.points;
      }
      totalPoints += quiz.points;

      answerResults[quiz._id] = {
        isCorrect,
        points: isCorrect ? quiz.points : 0,
      };
    });

    // Calculate quiz score as percentage out of 50 points
    const quizScoreOutOf50 = Math.round((score / totalPoints) * 50);

    setQuizResults({
      score: quizScoreOutOf50,
      totalPoints: 50,
      answers: answerResults,
    });

    setIsSubmitted(true);
    onComplete(quizScoreOutOf50);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Story Quiz</h2>
        <p className="text-muted-foreground">
          Answer these questions about the story
        </p>
      </div>

      {quizzes.map((quiz, index) => (
        <Card key={quiz._id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Question {index + 1}</span>
              <span className="text-sm text-muted-foreground">
                {quiz.points} points
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{quiz.question}</p>
            <Textarea
              placeholder="Type your answer here..."
              value={answers[quiz._id] || ""}
              onChange={(e) =>
                setAnswers((prev) => ({
                  ...prev,
                  [quiz._id]: e.target.value,
                }))
              }
            />
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center pt-6">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={Object.keys(answers).length < quizzes.length}
        >
          Submit Answers
        </Button>
      </div>
    </motion.div>
  );
}
