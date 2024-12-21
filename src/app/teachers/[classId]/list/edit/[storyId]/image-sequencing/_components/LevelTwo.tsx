'use client'
import React from 'react'
import SequencCardForm from './SequencCardForm'
import SequenceCard from './SequenceCard'
import { Button } from '@/components/ui/button';
import { Id } from '../../../../../../../../../convex/_generated/dataModel';

interface CardType {
    url: string | null;
    id: string;
    description: string;
    order: number;
    level: number;
    imageId: string;
}

interface LevelTypStepsProps {
    storyId: Id<'stories'>
    levelTwo?: CardType[]
    onSelect: (level: number) => void
}
export default function LevelTwo({storyId ,levelTwo, onSelect }:LevelTypStepsProps) {
  return (
    <div className='space-y-10 w-full'>
       <div className="grid grid-cols-3 justify-end items-center w-full">
            <div className="flex justify-start">
                <Button className="w-20" onClick={() => onSelect(0)}>
                    Level 1
                </Button>
            </div>
            <div className="text-center">
                <h1 className='text-lg text-center  font-extrabold font-serif text-pretty text-primary'>Level 2</h1>
                <p className='text-sm'>{levelTwo?.length} out of 4</p>
            </div>
           
            <div className="flex justify-end">
            <Button className="w-20" onClick={() => onSelect(2)}>
                Level 3
            </Button>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-10">
            {levelTwo && levelTwo?.length === 4 ? levelTwo?.map((card)=>(
                <SequenceCard 
                    key={card.id}
                    id={card.id}
                    storyId={storyId}
                    level={2}
                    description={card.description}
                    imageUrl={card.url || ""}
                    orderNumber={card.order}
                />
                
            )): 
            <div className="contents">
                {levelTwo?.map((card)=>(
                    <SequenceCard 
                        key={card.id}
                        id={card.id}
                        storyId={storyId}
                        level={2}
                        description={card.description}
                        imageUrl={card.url || ""}
                        orderNumber={card.order}
                    />
                ))}
                {levelTwo && (
                    <SequencCardForm storyId={storyId} level={2} order={levelTwo.length + 1}/>
                )}
                </div>
            }
        </div>
    </div>
  )
}
