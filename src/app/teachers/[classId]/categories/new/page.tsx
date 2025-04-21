'use client'
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useConvexMutation } from '@convex-dev/react-query';
import React, { useRef, useState } from 'react'
import { api } from '../../../../../../convex/_generated/api';
import { toast } from 'sonner';
import { useMutation } from "@tanstack/react-query"
import { Id } from '../../../../../../convex/_generated/dataModel';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImagePreview } from '../../create-stories/_components/ImagePreview';
import { UploadPlaceholder } from '../../create-stories/_components/UploadPlaceHolder';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
import { useRouter } from 'next/navigation';

interface Story {
    name: string;
    description: string | "";
    image: File | null;
   
}

const categoriesInitialData: Story = {
    name: "",
    description: "",
    image: null,
}

function Page() {
    const [categoriesData, setCategoriesData] = useState<Story>(categoriesInitialData)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const { mutate: generateUploadUrl } = useGenerateUploadUrl()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const { mutate, isPending } = useMutation({
        mutationFn: useConvexMutation(api.storyCategories.createStoryCategory),
        onSuccess: () => {
            setCategoriesData(categoriesInitialData)
            setPreviewUrl(null)
            toast.success('Category added successfully!')
            router.back()
        },
        onError: () => {
            toast.error('Failed to create category!')
        },
    })

     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] || null
    
            setCategoriesData((prevData) => ({
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
    

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setCategoriesData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }
     const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault()
            let storageId: Id<"_storage"> | undefined;
            try {
                if (categoriesData.image) {
                    const url = await generateUploadUrl({}, {
                        throwError: true
                    })
                    if (!url) {
                        toast.error('Failed to generate upload URL')
                        return
                    }
                    const result = await fetch(url, {
                        method: 'POST',
                        body: categoriesData.image,
                        headers: {
                            'Content-Type': categoriesData.image.type
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
                    name: categoriesData.name,
                    description: categoriesData.description,
                    imageId: storageId,
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
    <div className="">
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
                    <BreadcrumbPage>
                        Categories
                    </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                    <BreadcrumbPage>
                        New
                    </BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            </div>
        </header>
   
    <Card>
        <CardHeader className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
                <CardTitle className='text-lg font-semibold'>New Category</CardTitle>
            </div>
        </CardHeader>
        <CardContent >
            <form id="create-category-form" onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-medium text-primary">Category Name</Label>
                    <div className="relative">
                       
                        <Input
                            id="title"
                            name="name"
                            value={categoriesData.name}
                            onChange={handleInputChange}
                            required
                            className="border-primary bg-primary/50 focus:ring-primary"
                            placeholder="Enter category name"
                            disabled={isPending}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-primary">Category Description</Label>
                    <Textarea
                        id="description"
                        name="description"
                        value={categoriesData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="border-primary bg-primary/50 focus:ring-primary"
                        placeholder="Enter the category description..."
                        disabled={isPending}
                    />
                </div>
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-primary">Category Image</h3>
                    
                    <div className="relative flex h-64 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-primary bg-primary/50 transition-all hover:bg-primary/70"
                        onClick={triggerFileInput}>
                        {categoriesData.image ? (
                            <ImagePreview image={categoriesData.image} />
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
                <CardFooter className="flex items-center justify-end space-x-4">

                <Button
                    type="submit"
                    form="create-category-form"
                    className="bg-primary text-white transition-all duration-300 ease-in hover:bg-primary/90"
                    disabled={isPending}
                    >
                   
                    Save Category
                </Button>
                </CardFooter>
            </form>
        </CardContent>
    </Card>
    </div>
  )
}

export default Page