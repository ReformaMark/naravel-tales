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
    levelOne?: CardType[]
    onSelect: (level: number) => void
}
export default function LevelOne({storyId ,levelOne, onSelect }:LevelTypStepsProps) {
    const levelOneLength = levelOne?.length
  return (
    <div className='space-y-10 w-full'>
         <div className="grid grid-cols-3 justify-end items-center w-full">
            <div className="">

            </div>
            <div className="text-center">
                <h1 className='text-xl text-center font-extrabold font-serif text-pretty text-primary'>Level 1</h1>
                <p className='text-sm'>{levelOne?.length} out of 3</p>
            </div>
            <div className="flex justify-end">
                <Button className="w-20 self-end" onClick={() => onSelect(1)}>
                    Level 2
                </Button>
            </div>
           
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 justify-center gap-10">
            {levelOne && levelOne?.length === 3 ? levelOne?.map((card)=>(
                <SequenceCard 
                    key={card.id}
                    id={card.id}
                    storyId={storyId}
                    level={1}
                    description={card.description}
                    imageUrl={card.url || ""}
                    orderNumber={card.order}
                />
                
            )): 
            <div className="contents">
                {levelOne?.map((card)=>(
                    <SequenceCard 
                        key={card.id}
                        id={card.id}
                        storyId={storyId}
                        level={1}
                        description={card.description}
                        imageUrl={card.url || ""}
                        orderNumber={card.order}
                    />
                ))}
                {levelOneLength !== undefined && levelOneLength < 3 && (
                    <SequencCardForm storyId={storyId} level={1} order={levelOneLength + 1}/>
                )}
                </div>
            }
        </div>
    </div>
  )
}
