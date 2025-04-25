'use client'
import React, { useRef, useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url'
import { useMutation } from "@tanstack/react-query"
import { useConvexMutation } from "@convex-dev/react-query"
import { toast } from 'sonner'
import { Label } from '@/components/ui/label'
import { Book, Clock, Feather, PenLine, PlusIcon, Star, UserCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TagInput } from './TagInput'
import { InputWithIcon } from './InputWithIcon'
import { UploadPlaceholder } from './UploadPlaceHolder'
import { ImagePreview } from './ImagePreview'
import { api } from '../../../../../../convex/_generated/api'
import { Id } from '../../../../../../convex/_generated/dataModel'
import { useQuery } from 'convex/react'

interface SequenceCard {
    id: string;
    imageId: string;
    description: string;
    order: number;
    level: number;
}

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    points: number;
}

interface Story {
    title: string;
    content: string;
    author: string;
    categoryId: Id<'storyCategories'> | undefined;
    difficulty: "easy" | "medium" | "hard";
    ageGroup: "3-4" | "4-5" | "5-6";
    image: File | null;
    sequenceCards: SequenceCard[];
    minAge: number;
    maxAge: number;
    readingTime: number; // in minutes
    points: number; // points earned for completion
    tags: string[]; // for cultural themes/values
    quizQuestions: QuizQuestion[];
    culturalNotes: string;
    isActive: boolean;
    createdAt?: number;
    language: Id<'storyLanguages'> | undefined;
}

const storiesInitialData: Story = {
    title: "",
    content: "",
    categoryId: undefined,
    author: "",
    difficulty: "easy",
    ageGroup: "3-4",
    image: null,
    sequenceCards: [],
    minAge: 0,
    maxAge: 0,
    readingTime: 0,
    points: 0,
    tags: [],
    quizQuestions: [],
    culturalNotes: "",
    isActive: false,
    language: undefined,
  };


