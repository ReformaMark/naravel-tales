
import React from 'react'
import Header from '../_components/header'
import AddStoriesCard from './_components/add-stories-card'


export default function CreateStories() {
    const pages = ["Stories", "Create Stories"]
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    
    return (
      <>
        <Header breadcrumbPages={pages}/>

        {/* <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div> */}

        <AddStoriesCard/>
      </>
    )
}
