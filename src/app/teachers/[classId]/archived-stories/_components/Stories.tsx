'use client'
import { useArchivedStory } from '@/features/story/api/use-archived-story'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SoundToggle } from '@/components/sound-toggle';
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { StoriesGridSkeleton } from '@/app/admin/list-of-stories/_components/StoriesGridSkeleton';
import { Id } from '../../../../../../convex/_generated/dataModel';


const STORIES_PER_PAGE = 12;

export default function Stories({classId}: {classId: Id<'classes'>}) {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [debouncedSearch, setDebouncedSearch] = useState<string>('')

  const { data: stories, totalPages, isLoading } = useArchivedStory({
    searchQuery: debouncedSearch,
    page: currentPage,
    limit: STORIES_PER_PAGE
})


useEffect(() => {
  const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
      setCurrentPage(1)
  }, 500)

  return () => clearTimeout(timer)
}, [searchQuery])



const handlePageChange = (newPage: number) => {
  setCurrentPage(newPage)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
if (isLoading) {
  return (
      <>
          <Card className="w-full max-w-7xl m-auto">
              <CardHeader className="flex flex-col space-y-4">
                  <div className="flex flex-row items-center justify-between">
                      <CardTitle>Inactive Stories</CardTitle>
                      <SoundToggle />
                  </div>
                  <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                          placeholder="Search stories..."
                          className="pl-8"
                          disabled
                      />
                  </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-6">
                  <ScrollArea className="h-[calc(100vh-300px)]">
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {Array.from({ length: STORIES_PER_PAGE }).map((_, i) => (
                              <StoriesGridSkeleton key={i} />
                          ))}
                      </div>
                  </ScrollArea>
              </CardContent>
          </Card>
      </>
  )
}

return (
  <div className='contents'>
      <Card className="w-full max-w-7xl m-auto">
          <CardHeader className="flex flex-col space-y-4">
              <div className="flex flex-row items-center justify-between">
                  <CardTitle>Stories</CardTitle>
                  <SoundToggle />
              </div>
              <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                      placeholder="Search by title or age group..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                  />
              </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
              <ScrollArea className="h-[calc(100vh-300px)]">
                  {stories.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                          No stories found matching your search
                      </div>
                  ) : (
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {stories.map((story) => (
                              <Link
                                  key={story._id}
                                  href={`/teachers/${classId}/archived-stories/${story._id}`}
                              >
                                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                      <div className="aspect-video relative">
                                          <Image
                                              src={story.imageUrl ?? ""}
                                              alt={story.title}
                                              fill
                                              className="object-cover"
                                          />
                                      </div>
                                      <div className="p-4">
                                          <h3 className="font-semibold text-lg mb-2 text-primary">
                                              {story.title}
                                          </h3>
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                              <span>Age: {story.ageGroup}</span>
                                              <span>•</span>
                                              <span>Difficulty: {story.difficulty}</span>
                                          </div>
                                      </div>
                                  </Card>
                              </Link>
                          ))}
                      </div>
                  )}
              </ScrollArea>
              {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-auto">
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                      >
                          <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center justify-center min-w-[100px]">
                          <span className="text-sm text-muted-foreground">
                              Page {currentPage} of {totalPages}
                          </span>
                      </div>
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                      >
                          <ChevronRight className="h-4 w-4" />
                      </Button>
                  </div>
              )}
          </CardContent>
      </Card>
  </div>
);
}
