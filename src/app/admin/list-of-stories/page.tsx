import React from 'react'
import Header from '../_components/header'

export default function ListOfStories() {
    const pages = ["Stories", "Create Stories"]
    return (
      <>
      <Header breadcrumbPages={pages}/>
      </>
    )
}
