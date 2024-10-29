'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Copy, Check, UserPlus2, UserCheck2Icon } from "lucide-react"
import { toast } from "sonner"
import { Student } from '../student-types'

function getInitials(fname: string, lname: string): string {
    return `${fname.charAt(0)}${lname.charAt(0)}`.toUpperCase()
}

const avatarColors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
]

function getAvatarColor(name: string): string {
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return avatarColors[index % avatarColors.length]
}

interface StudentCardProps {
    student: Student
    onArchive: (id: string) => void
}

export function StudentCard({ student, onArchive }: StudentCardProps) {
    const [copiedstudentCode, setCopiedstudentCode] = useState<string | null>(null)
    const fullName = `${student.fname} ${student.lname}`
    const initials = getInitials(student.fname, student.lname)
    const avatarColor = getAvatarColor(fullName)

    const copyToClipboard = (studentCode: string) => {
        navigator.clipboard.writeText(studentCode)
        setCopiedstudentCode(studentCode)
        setTimeout(() => setCopiedstudentCode(null), 2000)
        toast.success('Student code copied to clipboard')
    }

    return (
        <Card className="relative shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardContent className="flex flex-col p-6">
                <div className="flex items-center space-x-2 justify-between">
                    <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => copyToClipboard(student.studentCode || '')}
                    >
                        {copiedstudentCode === student.studentCode ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                        {student.studentCode}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => console.log('Edit', student._id)}>
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onArchive(student._id)}>
                                Archive
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="flex flex-col items-center mt-6">
                    <Avatar className={`h-24 w-24 mb-6 rounded-lg `}>
                        <AvatarFallback className={`rounded-lg text-2xl font-semibold text-white ${avatarColor}`}>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center w-full">
                        <h3 className="font-semibold text-lg mb-1">{fullName}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{new Date(student.createdAt).toLocaleDateString()}</p>
                        {student.parentId ? (
                            <div className="flex items-center justify-center gap-2 text-sm text-white bg-primary py-2 px-3 rounded-md">
                                <UserCheck2Icon className="h-4 w-4" />
                                <span>Parent connected</span>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 text-sm text-white bg-primary py-2 px-3 rounded-md">
                                <UserPlus2 className="h-4 w-4" />
                                <span>No parent connected</span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}