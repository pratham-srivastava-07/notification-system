"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterBarProps {
    eventTypes: string[];
}

export function FilterBar({ eventTypes }: FilterBarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentType = searchParams.get("type") || "all";
    const currentStatus = searchParams.get("status") || "all";

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === "all") {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`/?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push("/");
    };

    return (
        <div className="flex flex-wrap items-end gap-4">
            {/* Type Filter */}
            <div className="flex flex-col gap-1.5 w-[200px]">
                <label className="text-sm font-medium text-muted-foreground">
                    Event Type
                </label>
                <Select
                    value={currentType}
                    onValueChange={(val) => updateFilters("type", val)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        {eventTypes.map((t) => (
                            <SelectItem key={t} value={t}>
                                {t}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col gap-1.5 w-[200px]">
                <label className="text-sm font-medium text-muted-foreground">
                    Status
                </label>
                <Select
                    value={currentStatus}
                    onValueChange={(val) => updateFilters("status", val)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="processed">Processed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Clear Button */}
            {(currentType !== "all" || currentStatus !== "all") && (
                <Button variant="ghost" size="icon" onClick={clearFilters} className="mb-0.5">
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}
