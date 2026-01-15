"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <div className="flex flex-col items-center space-y-2 text-center">
                <AlertCircle className="h-12 w-12 text-destructive" />
                <h2 className="text-2xl font-bold tracking-tight">Something went wrong!</h2>
                <p className="text-muted-foreground">{error.message || "An unexpected error occurred."}</p>
            </div>
            <Button onClick={() => reset()}>Try again</Button>
        </div>
    );
}
