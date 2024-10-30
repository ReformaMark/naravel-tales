'use client'
import React from 'react'
import { Id } from '../../../../../convex/_generated/dataModel'
import Header from '../../_components/header'
import { useeStory } from '@/features/story/api/use-story'
import Image from 'next/image'
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, Feather, List, Shuffle, Star, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
export default function Story({
    params
}:{
    params: {storyId: Id<'stories'>}
}) {
    const {data: story, isLoading} = useeStory({storyId: params.storyId})
    const pages = ["Stories", "list of stories", `${story?.title}`]
    const router = useRouter()
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
                    <Link
                        href={`/admin/list-of-stories/${params.storyId}/image-sequencing`}
                        className="w-full p-3 flex items-center justify-center space-x-2 border rounded-lg bg-primary text-white transition hover:bg-primary/80"
                    >
                        <Shuffle className="text-white" />
                        <span>Set up Image Sequencing Game</span>
                    </Link>
                    <Link
                        href={`/admin/list-of-stories/${params.storyId}/quiz`}
                        className="w-full p-3 flex items-center justify-center space-x-2 border rounded-lg bg-primary text-white transition hover:bg-primary/80"
                    >
                        <List className="text-white" />
                        <span>Add Quiz for Story</span>
                    </Link>
                </div>
            </div>
        </div>
    ) : (
        <div className="text-center text-gray-500">Loading story details...</div>
    )}
</div>

  )
}