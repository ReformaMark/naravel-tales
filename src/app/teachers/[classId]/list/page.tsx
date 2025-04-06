'use client'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'
import FablesBg from '@/../public/fables.webp'
import LegendsBg from '@/../public/legends.webp'
import {motion} from "framer-motion"
import Link from 'next/link'
import { useParams } from 'next/navigation'

function Page() {
    const { classId} = useParams()
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
        <h1 className='text-center text-lg md:text-2xl font-extrabold uppercase tracking-widest mb-10'>Select a Category</h1>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 min-w-full items-center justify-center'>
            <motion.div 
                className=""
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{scale:1.02}}
                transition={{ duration: 0.1 }}
            >
                <Link href={`/teachers/${classId}/list/category?selected=Fables`}>
                    <Card className='relative p-0 rounded-xl'>
                        <div className='absolute z-30 inset-0 size-full bg-black/35 flex items-center justify-center rounded-xl'>
                            <h1 className='text-6xl text-primary text-center font-extrabold uppercase tracking-wider bg-primary-foreground/90 w-full'>Fables</h1>
                        </div>
                        <div className="s size-96">
                            <Image src={FablesBg} alt='' fill className='object-cover size-full rounded-xl'/>
                        </div>
                    </Card>
                </Link>
            </motion.div>
            <motion.div 
                className=""
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{scale:1.02}}
                transition={{ duration: 0.1 }}
            >
                <Link href={`/teachers/${classId}/list/category?selected=Legends`}>
                    <Card className='relative p-0 rounded-xl'>
                        <div className='absolute z-30 inset-0 size-full bg-black/35 flex items-center justify-center rounded-xl'>
                            <h1 className='text-6xl text-primary text-center font-extrabold uppercase tracking-wider bg-primary-foreground/90 w-full'>Legends</h1>
                        </div>
                        <div className="s size-96">
                            <Image src={LegendsBg} alt='' fill className='object-cover size-full rounded-xl'/>
                        </div>
                    </Card>
                </Link>
            </motion.div>
        </div>
    </div>
  )
}

export default Page