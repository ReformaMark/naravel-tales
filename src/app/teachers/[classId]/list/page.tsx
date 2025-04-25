'use client'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'
import {motion} from "framer-motion"
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'

function Page() {
    const { classId} = useParams()
    const categories = useQuery(api.storyCategories.getCategories)
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className='text-center text-lg md:text-2xl font-extrabold uppercase tracking-widest mb-10'>Select a Category</h1>
      
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 min-w-full items-center justify-center'>
            {categories && categories.map((category)=>(
                <motion.div 
                    key={category._id}
                    className=""
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{scale:1.02}}
                    transition={{ duration: 0.1 }}
                >
                    <Link href={`/teachers/${classId}/list/category?selected=${category.name}`}>
                        <Card className='relative p-0 rounded-xl'>
                            <div className='absolute z-30 inset-0 size-full bg-black/35 flex items-center justify-center rounded-xl'>
                                <h1 className='text-6xl text-primary text-center font-extrabold uppercase tracking-wider bg-primary-foreground/90 w-full'>{category.name}</h1>
                            </div>
                            <div className="s size-96">
                                <Image src={category.imageUrl || ""} alt='' fill className='object-cover size-full rounded-xl'/>
                            </div>
                        </Card>
                    </Link>
                </motion.div>
             ))}
        </div>
   
        
    </div>
  )
}

export default Page