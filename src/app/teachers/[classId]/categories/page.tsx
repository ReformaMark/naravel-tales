'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery } from 'convex/react';
import { Search } from 'lucide-react'
import React, { useState } from 'react'
import { api } from '../../../../../convex/_generated/api';
import Link from 'next/link';
import Image from 'next/image';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import CategoryDialog from './_components/CategoryDialog';
import { Id } from '../../../../../convex/_generated/dataModel';
import LanguageDialog from './_components/LanguageDialog';
import { Button } from '@/components/ui/button';

interface Category {
    
    categoryId: Id<'storyCategories'>| undefined;
    name: string;
    description: string | undefined;
    imageUrl: string | null;
}

function Page({
    params: { classId },
  }: {
    params: { classId: string };
  }){
    const [categoryData, setCategoriesData] = useState<Category>({
        categoryId: undefined,
        name: "",
        description: undefined,
        imageUrl: null,
    })
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryDialog, setCategoryDialog] = useState(false);    
    const [languageDialog, setLanguageDialog] = useState(false);    
    const [languageId, setLanguageId] = useState<Id<'storyLanguages'>| undefined>();    
    const categories = useQuery(api.storyCategories.getCategories);
    const languages = useQuery(api.storyLanguages.getstoryLanguages);

    const filterStoriesByCategory = () => {
        if (!categories) return [];
        if (searchQuery === "") return categories;
        // Filter categories based on the search query
        return categories.filter(
          (category) =>
            category.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      };

     

    const filtiredstoriesByCategory = filterStoriesByCategory();
   
    const handleOpenDialog = (categoryId: Id<'storyCategories'>, name: string, description: string | undefined, imageUrl: string | null) => {
        
        setCategoryDialog(true);
        setCategoriesData({
            categoryId: categoryId,
            name: name,
            description: description,
            imageUrl: imageUrl,
        })
    }

  return (
    <div>
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
                </BreadcrumbList>
            </Breadcrumb>
            </div>
        </header>
        <div className="grid grid-cols-12 gap-5 ">
            <Card className="col-span-12 md:col-span-9">
                <CardHeader className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-between">
                        <CardTitle>Categories</CardTitle>
                        <Link href={`/teachers/${classId}/categories/new`} className="text-xs text-blue-500 hover:text-blue-600 font-semibold">Create New Category</Link>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by category name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                        {filtiredstoriesByCategory.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                No categories name found matching your search
                            </div>
                        ) : (
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {filtiredstoriesByCategory.map((category) => (
                                <div 
                                    key={category._id}
                                    className=""
                                >
                                    <motion.div 
                                        className=""
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{scale:1.02}}
                                        transition={{ duration: 0.1 }}
                                    >
                                        <Card onClick={() => handleOpenDialog(category._id, category.name, category.description, category.imageUrl)} className='relative p-0 rounded-xl '>
                                        
                                            <div className='absolute z-30 inset-0 size-full bg-black/35 flex items-center justify-center rounded-xl'>
                                                <Link href={`/teachers/${classId}/list/category?selected=${category.name}`}>
                                                    <h1 className='text-3xl text-primary text-center font-extrabold uppercase tracking-wider bg-primary-foreground/90 w-full'>{category.name}</h1>
                                                </Link>
                                            </div>
                                                
                                            <div className="s size-72">
                                                <Image src={category.imageUrl || ""} alt='' fill className='object-cover size-full rounded-xl'/>
                                            </div>
                                        </Card>
                                    
                                    </motion.div>
                                
                                </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                
                </CardContent>
            </Card>
            <Card className="col-span-12 md:col-span-3 h-fit">
                <CardHeader className="flex flex-col space-y-4">
                    <div className="flex flex-row items-center justify-between">
                        <CardTitle>Languages</CardTitle>
                        <Button variant={'ghost'} onClick={()=>setLanguageDialog(true) } className="text-xs text-blue-500 hover:text-blue-600 font-semibold">Add language</Button>
                    </div>
                  
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <ScrollArea className="max-h-[calc(100vh-300px)]">
                        {languages?.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                No Language found.
                            </div>
                        ) : (
                            <div className="w-full">
                                {languages?.map((language) => (
                                <div 
                                    key={language._id}
                                    className=""
                                    onClick={()=> {
                                        setLanguageDialog(true)
                                        setLanguageId(language._id)
                                }}
                                >
                                    <motion.div 
                                        className="w-full"
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        whileHover={{scale:1.02}}
                                        transition={{ duration: 0.1 }}
                                    >
                                        <div className="text-left px-2 text-muted-foreground">
                                            {language.name}
                                        </div>
                                    </motion.div>
                                   
                                </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                
                </CardContent>
            </Card>
        </div>
        <CategoryDialog
            categoryDialog={categoryDialog}
            setCategoryDialog={setCategoryDialog}
            categoryId={categoryData.categoryId}
        />
       <LanguageDialog 
            languageDialog={languageDialog}
            setLanguageDialog={setLanguageDialog}
            languageId={languageId}
            setLanguageId={setLanguageId}
        />
    </div>
  )
}

export default Page