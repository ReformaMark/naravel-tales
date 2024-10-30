'use  client'
import React, { useRef, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ImagePreview } from '@/app/admin/create-stories/_components/ImagePreview'
import { UploadPlaceholder } from '@/app/admin/create-stories/_components/UploadPlaceHolder'
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from '@convex-dev/react-query'
import { api } from '../../../../../../../convex/_generated/api'
import { Id } from '../../../../../../../convex/_generated/dataModel'
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url'
import { toast } from 'sonner'
import {
    Card,
    CardContent,
    CardFooter,
  } from "@/components/ui/card"

interface SequenceCardTypes {

    image: File | null
    description: string
    level: number
}




function SequencCardForm({
    level,
   
    storyId
}:{
    level:number,
    order: number,
    storyId: Id<'stories'>
}) {


    

    const initialSequanceCardValue: SequenceCardTypes = {
        image: null,
        description: '',
        level
    }

    const [sequenceCard, setSequenceCard] = useState<SequenceCardTypes>(initialSequanceCardValue) 
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { mutate: generateUploadUrl } = useGenerateUploadUrl()
    const [, setPreviewUrl] = useState<string | null>(null)

   

    const { mutate, isPending } = useMutation({
        mutationFn: useConvexMutation(api.stories.addSequenceCards),
        onSuccess: () => {
            setSequenceCard(initialSequanceCardValue)
            setPreviewUrl(null)
           
        },
        onError: () => {
            setSequenceCard(initialSequanceCardValue)
        },
    })


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setSequenceCard((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null

        setSequenceCard((prevData) => ({
            ...prevData,
            image: file,
        }))

        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setPreviewUrl(null)
        }
    }

    
    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        let storageId: Id<"_storage"> | undefined;

        try {
            if (sequenceCard.image) {
                const url = await generateUploadUrl({}, {
                    throwError: true
                })

                if (!url) {
                    toast.error('Failed to generate upload URL')
                    return
                }

                const result = await fetch(url, {
                    method: 'POST',
                    body: sequenceCard.image,
                    headers: {
                        'Content-Type': sequenceCard.image.type
                    }
                })

                if (!result.ok) {
                    toast.error('Failed to upload image')
                    return
                }

                const { storageId: uploadedStorageId } = await result.json()

                storageId = uploadedStorageId
            }

            mutate({
                storyId: storyId,
                description: sequenceCard.description,
                level: sequenceCard.level,
                imageId: storageId!
                
            })
        } catch (error: unknown) {
            console.error(error)
            toast.error(error as string)
        }
    }

   
  return (
    <Card>
        <form id='sequence-card-form' onSubmit={handleSubmit} >        
            <CardContent>
                <div className="space-y-2 mt-2">
                    <Textarea
                        name="description"
                        placeholder="Description"
                        value={sequenceCard.description}
                        onChange={handleInputChange}
                        className="border p-2 "
                        required
                    />
                    <div className="relative flex h-64 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/50 transition-all hover:bg-primary/70"
                        onClick={triggerFileInput}>
                        {sequenceCard.image ? (
                            <ImagePreview image={sequenceCard.image} />
                        ) : (
                            <UploadPlaceholder />
                        )}
                        <Input
                            ref={fileInputRef}
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isPending}
                        />
                    </div>
                
                    
                </div>
            </CardContent>
        <CardFooter>
            <Button
                type="submit"
                form="sequence-card-form"
                className="bg-primary text-white transition-all duration-300 ease-in hover:bg-primary/90"
                disabled={isPending}
            >
                Add Card
            </Button>
        </CardFooter>
        </form>
    </Card>
    
  )
}

export default SequencCardForm