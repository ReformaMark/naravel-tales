import React from 'react'
import Header from '../_components/header'
import Stories from './_components/Stories'

export default function ArchivedStories() {
    const pages = ["Stories", "Archived Stories"]
   
  return (
    <div>
      <Header breadcrumbPages={pages}/>

      <Stories/>
    </div>
  )
}