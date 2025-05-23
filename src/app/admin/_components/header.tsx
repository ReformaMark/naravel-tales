import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import React from 'react'

export default function Header({
    breadcrumbPages
}:{
    breadcrumbPages: string[]
}) {

    const isLastPageindex = breadcrumbPages.length - 1
  return (
    <header className="flex h-16 text-xs md:text-sm shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                {breadcrumbPages.map((page, index)=>(
                    <div key={page} className=" contents">
                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-[0.5rem] md:text-sm">{page}</BreadcrumbPage>
                        </BreadcrumbItem>
                        {isLastPageindex !== index && 
                            <BreadcrumbSeparator className="hidden md:block text-black" />
                        }
                    </div>
                ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    </header>
  )
}
