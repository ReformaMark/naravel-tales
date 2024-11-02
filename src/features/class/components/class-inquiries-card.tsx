"use client"



import {

    Card,

    CardContent,

    CardDescription,

    CardHeader,

    CardTitle,

} from "@/components/ui/card"

import { ScrollArea } from "@/components/ui/scroll-area"

import { useQuery } from "convex/react"

import { api } from "../../../../convex/_generated/api"

import { formatDistanceToNow } from "date-fns"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { MessageCircle, CheckCircle2 } from "lucide-react"

import { InquiryResponseDialog } from "./inquiry-response-dialog"

import { useState } from "react"

import { Id } from "../../../../convex/_generated/dataModel"

import { Inquiry } from "../types"



export const ClassInquiriesCard = ({ classId }: { classId: Id<"classes"> }) => {

    const inquiries = useQuery(api.inquiries.listByClass, { classId })

    const [selectedInquiryId, setSelectedInquiryId] = useState<Id<"inquiries"> | null>(null)



    if (!inquiries) return null



    const pendingInquiries = inquiries.filter((i: Inquiry) => i.status === "pending")

    const respondedInquiries = inquiries.filter((i: Inquiry) => i.status === "responded")



    return (

        <div className="container mx-auto py-6">

            <Card className="shadow-lg">

                <CardHeader className="space-y-2">

                    <CardTitle className="text-2xl font-bold text-primary">Parent Inquiries</CardTitle>

                    <CardDescription className="text-base">

                        Manage and respond to parent inquiries

                    </CardDescription>

                </CardHeader>

                <CardContent>

                    <Tabs defaultValue="pending" className="space-y-6">

                        <TabsList>

                            <TabsTrigger value="pending">

                                Pending ({pendingInquiries.length})

                            </TabsTrigger>

                            <TabsTrigger value="responded">

                                Responded ({respondedInquiries.length})

                            </TabsTrigger>

                        </TabsList>



                        <TabsContent value="pending">

                            <ScrollArea className="h-[600px] pr-4">

                                {pendingInquiries.length === 0 ? (

                                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">

                                        <MessageCircle className="h-12 w-12 mb-4" />

                                        <p className="text-lg font-medium">No pending inquiries</p>

                                        <p className="text-sm">All caught up!</p>

                                    </div>

                                ) : (

                                    <div className="space-y-4">

                                        {pendingInquiries.map((inquiry) => (

                                            <Card 

                                                key={inquiry._id}

                                                className="hover:shadow-md transition-shadow cursor-pointer"

                                                onClick={() => setSelectedInquiryId(inquiry._id)}

                                            >

                                                <CardHeader>

                                                    <div className="flex justify-between items-start">

                                                        <div>

                                                            <CardTitle className="text-lg">

                                                                {inquiry.subject}

                                                            </CardTitle>

                                                            <CardDescription>

                                                                From: {inquiry.student?.fname} {inquiry.student?.lname}&apos;s parent

                                                            </CardDescription>

                                                        </div>

                                                        <span className="text-xs text-muted-foreground">

                                                            {formatDistanceToNow(inquiry.createdAt, { addSuffix: true })}

                                                        </span>

                                                    </div>

                                                </CardHeader>

                                                <CardContent>

                                                    <p className="text-sm whitespace-pre-wrap">

                                                        {inquiry.message}

                                                    </p>

                                                </CardContent>

                                            </Card>

                                        ))}

                                    </div>

                                )}

                            </ScrollArea>

                        </TabsContent>



                        <TabsContent value="responded">

                            <ScrollArea className="h-[600px] pr-4">

                                {respondedInquiries.length === 0 ? (

                                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">

                                        <CheckCircle2 className="h-12 w-12 mb-4" />

                                        <p className="text-lg font-medium">No responded inquiries</p>

                                        <p className="text-sm">Previous responses will appear here</p>

                                    </div>

                                ) : (

                                    <div className="space-y-4">

                                        {respondedInquiries.map((inquiry) => (

                                            <Card key={inquiry._id} className="opacity-75">

                                                <CardHeader>

                                                    <div className="flex justify-between items-start">

                                                        <div>

                                                            <CardTitle className="text-lg">

                                                                {inquiry.subject}

                                                            </CardTitle>

                                                            <CardDescription>

                                                                From: {inquiry.student?.fname} {inquiry.student?.lname}&apos;s parent

                                                            </CardDescription>

                                                        </div>

                                                        <span className="text-xs text-muted-foreground">

                                                            Responded {formatDistanceToNow(inquiry.respondedAt!, { addSuffix: true })}

                                                        </span>

                                                    </div>

                                                </CardHeader>

                                                <CardContent className="space-y-4">

                                                    <div>

                                                        <p className="text-sm font-medium mb-2">Inquiry:</p>

                                                        <p className="text-sm whitespace-pre-wrap">

                                                            {inquiry.message}

                                                        </p>

                                                    </div>

                                                    <div>

                                                        <p className="text-sm font-medium mb-2">Response:</p>

                                                        <p className="text-sm whitespace-pre-wrap">

                                                            {inquiry.response}

                                                        </p>

                                                    </div>

                                                </CardContent>

                                            </Card>

                                        ))}

                                    </div>

                                )}

                            </ScrollArea>

                        </TabsContent>

                    </Tabs>

                </CardContent>

            </Card>



            <InquiryResponseDialog

                inquiryId={selectedInquiryId}

                onClose={() => setSelectedInquiryId(null)}

            />

        </div>

    )

} 
