import React, { Suspense } from 'react'
import Header from '../_components/header'
import { StoriesGrid } from './_components/StoriesGrid'
import { StoriesGridSkeleton } from './_components/StoriesGridSkeleton'

export default function ListOfStories() {
    const pages = ["Stories", "Create Stories"]
    return (
      <>
        <Header breadcrumbPages={pages}/>
        <div className="flex-1 space-y-4 p-4 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Stories</h2>
            </div>
            <Suspense fallback={<StoriesGridSkeleton />}>
                <StoriesGrid  />
            </Suspense>
        </div> 
      </>
    )
}
