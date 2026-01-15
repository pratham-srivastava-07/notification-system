import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
    return (
        <div className="container mx-auto py-10 px-4 min-h-screen">
            <div className="flex flex-col gap-6 max-w-5xl mx-auto">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-10 w-[300px]" />
                    <Skeleton className="h-5 w-[200px]" />
                </div>

                <Card>
                    <CardHeader className="pb-3 pt-4">
                        <Skeleton className="h-6 w-[100px]" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[80px]" />
                                <Skeleton className="h-10 w-[200px]" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-[80px]" />
                                <Skeleton className="h-10 w-[200px]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-8 w-[150px]" />
                        <Skeleton className="h-5 w-[200px]" />
                    </div>
                    <div className="space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-[100px] w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
