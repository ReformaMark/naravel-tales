import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function StudentCardSkeleton() {
    return (
        <Card className="relative shadow-md">
            <CardContent className="flex flex-col p-6">
                <div className="flex items-center space-x-2 justify-between">
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <div className="flex flex-col items-center mt-6">
                    <Skeleton className="h-24 w-24 rounded-lg mb-6" />
                    <div className="text-center w-full space-y-2">
                        <Skeleton className="h-6 w-32 mx-auto" />
                        <Skeleton className="h-4 w-24 mx-auto" />
                        <Skeleton className="h-8 w-40 mx-auto rounded-md mt-3" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 