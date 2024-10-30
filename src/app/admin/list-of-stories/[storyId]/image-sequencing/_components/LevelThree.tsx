'use client'
import React from 'react'
import SequencCardForm from './SequencCardForm'
import SequenceCard from './SequenceCard'
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';

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
    levelThree?: CardType[]
    onSelect: (level: number) => void
}
export default function LevelThree({storyId ,levelThree, onSelect }:LevelTypStepsProps) {
  return (
    <div className='space-y-10 w-full'>
       <div className="grid grid-cols-3 justify-end items-center w-full">
            <div className="flex justify-start">
                <Button className="w-20" onClick={() => onSelect(1)}>
                    Level 2
                </Button>
            </div>
            <div className="text-center">
                
                <h1 className='text-lg text-center font-extrabold font-serif text-pretty text-primary'>Level 3</h1>
                <p className='text-sm'>{levelThree?.length} out of 5</p>
            </div>
            <div className="">

            </div>
        </div>
        
        <div className="grid grid-cols-3 gap-x-10">
            {levelThree && levelThree?.length === 5 ? levelThree?.map((card)=>(
                <SequenceCard 
                    key={card.id}
                    id={card.id}
                    storyId={storyId}
                    level={3}
                    description={card.description}
                    imageUrl={card.url || ""}
                    orderNumber={card.order}
                />
                
            )): 
            <div className="contents">
                {levelThree?.map((card)=>(
                    <SequenceCard 
                        key={card.id}
                        id={card.id}
                        storyId={storyId}
                        level={3}
                        description={card.description}
                        imageUrl={card.url || ""}
                        orderNumber={card.order}
                    />
                ))}
                {levelThree && (
                    <SequencCardForm storyId={storyId} level={3} order={levelThree.length + 1}/>
                )}
                </div>
            }
        </div>
    </div>
  )
}
