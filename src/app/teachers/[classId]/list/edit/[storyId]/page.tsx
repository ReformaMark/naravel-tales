'use client'
import React, {  useRef, useState } from 'react'
import { useeStory } from '@/features/story/api/use-story'
import Image from 'next/image'
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Clock, Edit, Feather, Shuffle, Star, Tag, Trash2, Trophy, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { useMutation as useMutationQ } from "@tanstack/react-query"
import { toast } from 'sonner'
import { useConvexMutation } from '@convex-dev/react-query'
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Select } from '@radix-ui/react-select'
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Id } from '../../../../../../../convex/_generated/dataModel'
import { api } from '../../../../../../../convex/_generated/api'
import Header from '@/app/admin/_components/header'
import { ImagePreview } from '../../../create-stories/_components/ImagePreview'
import { UploadPlaceholder } from '../../../create-stories/_components/UploadPlaceHolder'
import { TagInput } from '../../../create-stories/_components/TagInput'
import { Badge } from '@/components/ui/badge'

interface Story {
    title: string;
    content: string;
    author: string;
    categoryId: Id<'storyCategories'> | undefined;
    language: Id<'storyLanguages'> | undefined;
    difficulty: "easy" | "medium" | "hard";
    ageGroup: "3-4" | "4-5" | "5-6";
    image:  File | string | null;
   
    minAge: number;
    maxAge: number;
    readingTime: number; // in minutes
    points: number; // points earned for completion
    tags: string[]; // for cultural themes/values
   
    culturalNotes: string;
    isActive: boolean;
    createdAt?: number;
}


