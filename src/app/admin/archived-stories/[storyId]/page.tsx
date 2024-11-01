'use client'
import React, { useState } from 'react'
import { Id } from '../../../../../convex/_generated/dataModel'
import Header from '../../_components/header'
import { useeStory } from '@/features/story/api/use-story'
import Image from 'next/image'
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, Feather, Star, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { toast } from 'sonner'
import { ResetIcon } from '@radix-ui/react-icons'
export default function Story({
    params
}:{
    params: {storyId: Id<'stories'>}
}) {
    const {data: story, isLoading} = useeStory({storyId: params.storyId})
    const restoreStory =  useMutation(api.stories.restoreStory)
    const [isRestoring, setIsRestoring] = useState<boolean>(false)
    const pages = ["Stories", "list of stories", `${story?.title}`]
    const router = useRouter()

    const handleRestore = async() =>{
        setIsRestoring(true)
        try {
            toast.promise(
                restoreStory({ storyId: params.storyId }),
                {
                    loading: 'Restoring story...',
                    success: 'Story restored successfully',
                    error: 'Failed to restore the story'
                }
            );
            router.replace('/admin/archived-stories')
        } catch (error: unknown) {
            console.log(error)
        }
        setIsRestoring(false)
    }

  return (
    <div className="px-4 space-y-6">
    <Header breadcrumbPages={pages} />

    {!isLoading ? (
        <div className="space-y-6">
            {/* Story Title and Content */}
            <div className="flex items-center justify-center gap-4 max-w-4xl mx-auto">
                <Button
                    size="icon"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">{story?.title}</h2>
                
            </div>
            <p className="text-xl leading-relaxed font-serif text-justify mb-6 last:mb-0">{story?.content}</p>
            {/* Story Image */}
            {story?.url && (
                <Image
                    src={story.url}
                    alt="Story Image preview"
                    width={500}
                    height={500}
                    className="w-full h-64 rounded-lg object-cover"
                />
            )}

            <Separator />

            {/* Story Information */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <UserCheck className="text-primary" />
                        <span className="text-gray-700">Age:</span>
                        <span className="font-semibold text-primary">{story?.ageGroup} years old</span>
                    </div>
                  
                    <div className="flex items-center space-x-2">
                        <Clock className="text-primary" />
                        <span className="text-gray-700">Reading Time:</span>
                        <span className="font-semibold text-primary">{story?.readingTime} mins</span>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Star className="text-primary" />
                        <span className="text-gray-700">Points:</span>
                        <span className="font-semibold text-primary">{story?.points}</span>
                    </div>
                    
                </div>
                <div className="">
                    <div className="flex items-center space-x-2">
                        <Feather className="text-primary" />
                        <h1 className="text-gray-700">Cultural Notes: </h1>
                    </div>
                    <p className='pl-10 text-primary text-justify '>{story?.culturalNotes}</p>
                </div>
            </div>

            <Separator />

            {/* Game Options */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-primary">Interactive Options</h2>
                <div className="space-y-3">
                    
                    <Button
                        variant={'default'}
                        disabled={isRestoring}
                        onClick={handleRestore}
                        className="w-full p-3 flex items-center justify-center space-x-2 border rounded-lg text-white transition hover:bg-primary/80"
                    >
                        <ResetIcon className="text-white" />
                        <span>Restore this story from the list</span>
                    </Button>
                 
                </div>
            </div>
        </div>
    ) : (
        <div className="text-center text-gray-500">Loading story details...</div>
    )}
</div>

  )
}