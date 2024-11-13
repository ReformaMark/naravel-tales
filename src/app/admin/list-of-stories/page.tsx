"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAllStory } from "@/features/story/api/use-all-story";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SoundToggle } from "@/components/sound-toggle";

const STORIES_PER_PAGE = 12;

export default function StoriesListPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [debouncedSearch, setDebouncedSearch] = useState('')

    const { data: stories, totalPages, isLoading } = useAllStory({
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
                <header className="flex h-16 shrink-0 items-center gap-2">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-mut">Stories</BreadcrumbPage>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>List of Stories</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>
                <Card className="w-full max-w-7xl m-auto">
                    <CardHeader className="flex flex-col space-y-4">
                        <div className="flex flex-row items-center justify-between">
                            <CardTitle>Stories</CardTitle>
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
        <>
            <header className="flex h-16 shrink-0 items-center gap-2">
                <div className="flex items-center gap-2 px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-mut">Stories</BreadcrumbPage>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>List of Stories</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
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
                                        href={`/admin//list-of-stories/${story._id}`}
                                    >
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                            <div className="aspect-video relative">
                                                <Image
                                                    src={story.imageUrl || ""}
                                                    alt={story.imageUrl?? ''}
                                                    height={200}
                                                    width={200}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg mb-2 text-primary">
                                                    {story.title}
                                                </h3>
                                                <div className="flex flex-end w-full mb-2">

                                                    <h1 className="bg-primary rounded-xl px-2 py-1 w-fit text-white text-xs text-bold text-right">{story.isActive ? "Active" : "Inactive"}</h1>
                                                </div>
                                              
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
        </>
    );
}

function StoriesGridSkeleton() {
    return (
        <Card className="overflow-hidden">
            <div className="aspect-video bg-muted" />
            <div className="p-4 space-y-2">
                <div className="h-6 w-2/3 bg-muted rounded" />
                <div className="h-4 w-1/2 bg-muted rounded" />
            </div>
        </Card>
    );
}