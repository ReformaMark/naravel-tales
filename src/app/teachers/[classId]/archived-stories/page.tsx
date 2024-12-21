'use client'
import React from 'react'
import Stories from './_components/Stories'
import Header from '@/app/admin/_components/header'
import { useParams } from 'next/navigation'
import { Id } from '../../../../../convex/_generated/dataModel'

export default function ArchivedStories() {
    const pages = ["Stories", "Archived Stories"]
    const params = useParams<{ classId: Id<'classes'> }>()
  return (
    <div>
      <Header breadcrumbPages={pages}/>
      <Stories classId={params.classId}/>
    </div>
  )
}