export default function Story({
    params
}:{
    params: {
        storyId: Id<'stories'>
        classId: Id<'classes'>
    }
}) {
    const {data: story, isLoading} = useeStory({storyId: params.storyId})
    const archivedStory =  useMutation(api.stories.archiveStories);
    const categories = useQuery(api.storyCategories.getCategories)
    const languages = useQuery(api.storyLanguages.getstoryLanguages)
    const initialData : Story = {
        title: story?.title || "",
        content: story?.content || "",
        author: story?.author || "",
        categoryId: story?.categoryDoc?._id,
        language: story?.language,
        difficulty: story?.difficulty || "easy",
        ageGroup: story?.ageGroup || "3-4",
        image: story?.url || null,
     
        minAge: story?.minAge || 0,
        maxAge: story?.maxAge || 0,
        readingTime: story?.readingTime || 0,
        tags: story?.tags || [],
       
        culturalNotes: story?.culturalNotes || "",
        points: story?.points || 0,
        isActive: true
    }
    const { mutate: generateUploadUrl } = useGenerateUploadUrl()
    const ageGroup = ["3-4", "4-5","5-6"];
    const difficulty = ["easy" , "medium" , "hard"];

    const [, setPreviewUrl] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)
 

    const [isEditing, setIsEditing] = useState<boolean>(false);

    const [editedValues, setEditedValues] = useState<Story>(initialData);
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const pages = ["Stories", "list of stories", `${story?.title}`]
    const router = useRouter()

    const { mutate, isPending } = useMutationQ({
        mutationFn: useConvexMutation(api.stories.editStory),
        onSuccess: () => {
            setEditedValues(initialData)
            setPreviewUrl(null)
            toast.success('Story edited successfully!')
            setIsEditing(false)
        },
        onError: () => {
            toast.error('Failed to create story!')
        },
    })

    const handleArchived = () =>{
        setIsDeleting(true)
        try {
            toast.promise(
                archivedStory({ storyId: params.storyId }),
                {
                    loading: 'Deleting story...',
                    success: 'Story deleted successfully',
                    error: 'Failed to delete the story'
                }
            );
            router.replace('/teachers/'+params.classId+'/list')
        } catch (error: unknown) {
            console.log(error)
        }

        setIsDeleting(false)
    }


    const handleEditToggle = () => {
        setIsEditing(true);
        setEditedValues(
            {
                title: story?.title || "",
                content: story?.content || "",
                author: story?.author || "",
                categoryId: story?.categoryDoc?._id,
                language: story?.language,
                difficulty: story?.difficulty || "easy",
                ageGroup: story?.ageGroup || "3-4",
                image: story?.url || null,
                
                minAge: story?.minAge || 0,
                maxAge: story?.maxAge || 0,
                readingTime: story?.readingTime || 0,
                tags: story?.tags || [],
               
                culturalNotes: story?.culturalNotes || "",
                points: story?.points || 0,
                isActive: true
            }
        )
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        let storageId: Id<"_storage"> | undefined;

        try {
            if (editedValues.image instanceof File) {
                const url = await generateUploadUrl({}, {
                    throwError: true
                })

                if (!url) {
                    toast.error('Failed to generate upload URL')
                    return
                }

                const result = await fetch(url, {
                    method: 'POST',
                    body: editedValues.image,
                    headers: {
                        'Content-Type': editedValues.image instanceof File ? editedValues.image.type : 'application/json'
                    }
                })

                if (!result.ok) {
                    toast.error('Failed to upload image')
                    return
                }

                const { storageId: uploadedStorageId } = await result.json()

                storageId = uploadedStorageId
            }

            
            console.log( editedValues.language)
                mutate({
                    storyId: params.storyId,
                    title: editedValues.title,
                    categoryId: editedValues.categoryId,
                    languageId: editedValues.language,
                    author: editedValues.author,
                    content: editedValues.content,
                    difficulty: editedValues.difficulty,
                    imageId: storageId,
                    ageGroup: editedValues.ageGroup,
                    minAge: Number(editedValues.minAge),
                    maxAge:  Number(editedValues.maxAge),
                    readingTime:  Number(editedValues.readingTime),
                    points:  Number(editedValues.points),
                    tags: editedValues.tags,
                    culturalNotes: editedValues.culturalNotes,
                    isActive: true,
                    
                })
           

        } catch (error: unknown) {
            console.error(error)
            toast.error(error as string)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        setEditedValues((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleCancel = () =>{
        setIsEditing(false)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null

        setEditedValues((prevData) => ({
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

    const handleAgeGroupChange = (value: "3-4" | "4-5" | "5-6") => {
        setEditedValues((prevData) => ({
            ...prevData,
            ageGroup: value,
        }))
    }
    const handleCategoryChange = (value: string) => {
        setEditedValues((prevData) => ({
            ...prevData,
            categoryId: value as Id<'storyCategories'>,
        }))
    }
    const handleLanguageChange = (value: string) => {
        setEditedValues((prevData) => ({
            ...prevData,
            language: value as Id<'storyLanguages'>,
        }))
    }

    const handleDifficultyChange = (value: "easy" | "medium" | "hard") => {
        setEditedValues((prevData) => ({
            ...prevData,
            difficulty: value,
        }))
    }

    const handleTagsChange = (newTags: string[]) => {
        setEditedValues((prevData) => ({ ...prevData, tags: newTags }));
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

  return (
    <div className=" space-y-6 pb-10">
    <Header breadcrumbPages={pages} />

    {!isLoading ? (
        <div className="space-y-6">
            {/* Story Title and Content */}
            
            <div className="grid grid-cols-12 items-center justify-between ">
              
                <div className="col-span-12 lg:col-span-8 flex items-center gap-x-4 ">
                    <Button
                        size="icon"
                        onClick={() => router.back()}
                        >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    {isEditing ? (
                        <Input
                        id="title"
                        name="title"
                        value={editedValues?.title}
                        onChange={handleInputChange}
                        required
                        className=" border-primary bg-primary/50 focus:ring-primary w-fit"
                        placeholder="Enter title"
                        disabled={isPending}
                    />
                    ):(
                        <h2 className="text-3xl font-bold tracking-tight">{story?.title}</h2>

                    )}
                </div>
                
                {!isEditing && (
                <div className="col-span-12 lg:col-span-4  flex justify-end ">
                    <Edit onClick={handleEditToggle} className='text-gray-500 cursor-pointer' />
                </div>
                )}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gapx-x-10">
                {isEditing ? (
                    <div className=" flex items-center gap-3 ">
                        Author:
                        <Input
                            id="author"
                            name="author"
                            value={editedValues?.author}
                            onChange={handleInputChange}
                            required
                           className="border-primary bg-primary/50 focus:ring-primary md:w-1/2"
                            placeholder="Enter author"
                            disabled={isPending}
                        />
                    </div>
                    ):(
                        <h2 className="text-lg font-semibold tracking-tight">Author: <Badge > {story?.author ?? "-"}</Badge></h2>

                )}
                {isEditing ? (
                    <div className=" flex items-center gap-3">
                        Category:
                        <Select 
                            onValueChange={(value) =>{ 
                                handleCategoryChange(value)
                                console.log(value)
                            }}
                            value={editedValues?.categoryId}
                            disabled={isPending}
                        >
                            <SelectTrigger className="border-primary bg-primary/50 focus:ring-primary md:w-1/2">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((category) =>(
                                    <SelectItem key={category._id} value={category._id} className='capitalize'>{category.name}</SelectItem>
                                ))}
                        </SelectContent>
                        </Select>
                    </div>
                    ):(
                        <h2 className="text-lg font-semibold tracking-tight">Category: <Badge >{story?.categoryDoc?.name ?? "-"}</Badge></h2>

                )}
                {isEditing ? (
                    <div className=" flex items-center gap-3">
                        Language:
                        <Select 
                            onValueChange={(value) =>{ 
                                handleLanguageChange(value)
                            }}
                            value={editedValues?.language}
                            disabled={isPending}
                        >
                            <SelectTrigger className="border-primary bg-primary/50 focus:ring-primary md:w-1/2">
                                <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent>
                                {languages?.map((language) =>(
                                    <SelectItem key={language._id} value={language._id} className='capitalize'>{language.name}</SelectItem>
                                ))}
                        </SelectContent>
                        </Select>
                    </div>
                    ):(
                        <h2 className="text-lg font-semibold tracking-tight capitalize">Language: <Badge >{story?.languageDoc?.name ?? "-"}</Badge></h2>

                )}
            </div>
            {isEditing ? (
            <div className="space-y-2">
                <Textarea
                    id="content"
                    name="content"
                    value={editedValues?.content}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    className="border-primary bg-primary/50 focus:ring-primary"
                    placeholder="Enter the story content..."
                    disabled={isPending}
                />
            </div>
            ):(
                <pre className="text-xl whitespace-pre-wrap leading-relaxed font-serif text-justify mb-6 last:mb-0">{story?.content}</pre>
            )}
            {/* Story Image */}
          
               <>
               {isEditing ? (
                <div className="relative flex h-64 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/50 transition-all hover:bg-primary/70"
                    onClick={triggerFileInput}>
                    {editedValues.image ? (
                        <>
                        {editedValues.image instanceof File ? (
                            <ImagePreview image={editedValues?.image||null} />
                        ) : (
                            <Image
                                src={editedValues?.image || ''}
                                alt="Story Image preview"
                                width={500}
                                height={500}
                                className="w-full h-64 rounded-lg object-cover"
                            />
                        )}
                        </>
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
               ):(
                <Image
                    src={story?.url || ''}
                    alt="Story Image preview" 
                    width={500}
                    height={500}
                    className="w-full h-64 rounded-lg object-cover"
                    />  
              
               )}
            </> 
            <Separator />
        
            {/* Story Information */}
            <div className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-10 justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <UserCheck className="text-primary" />
                        <span className="text-gray-700 w-1/2 md:w-fit">Age:</span>
                        {isEditing ? (
                             <Select onValueChange={handleAgeGroupChange} value={editedValues?.ageGroup} disabled={isPending}>
                                <SelectTrigger className="border-primary bg-primary/50 focus:ring-primary md:w-1/4">
                                    <SelectValue placeholder="Select age group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ageGroup.map((diff) => (
                                        <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="contents">
                                <span className="font-semibold text-primary">{story?.ageGroup} years old</span>
                                
                            </div>
                        )}
                                
                    </div>
                  
                    <div className="flex items-center space-x-2">
                        <Clock className="text-primary" />
                        <span className="text-gray-700 w-1/2 md:w-fit">Reading Time:</span>
                        {isEditing ? (
                            <Input
                                type="text"
                                name="readingTime"
                                value={editedValues?.readingTime}
                                onChange={handleInputChange}
                                className="border-primary bg-primary/50 focus:ring-primary md:w-1/4"
                            />
                        ) : (
                            <div className="contents">
                                 <span className="font-semibold text-primary">{story?.readingTime} mins</span>
                               
                            </div>
                        )}
                      
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Star className="text-primary" />
                        <span className="text-gray-700 w-1/2 md:w-fit">Points:</span>
                        {isEditing ? (
                            <div className="contents">
                                <Input
                                    type="number"
                                    name="points"
                                    value={editedValues?.points}
                                    onChange={handleInputChange}
                                    className="border-primary bg-primary/50 focus:ring-primary p-1 md:w-1/4"
                                    />
                              
                            </div>
                        ) : (
                            <div className="contents">
                                <span className="font-semibold text-primary">{story?.points}</span>
                               
                            </div>
                        )}
                      
                    </div>
                    <div className="flex items-center space-x-2">
                        <Trophy className="text-primary" />
                        <span className="text-gray-700 w-1/2 md:w-fit">Difficulty:</span>
                        {isEditing ? (
                             <Select onValueChange={handleDifficultyChange} value={editedValues?.difficulty} disabled={isPending}>
                                <SelectTrigger className="border-primary bg-primary/50 focus:ring-primary md:w-1/4">
                                    <SelectValue placeholder="Select difficulty" />
                                </SelectTrigger>
                                <SelectContent>
                                    {difficulty.map((diff) => (
                                        <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ) : (
                            <div className="contents">
                                <span className="font-semibold text-primary capitalize ">{story?.difficulty}</span>
                                
                            </div>
                        )}
                                
                    </div>
                    
                </div>
                
                <div className="">
                    <div className="block md:flex items-center space-x-2">
                        <div className="flex items-center space-x-2">
                            <Tag className="text-primary" />
                            <h1 className="text-gray-700 w-1/2 md:w-fit">Tags: </h1>
                        </div>
                        {isEditing ? (
                            <div className="">
                                <TagInput initialTags={editedValues?.tags || []} onTagsChange={handleTagsChange} />
                            </div>
                        ) : (
                            <div className="pl-3 contents text-primary text-justify mt-4 mb-2">
                            {story?.tags?.length ? (
                                story.tags.join(', ') // Assuming tags is an array
                            ) : (
                                <span className="text-muted-foreground">No tags available</span>
                            )}
                        </div>
                        )}
                    </div>
                </div>
                <div className="">
                    <div className="block md:flex items-center space-x-2">
                        <div className="w-1/2 md:w-fit flex gap-x-2">

                            <Feather className="text-primary" />
                            <h1 className="text-gray-700 w-fit">Cultural Notes: </h1>
                        </div>
                        {isEditing ? (
                            <div className="contents">
                                <Textarea
                                    id="culturalNotes"
                                    name="culturalNotes"
                                    value={editedValues?.culturalNotes}
                                    onChange={handleInputChange}
                                    rows={4}
                                    required
                                    className="border rounded p-1 "
                                    />
                                
                            </div>
                        ) : (
                            <div className="contents">
                                 <p className=' text-primary text-justify '>{story?.culturalNotes}</p>

                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isEditing && (

                <div className=" flex justify-end ">
              
                    <div className="flex gap-x-5">

                        <Button variant={'destructive'} disabled={isLoading} onClick={handleCancel}>Cancel</Button>
                        <Button variant={'default'} disabled={isLoading} onClick={handleSubmit}>Save</Button>
                    </div>
            
            </div>
            )}
            <Separator />

            {/* Game Options */}
            {!isEditing && (
                <div className="space-y-4">
                <h2 className="text-lg font-bold text-primary">Interactive Options</h2>
                <div className="space-y-3">
                    <Link
                        href={'/teachers/'+params.classId+'/list/edit/'+params.storyId+'/image-sequencing'}
                        className="w-full p-3 flex items-center justify-center space-x-2 border rounded-lg bg-primary text-white transition hover:bg-purple-700"
                    >
                        <Shuffle className="text-white" />
                        <span>Set up Image Sequencing Game</span>
                    </Link>
              
                    <Link
                        href={'/teachers/'+params.classId+'/list/edit/'+params.storyId+'/quiz'}
                        className="w-full p-3 flex items-center justify-center space-x-2 border rounded-lg bg-purple-700 text-white transition hover:bg-primary"
                    >
                        <Feather className="text-white" />
                        <span>Set up Quiz Questionnaires</span>
                    </Link>
                    <Button
                        variant={'destructive'}
                        disabled={isDeleting}
                        onClick={handleArchived}
                        className="w-full p-3 flex items-center justify-center space-x-2 border rounded-lg text-white transition hover:bg-primary/80"
                    >
                        <Trash2 className="text-white" />
                        <span>Archived this story from the list</span>
                    </Button>
                 
                </div>
            </div>
            )}

        </div>
    ) : (
        <div className="text-center text-gray-500">Loading story details...</div>
    )}
</div>

  )
}