'use client'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import React, { useEffect, useRef, useState } from 'react'
import { Id } from '../../../../../../convex/_generated/dataModel';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ImagePreview } from '../../create-stories/_components/ImagePreview';
import { UploadPlaceholder } from '../../create-stories/_components/UploadPlaceHolder';
import { Button } from '@/components/ui/button';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useMutation } from "@tanstack/react-query";
import { useConvexMutation } from '@convex-dev/react-query';
import { api } from '../../../../../../convex/_generated/api';
import { toast } from 'sonner';
import Image from 'next/image';
import { useQuery } from 'convex/react';
import { TrashIcon } from 'lucide-react';
import { ConvexError } from 'convex/values';

interface CategoryDialogProps{
    categoryDialog: boolean;
    setCategoryDialog: (value: boolean) => void;
    categoryId: Id<'storyCategories'> | undefined
}

interface Story {
    categoryId: Id<'storyCategories'> | undefined;
    name: string;
    description: string | undefined;
    imageUrl: File | string | null;
}

function CategoryDialog({ categoryDialog, setCategoryDialog, categoryId}: CategoryDialogProps) {
    const category = useQuery(api.storyCategories.getCategory, {categoryId: categoryId})
   useEffect(()=>{
    if(category) {
        
        setCategoriesData({
            categoryId: category._id,
            name: category.name,
            description: category.description || "",
            imageUrl: category.imageUrl || null,
        });
    }
   }, [category])
    const categoriesInitialData: Story = {
        categoryId: categoryId,
        name: category?.name || "",
        description: category?.description || "",
        imageUrl: category?.imageUrl || null,
    }

    const [categoriesData, setCategoriesData] = useState<Story>(categoriesInitialData)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const { mutate: generateUploadUrl } = useGenerateUploadUrl()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { mutate, isPending } = useMutation({
        mutationFn: useConvexMutation(api.storyCategories.updateCategory),
        onSuccess: () => {
            setCategoriesData(categoriesInitialData)
            setPreviewUrl(category?.imageUrl || null)
            toast.success('Category updated successfully!')
        },
        onError: () => {
            toast.error('Failed to update category!')
        },
    })

    const { mutate: deleteMutate, isPending: isDeletePending } = useMutation({
        mutationFn: useConvexMutation(api.storyCategories.deleteCategory),
        onSuccess: () => {
            setCategoriesData(categoriesInitialData)
            setPreviewUrl(category?.imageUrl || null)
            toast.success('Category deleted successfully!')
        },
        onError: (error) => {
            toast.error(error instanceof ConvexError ? error.data : 'Failed to delete category!')
        },
    })

        const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0] || null

            setCategoriesData((prevData) => ({
                ...prevData,
                imageUrl: file,
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
            if (categoriesData.imageUrl) {
                const url = await generateUploadUrl({}, {
                    throwError: true
                })
                if (!url) {
                    toast.error('Failed to generate upload URL')
                    return
                }
                const result = await fetch(url, {
                    method: 'POST',
                    body: categoriesData.imageUrl,
                    headers: {
                        'Content-Type': categoriesData.imageUrl instanceof File ? categoriesData.imageUrl.type : 'application/json'
                    }
                })
                if (!result.ok) {
                    toast.error('Failed to upload image')
                    return
                }
                const { storageId: uploadedStorageId } = await result.json()
                storageId = uploadedStorageId
            }
            if(categoriesData.categoryId) {

                await mutate({
                    categoryId: categoriesData.categoryId,
                    name: categoriesData.name,
                    description: categoriesData.description,
                    image: storageId,
                })
            }
        } catch (error: unknown) {
            console.error(error)
            toast.error(error as string)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    const handleDelete = () =>{
        if(categoryId) {

            deleteMutate({
                categoryId: categoryId
            })
            toast.success('Category deleted successfully!')
        }
        setCategoryDialog(false)   
    }
  return (
    <Dialog open={categoryDialog} onOpenChange={setCategoryDialog}>
        <DialogContent>
          
                <DialogTitle>Category Details</DialogTitle>
            
        
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
                                {categoriesData.imageUrl ? (
                                    <>
                                        {categoriesData.imageUrl instanceof File ? (
                                            <ImagePreview image={categoriesData.imageUrl || null} />
                                        ) : (
                                            <Image
                                                src={categoriesData?.imageUrl || ''}
                                                alt="Category Image preview"
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
                        </div>
                        <div className="flex items-center justify-between space-x-4">

                        <Button
                            type="button"
                            onClick={handleDelete}
                            size={'icon'}
                            variant={'destructive'}
                            className=" transition-all duration-300 ease-in "
                            disabled={isPending}
                            >
                        
                            <TrashIcon/>
                        </Button>
                        <Button
                            type="submit"
                            form="create-category-form"
                            className="bg-primary text-white transition-all duration-300 ease-in hover:bg-primary/90"
                            disabled={isPending}
                            >
                        
                            Update Category
                        </Button>
                        </div>
                    </form>
               
        </DialogContent>
    </Dialog>
  )
}

export default CategoryDialog