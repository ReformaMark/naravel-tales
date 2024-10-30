import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from '@convex-dev/react-query'
import { api } from '../../../../../../../convex/_generated/api'
import { toast } from 'sonner'
import { Id } from '../../../../../../../convex/_generated/dataModel'
export default function SequenceCard({
  id,
  description,
  imageUrl,
  orderNumber,
  level,
  storyId,
}:{
  id: string,
  description: string,
  imageUrl: string,
  orderNumber: number
  level: number,
  storyId: Id<'stories'>
}) {

  const { mutate, isPending } = useMutation({
    mutationFn: useConvexMutation(api.stories.removeSequenceCard),
    onSuccess: () => {
       
       
    },
    onError: () => {
      
    },
})
  const handleRemove = async ()=>{
    try {
      mutate({
        storyId: storyId,
        orderToRemove: orderNumber,
        level: level 
        
    })
    } catch (error: unknown) {
      console.error(error)
      toast.error(error as string)
  }
  
  }
  return (

    <Card>
      <div className="flex justify-end">
        <Button variant={'ghost'} disabled={isPending} onClick={handleRemove}>X</Button>
      </div>
        <CardHeader>
            
            <CardTitle>{id}</CardTitle>
            <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
            <Image src={imageUrl || ""} alt='' width={500} height={500} className='object-contain' />
        </CardContent>
        <CardFooter>
            <h1>Order {orderNumber}</h1>
        </CardFooter>
    </Card>
  )
}