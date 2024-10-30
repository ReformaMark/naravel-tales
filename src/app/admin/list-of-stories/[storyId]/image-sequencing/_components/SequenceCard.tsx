import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,

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
      <div className="flex justify-between p-4 pb-0">
        <h1 className='text-primary font-bold uppercase'>{id}</h1>
        <Button variant={'ghost'} disabled={isPending} onClick={handleRemove}>X</Button>
      </div>
        <CardHeader>
            <CardDescription>
             <p className=" text-sm truncate">
                {description}
              </p>
            </CardDescription>
        </CardHeader>
        <CardContent>
            <Image src={imageUrl || ""} alt='' width={500} height={500} className='object-cover h-60 w-full shadow-md' />
        </CardContent>
        <CardFooter className='flex justify-center items-center'>
            <h1 className='text-primary text-2xl font-extrabold tracking-wider text-center uppercase'> {orderNumber}</h1>
        </CardFooter>
    </Card>
  )
}