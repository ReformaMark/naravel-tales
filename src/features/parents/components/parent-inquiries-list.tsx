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
import { useStudentId } from "@/features/students/hooks/use-student-id"
import { Doc, Id } from "../../../../convex/_generated/dataModel"

interface Inquiry extends Doc<"inquiries"> {
    _id: Id<"inquiries">;
    parentId: Id<"users">;
    teacherId: Id<"users">;
    studentId: Id<"students">;
    subject: string;
    message: string;
    status: "pending" | "responded";
    createdAt: number;
    response?: string;
    respondedAt?: number;
}

export const ParentInquiriesList = () => {
    const studentId = useStudentId()
    const inquiries = useQuery(api.inquiries.getByStudent, { studentId })

    if (!inquiries) return null

    const pendingInquiries = inquiries.filter(i => i.status === "pending")
    const respondedInquiries = inquiries.filter(i => i.status === "responded")

    return (
        <Card className="shadow-lg">
            <CardHeader className="space-y-2">
                <CardTitle className="text-2xl font-bold text-primary">My Inquiries</CardTitle>
                <CardDescription className="text-base">
                    View your inquiries and teacher responses
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="all" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="all">
                            All ({inquiries.length})
                        </TabsTrigger>
                        <TabsTrigger value="pending">
                            Pending ({pendingInquiries.length})
                        </TabsTrigger>
                        <TabsTrigger value="responded">
                            Responded ({respondedInquiries.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all">
                        <InquiriesList inquiries={inquiries} />
                    </TabsContent>

                    <TabsContent value="pending">
                        <InquiriesList inquiries={pendingInquiries} />
                    </TabsContent>

                    <TabsContent value="responded">
                        <InquiriesList inquiries={respondedInquiries} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

const InquiriesList = ({ inquiries }: { inquiries: Inquiry[] }) => {
    return (
        <ScrollArea className="h-[600px] pr-4">
            {inquiries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                    <MessageCircle className="h-12 w-12 mb-4" />
                    <p className="text-lg font-medium">No inquiries found</p>
                    <p className="text-sm">Your inquiries will appear here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {inquiries.map((inquiry) => (
                        <Card key={inquiry._id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">
                                            {inquiry.subject}
                                        </CardTitle>
                                        <CardDescription>
                                            Sent {formatDistanceToNow(inquiry.createdAt, { addSuffix: true })}
                                        </CardDescription>
                                    </div>
                                    {inquiry.status === "responded" && (
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span className="text-xs">Responded</span>
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium mb-2">Your Inquiry:</p>
                                    <p className="text-sm whitespace-pre-wrap">
                                        {inquiry.message}
                                    </p>
                                </div>
                                {inquiry.status === "responded" && (
                                    <div className="bg-muted/50 p-4 rounded-lg">
                                        <p className="text-sm font-medium mb-2">Teacher&apos;s Response:</p>
                                        <p className="text-sm whitespace-pre-wrap">
                                            {inquiry.response}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Responded {formatDistanceToNow(inquiry.respondedAt!, { addSuffix: true })}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </ScrollArea>
    )
} 