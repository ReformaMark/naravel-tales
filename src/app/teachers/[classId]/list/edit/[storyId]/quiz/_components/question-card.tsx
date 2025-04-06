'use client'
import React, { useState } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { QuizType } from '@/types'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'
import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { api } from '../../../../../../../../../convex/_generated/api'
import { Separator } from '@/components/ui/separator'

interface QuestionCardProps {
  question: QuizType;
  index: number;
}

function QuestionCard({question, index}:QuestionCardProps) {
    const [isEditing, setIsEditing] = useState(false)
    const deleteQuestion = useMutation(api.quiz.remove)
    const editQuiz = useMutation(api.quiz.edit)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [questionText, setQuestionText] = useState(question.question)
    const [answerText, setAnswerText] = useState(question.answer)
    const [points, setPoints] = useState(question.points)

    // Function to handle question text change
    const removeQuestion = () => {
        setIsDeleting(true)
        // Call the deleteQuestion mutation with the question ID
       toast.promise(deleteQuestion({ quizId: question._id }), {
        loading: "Deleting question...",
        success: "Question deleted successfully!",
        error: (err) => `Error: ${err.message}`,
      })
      setIsDeleting(false)
    }

   // Function to handle save changes
    const saveChanges = ()=>{
        setIsSaving(true)
        toast.promise(editQuiz({ 
            quizId: question._id,
            question: questionText,
            answer: answerText,
            points: points,
        }), {
            loading: "Saving changes...",
            success: "Changes saved successfully!",
            error: (err) => `Error: ${err.message}`,
        })

        setIsSaving(false);
        setIsEditing(false);
      
    }

  return (
    <motion.div
        key={question._id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
    >
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center justify-between">
          <span className='text-primary'>Question {index + 1}</span>
          <div className="">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-5 w-5 " />
            </Button>
            <Button variant="ghost" size="icon" disabled={isDeleting} onClick={() => removeQuestion()}>
                <Trash2 className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
    <CardContent className="space-y-4">
      <div>
        {isEditing ? (
        <Textarea
          id={`question-${question._id}`}
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Enter your question"
          className="mt-1"
        />
        ) : (
        <p className="mt-1 text-xl font-semibold">{questionText}</p>
        )}
      </div>
        <Separator/>
      <div className="grid grid-cols-2 gap-x-10">
        <div>
            <Label htmlFor={`answer-${question._id}`} className='text-primary'>Answer<span className='text-red-600'>*</span></Label>
            {isEditing ? (
            <Textarea
            id={`answer-${question._id}`}
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Enter your answer"
            className="mt-1"
            />
            ) : (
            <p className="mt-1">{answerText}</p>
            )}
        </div>
        <div>
            <Label htmlFor={`points-${question._id}`} className='text-primary'>Points: <span className='text-red-600'>*</span></Label>
            {isEditing ? (
            <Input
            id={`points-${question._id}`}
            type="number"
            value={points}
            onChange={(e) => setPoints(Number(e.target.value))}
            placeholder="Enter points"
            className="mt-1"
            />
            ) : (
            <p className="mt-1">{points}</p>
            )}
        </div>
      </div>
      <AnimatePresence>
        {isEditing && (
        <motion.div
          key="buttons"
          className="flex justify-end"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <Button variant="outline" className="gap-2 mr-2" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button disabled={isSaving} variant="default" onClick={saveChanges}>
            Save Changes
          </Button>
        </motion.div>
        )}
      </AnimatePresence>
    </CardContent>
    </Card>
  </motion.div>
  )
}

export default QuestionCard