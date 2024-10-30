'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { Id } from '../../../../convex/_generated/dataModel'
import { StudentSelectDialog } from './student-select-dialog'

export interface StoryReaderProps {
    story: {
        _id: Id<"stories">;
        title: string;
        content: string;
        url: string;
    }
}

export function StoryReader({ story, classId }: StoryReaderProps & { classId: Id<"classes"> }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <Card className="overflow-hidden">
                <div className="aspect-video relative">
                    <Image
                        src={story.url}
                        alt={story.title}
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="p-6 space-y-4">
                    <h1 className="text-2xl font-bold">{story.title}</h1>
                    <p className="text-lg leading-relaxed">{story.content}</p>
                    <Button
                        onClick={() => setIsDialogOpen(true)}
                        className="w-full"
                    >
                        Start Playing
                    </Button>
                </div>
            </Card>

            <StudentSelectDialog 
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                classId={classId}
                storyId={story._id}
            />
        </div>
    )
}