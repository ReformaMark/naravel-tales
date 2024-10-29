import React from 'react'
import Header from '../_components/header'

export default function ArchivedStories() {
    const pages = ["Stories", "Archived Stories"]
  return (
    <>
    <Header breadcrumbPages={pages}/>
    </>
  )
}