export default function AddStoriesCard() {
    const [storiesData, setStoriesData] = useState<Story>(storiesInitialData)
    const categories = useQuery(api.storyCategories.getCategories)
    const languages = useQuery(api.storyLanguages.getstoryLanguages)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const { mutate: generateUploadUrl } = useGenerateUploadUrl()

    const fileInputRef = useRef<HTMLInputElement>(null)

    const ageGroup = ["3-4", "4-5","5-6"];
    const difficulty = ["easy" , "medium" , "hard"];

    const { mutate, isPending } = useMutation({
        mutationFn: useConvexMutation(api.stories.createStory),
        onSuccess: () => {
            setStoriesData(storiesInitialData)
            setPreviewUrl(null)
            toast.success('Story added successfully!')
        },
        onError: () => {
            toast.error('Failed to create story!')
        },
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setStoriesData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleAgeGroupChange = (value: "3-4" | "4-5" | "5-6") => {
        setStoriesData((prevData) => ({
            ...prevData,
            ageGroup: value,
        }))
    }
    const handleDifficultyChange = (value: "easy" | "medium" | "hard") => {
        setStoriesData((prevData) => ({
            ...prevData,
            difficulty: value,
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null

        setStoriesData((prevData) => ({
            ...prevData,
            image: file,
        }))

        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setPreviewUrl(null)
        }
    }

    const handleTagsChange = (newTags: string[]) => {
        setStoriesData((prevData) => ({ ...prevData, tags: newTags }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        let storageId: Id<"_storage"> | undefined;
        try {
            if (storiesData.image) {
                const url = await generateUploadUrl({}, {
                    throwError: true
                })
                if (!url) {
                    toast.error('Failed to generate upload URL')
                    return
                }
                const result = await fetch(url, {
                    method: 'POST',
                    body: storiesData.image,
                    headers: {
                        'Content-Type': storiesData.image.type
                    }
                })
                if (!result.ok) {
                    toast.error('Failed to upload image')
                    return
                }
                const { storageId: uploadedStorageId } = await result.json()
                storageId = uploadedStorageId
            }

            await mutate({
                title: storiesData.title,
                content: storiesData.content,
                author: storiesData.author,
                categoryId: storiesData.categoryId,
                difficulty: storiesData.difficulty,
                ageGroup: storiesData.ageGroup,
                imageId: storageId!,
                sequenceCards: storiesData.sequenceCards,
                minAge: Number(storiesData.minAge),
                maxAge:  Number(storiesData.maxAge),
                readingTime:  Number(storiesData.readingTime),
                points:  Number(storiesData.points),
                tags: storiesData.tags,
                quizQuestions: storiesData.quizQuestions,
                culturalNotes: storiesData.culturalNotes,
                isActive: true,
                language: storiesData.language,
                
            })
        } catch (error: unknown) {
            console.error(error)
            toast.error(error as string)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }
  return (
    <Card>
    <CardHeader>
      <CardTitle>Add new Story</CardTitle>
      <CardDescription>Fill Out the form to add new story</CardDescription>
    </CardHeader>
    <CardContent>
    <form id="create-story-form" onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Information Section */}
        <div className="space-y-4">
            <h3 className="w-full text-lg font-semibold text-primary">Basic Information</h3>
            
            <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-primary">Title</Label>
                <div className="relative">
                    <Book className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                    <Input
                        id="title"
                        name="title"
                        value={storiesData.title}
                        onChange={handleInputChange}
                        required
                        className="pl-10 border-primary bg-primary/50 focus:ring-primary"
                        placeholder="Enter title"
                        disabled={isPending}
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium text-primary">Content</Label>
                <Textarea
                    id="content"
                    name="content"
                    value={storiesData.content}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    className="border-primary bg-primary/50 focus:ring-primary"
                    placeholder="Enter the story content..."
                    disabled={isPending}
                />
            </div>
            <div className="grid grid-cols-3 gap-x-5">
                <div className="space-y-2">
                    <Label htmlFor="author" className="text-sm font-medium text-primary">Author</Label>
                    <div className="relative">
                        <PenLine className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                        <Input
                            id="author"
                            name="author"
                            value={storiesData.author}
                            onChange={handleInputChange}
                            required
                            className="pl-10 border-primary bg-primary/50 focus:ring-primary"
                            placeholder="Enter author"
                            disabled={isPending}
                        />
                    </div>
                </div> 
                <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-medium text-primary">Category</Label>
                    <div className="space-y-2">
                        <Select
                            onValueChange={(value) =>
                                setStoriesData((prevData) => ({
                                    ...prevData,
                                    categoryId: value as Id<'storyCategories'>,
                                }))
                            }
                            value={storiesData.categoryId || ""}
                            disabled={isPending}
                        >
                            <SelectTrigger className="border-primary bg-primary/50 focus:ring-primary">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((category) =>(
                                     <SelectItem key={category._id} value={category._id}>{category.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="language" className="text-sm font-medium text-primary">Language</Label>
                    <div className="space-y-2">
                        <Select
                            onValueChange={(value) =>
                                setStoriesData((prevData) => ({
                                    ...prevData,
                                    language: value as Id<'storyLanguages'>,
                                }))
                            }
                            value={storiesData.language || ""}
                            disabled={isPending}
                        >
                            <SelectTrigger className="border-primary bg-primary/50 focus:ring-primary">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages?.map((language) =>(
                                     <SelectItem key={language._id} value={language._id}>{language.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="difficulty" className="text-sm font-medium text-primary">Difficulty</Label>
                    <Select onValueChange={handleDifficultyChange} value={storiesData.difficulty} disabled={isPending}>
                        <SelectTrigger className="border-primary bg-primary/50 focus:ring-primary">
                            <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            {difficulty.map((diff) => (
                                <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="ageGroup" className="text-sm font-medium text-primary">Age Group</Label>
                    <Select onValueChange={handleAgeGroupChange} value={storiesData.ageGroup} disabled={isPending}>
                        <SelectTrigger className="border-primary bg-primary/50 focus:ring-primary">
                            <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                        <SelectContent>
                            {ageGroup.map((age) => (
                                <SelectItem key={age} value={age}>{age}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Additional Number Fields */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <InputWithIcon
                    id="minAge"
                    label="Minimum Age"
                    icon={<UserCheck />}
                    type="number"
                    placeholder="3"
                    value={storiesData.minAge}
                    onChange={handleInputChange}
                    disabled={isPending}
                />
                <InputWithIcon
                    id="maxAge"
                    label="Maximum Age"
                    icon={<UserCheck />}
                    type="number"
                    placeholder="5"
                    value={storiesData.maxAge}
                    onChange={handleInputChange}
                    disabled={isPending}
                />
                <InputWithIcon
                    id="readingTime"
                    label="Reading Time (mins)"
                    icon={<Clock />}
                    type="number"
                    placeholder="5"
                    value={storiesData.readingTime}
                    onChange={handleInputChange}
                    disabled={isPending}
                />
                 <InputWithIcon
                    id="points"
                    label="Points"
                    icon={<Star />}
                    type="number"
                    placeholder="100"
                    value={storiesData.points}
                    onChange={handleInputChange}
                    disabled={isPending}
                />
            </div>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Story Image</h3>
            
            <div className="relative flex h-64 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/50 transition-all hover:bg-primary/70"
                onClick={triggerFileInput}>
                {storiesData.image ? (
                    <ImagePreview image={storiesData.image} />
                ) : (
                    <UploadPlaceholder />
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isPending}
                />
            </div>
        </div>

        {/* Additional Information Section */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Additional Information</h3>

            <div className="space-y-2">
                <Label htmlFor="tags" className="text-sm font-medium text-primary">Tags</Label>
                <TagInput initialTags={storiesData.tags} onTagsChange={handleTagsChange} />
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="culturalNotes" className="text-sm font-medium text-primary">Cultural Notes</Label>
                <div className="relative">
                    <Feather className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                    <Input
                        id="culturalNotes"
                        name="culturalNotes"
                        value={storiesData.culturalNotes}
                        onChange={handleInputChange}
                        required
                        className="pl-10 border-primary bg-primary/50 focus:ring-primary"
                        placeholder="Enter cultural notes"
                        disabled={isPending}
                    />
                </div>
            </div>
        </div>

        </form>

    </CardContent>
    <CardFooter className="flex justify-end space-x-4 bg-gray-50 p-6">
        <Button
            type="submit"
            form="create-story-form"
            className="bg-primary text-white transition-all duration-300 ease-in hover:bg-primary/90"
            disabled={isPending}
        >
            <PlusIcon className="mr-2 h-5 w-5" />
            Add Story
        </Button>
    </CardFooter>
  </Card>
  )
}
