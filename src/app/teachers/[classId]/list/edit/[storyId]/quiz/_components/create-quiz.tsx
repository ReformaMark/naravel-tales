"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useMutation } from "convex/react"
import { api } from "../../../../../../../../../convex/_generated/api"
import { Id } from "../../../../../../../../../convex/_generated/dataModel"
import { Input } from "@/components/ui/input"
import { getConvexErrorMessage } from "@/lib/utils"

type Question = {
    id: number;
    question: string;
    answer: string;
    points: number;
}

export default function CreateQuiz() {
    const params = useParams<{ 
        storyId: Id<'stories'>
        classId: Id<'classes'>
        }>()
//   const router = useRouter()
  const createQuiz = useMutation(api.quiz.create)

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      question: "",
      answer: "",
      points: 1
    },
  ])

  const handleQuestionChange = (questionId: number, newText: string) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, question: newText } : q)))
  }

  const handleCorrectAnswerChange = (questionId: number, key:string, answer: string) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, [key]: answer } : q)))
  }
  const handlePointsChange = (questionId: number, key:string, points: string) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, [key]: parseInt(points) } : q)))
  }

//   const addQuestion = () => {
//     const newId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1
//     setQuestions([
//       ...questions,
//       {
//         id: newId,
//         question: "",
//         answer: "",
//         points: 1,
//       },
//     ])
//   }

//   const removeQuestion = (questionId: number) => {
//     if (questions.length > 1) {
//       setQuestions(questions.filter((q) => q.id !== questionId))
//     } else {
//       toast.error("Cannot remove")
//     }
//   }

  const saveQuiz = () => {
    try{
        console.log(questions)
        toast.promise(createQuiz({ storyId: params.storyId, questions }), {
            loading: "Saving...",
            success: "Quiz saved!",
            error: (err) => `${getConvexErrorMessage(err)}`,
        })
        setQuestions([
            {
              id: 1,
              question: "",
              answer: "",
              points: 1
            },
          ])
    }catch (error) {

        toast.error(`Error saving quiz: ${String(error)}`)
    }
  }

  return (
    <div className="container py-8">
    <h1 className="mb-2 text-xl font-bold">Add More Question</h1>
    <p className="mb-2 text-gray-600 text-xs">You can add question for your quiz. Each question should have a text, an answer, and a point value.</p>

      <div className="space-y-6 mt-5">
        {questions.map((question) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader className="pb-0">
                <CardTitle className="flex items-center justify-between ">
                  <span>Question </span>
                 
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div>
                  <Textarea
                    id={`question-${question.id}`}
                    value={question.question}
                    onChange={(e) => handleQuestionChange(question.id, e.target.value)}
                    placeholder="Enter your question"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`answer-${question.id}`}>Answer</Label>
                  <Textarea
                    id={`answer-${question.id}`}
                    value={question.answer}
                    onChange={(e) => handleCorrectAnswerChange(question.id, "answer" ,e.target.value)}
                    placeholder="Enter your answer"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`points-${question.id}`}>Points</Label>
                  <Input
                    id={`points-${question.id}`}
                    type="number"
                    value={question.points}
                    onChange={(e) => handlePointsChange(question.id, "points", e.target.value)}
                    placeholder="Enter points"
                    className="mt-1"
                  />
                </div>
               
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
      
        <Button onClick={saveQuiz} className="gap-2">
          <Save className="h-4 w-4" /> Save
        </Button>
      </div>
    </div>
  )
}

