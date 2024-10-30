'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { Id } from '../../../../convex/_generated/dataModel'
import { StudentSelectDialog } from './student-select-dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

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
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <Card className="overflow-hidden bg-card/50 backdrop-blur-sm shadow-xl min-h-[80vh] relative">
                <div className="flex flex-col h-full">

                    <div className="px-8 pb-4 pt-4">
                        <div className="relative w-full aspect-video max-h-[400px]">
                            <Image
                                src={story.url}
                                alt={story.title}
                                fill
                                className="object-cover rounded-lg"
                                priority
                            />
                        </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                        <ScrollArea className="flex-1 pr-6">
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                {story.content.split('\n\n').map((paragraph, index) => (
                                    <p key={index} className="text-xl leading-relaxed font-serif text-justify mb-6 last:mb-0">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </ScrollArea>

                        <div className="pt-6 border-t mt-6">
                            <Button
                                onClick={() => setIsDialogOpen(true)}
                                className="w-full text-lg py-6 font-semibold"
                                size="lg"
                            >
                                Start Reading Journey
                            </Button>
                        </div>
                    </div>
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