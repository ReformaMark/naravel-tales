'use client'
import { useQuery } from 'convex/react'
import React, { useEffect, useState } from 'react'
import { api } from '../../../../../../../../../convex/_generated/api'
import { Id } from '../../../../../../../../../convex/_generated/dataModel'
import { useParams } from 'next/navigation'
import {  FileQuestion, Trophy } from 'lucide-react'
import { QuizType } from '@/types'
import QuestionCard from './question-card'
import { Card, CardContent } from '@/components/ui/card'

function QuestionsList() {
    const params = useParams<{ 
        storyId: Id<'stories'>
        classId: Id<'classes'>
    }>()
 
    // Fetch quiz questions using the useQuery hook
    const quizQuestions = useQuery(api.quiz.get, {storyId: params.storyId})
    const [questions, setQuestions] = useState<QuizType[] | []>(quizQuestions ?? [])

    useEffect(() => {
        if(quizQuestions) {
            // Update the questions state when quizQuestions changes    
            setQuestions(quizQuestions)
        }
    }, [quizQuestions])


    // Function to calculate the total points of all questions
    const calculateTotalPoints = () => {
        return questions.reduce((total, question) => total + (question.points || 0), 0)
    }

    const totalPoints = calculateTotalPoints()

if (!questions || questions.length === 0) {
    return (
        <>
        <div className="flex items-center justify-between">
            <h1 className=' flex gap-x-3 items-center text-lg md:text-2xl font-bold '><FileQuestion className="text-primary " /> Total Questions: {quizQuestions?.length}</h1>
            <h1 className=' flex gap-x-3 items-center text-lg md:text-2xl font-bold '><Trophy className="text-yellow-300 " /> Total Points: {totalPoints}</h1>

        </div>
        <div className="space-y-6"></div>
        <Card className='mt-10'>
            <CardContent className='min-h-36 bg-gray-50/20 flex items-center justify-center' >
                <div className=''>
                    <h1 className="text-center text-gray-500">
                        There are no questions right now. Please add new questions by filling out the form on the right.
                    </h1>
                </div>
            </CardContent>
        </Card>
        </>
    )
}

  return (
    <div className='space-y-6'>
        <div className="flex items-center justify-between">
            <h1 className=' flex gap-x-3 items-center text-lg md:text-2xl font-bold '><FileQuestion className="text-primary " /> Total Questions: {quizQuestions?.length}</h1>
            <h1 className=' flex gap-x-3 items-center text-lg md:text-2xl font-bold '><Trophy className="text-yellow-300 " /> Total Points: {totalPoints}</h1>

        </div>
        <div className="space-y-6">
        {questions && questions.map((question, index) => (
            <QuestionCard key={question._id} question={question} index={index}/>
        ))}
        </div>
      
    </div>
  )
}

export default QuestionsList