"use client"

import { ClassInquiriesCard } from "@/features/class/components/class-inquiries-card"
import { useClassId } from "@/features/class/hooks/use-class-id"

export default function InquiriesPage() {
    const classId = useClassId()

    return <ClassInquiriesCard classId={classId} />
}