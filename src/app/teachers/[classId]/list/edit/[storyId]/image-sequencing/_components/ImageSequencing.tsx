'use client'
import React, { useState } from 'react'
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// // } from "@/components/ui/card"
// import Image from 'next/image'
import Header from '@/app/admin/_components/header'
import { useParams } from 'next/navigation'
import { useeStory } from '@/features/story/api/use-story'
import { ProgressFooter } from '@/features/auth/components/progress-footer'
import LevelOne from './LevelOne'
import LevelTwo from './LevelTwo'
import LevelThree from './LevelThree'
import { Id } from '../../../../../../../../../convex/_generated/dataModel'

function Sequencing() {
    const [currentStep, setCurrentStep] = useState(0)
    const params = useParams<{ 
        storyId: Id<'stories'>
        classId: Id<'classes'>
     }>()
    const { data: story } = useeStory({ storyId: params.storyId })
    const sequenceCards = story?.sequenceCards
    const levels = [1,2,3] 
    const levelOne = sequenceCards?.filter(card => card.level === 1)
    const levelTwo = sequenceCards?.filter(card => card.level === 2)
    const levelThree = sequenceCards?.filter(card => card.level === 3)
 
    const pages = ["Stories", "List of Stories", `${story?.title}`, "Image Sequencing"]
    

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleLevelChange = (level: number) => {
        setCurrentStep(level)
    }

    const renderStep = () => {
        switch (levels[currentStep]) {
            case 1:
                return <LevelOne storyId={params.storyId} levelOne={levelOne} onSelect={handleLevelChange} />
            case 2:
                return <LevelTwo storyId={params.storyId} levelTwo={levelTwo} onSelect={handleLevelChange} />
            case 3:
                return <LevelThree storyId={params.storyId} levelThree={levelThree} onSelect={handleLevelChange} classId={params.classId} />
            default:
                return null
        }
    }

    return (
        <div className='contents'>
            <Header breadcrumbPages={pages} />

            <main className="w-full p-4">
                {renderStep()}
            </main>
            <ProgressFooter
                currentStep={currentStep}
                totalSteps={levels.length}
                onBack={handleBack}
                showBack={currentStep > 0}
            />
        </div>
    )
}

export default Sequencing
