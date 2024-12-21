
import React from 'react'
import AddStoriesCard from './_components/add-stories-card'
import Header from '@/app/admin/_components/header'


export default function CreateStories() {
    const pages = ["Stories", "Create Stories"]
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    
    return (
      <>
        <Header breadcrumbPages={pages}/>
        <AddStoriesCard/>
      </>
    )
}
