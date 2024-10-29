'use client'

import { useState } from 'react'
import { useMutation } from 'convex/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { api } from '../../../../convex/_generated/api'

export function CreateStoryForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [cards, setCards] = useState<Array<{
    id: string;
    imageUrl: string;
    description: string;
    level: number;
    order: number;
  }>>([])

  const createStory = useMutation(api.stories.createStory)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createStory({
        title,
        content,
        difficulty: "easy",
        ageGroup: "3-4",
        imageUrl: "", // Add image upload
        sequenceCards: cards,
        culturalNotes: "",
        points: 100,
      })
      toast.success('Story created successfully')
    } catch (error) {
      toast.error('Failed to create story')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Add form fields */}
    </form>
  )
}