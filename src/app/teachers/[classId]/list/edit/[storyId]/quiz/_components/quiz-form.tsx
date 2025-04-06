'use client'
import Header from '@/app/admin/_components/header'
import { useParams } from 'next/navigation'
import React from 'react'
import { Id } from '../../../../../../../../../convex/_generated/dataModel'
import { useeStory } from '@/features/story/api/use-story'
import CreateQuiz from './create-quiz'
import QuestionsList from './questions-list'
import { Card, CardContent } from '@/components/ui/card'

function QuizForm() {
    const params = useParams<{ 
        storyId: Id<'stories'>
        classId: Id<'classes'>
     }>()
    const { data: story } = useeStory({ storyId: params.storyId })
    const pages = ["Stories", "List of Stories", `${story?.title}`, "Quiz"]
  return (
    <div>
        <Header breadcrumbPages={pages} />
        <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-8">
                <QuestionsList />
            </div>
            <Card className="col-span-12 lg:col-span-4">
                <CardContent>
                    <CreateQuiz/>
                </CardContent>
            </Card>
        </div>
       
    </div>
  )
}

export default QuizForm