import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StoriesGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-video" />
                    <div className="p-4 space-y-2">
                        <Skeleton className="h-6 w-2/3" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </Card>
            ))}
        </div>
    );
}