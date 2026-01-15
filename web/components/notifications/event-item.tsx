"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import type { Event, DeliveryLog, DeliveryStatus } from "@prisma/client";

// Extended type including relation
type EventWithDeliveries = Event & {
    deliveries: DeliveryLog[];
};

interface EventItemProps {
    event: EventWithDeliveries;
}

export function EventItem({ event }: EventItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Derive status
    let status: "pending" | "processed" | "failed" | "processing" = "pending";

    if (event.deliveries.length === 0) {
        status = "pending";
    } else if (event.deliveries.some(d => d.status === "SUCCESS")) {
        status = "processed";
    } else if (event.deliveries.every(d => d.status === "FAILED")) {
        status = "failed";
    } else {
        status = "processing";
    }

    const statusColor = {
        pending: "secondary", // gray
        processed: "default", // primary/black (or green if customized)
        failed: "destructive", // red
        processing: "outline", // white/border
    } as const;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors mb-4">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-base font-medium">
                                {event.eventType}
                            </CardTitle>
                            <CardDescription className="text-xs truncate max-w-[300px]">
                                ID: {event.id}
                            </CardDescription>
                        </div>
                        <Badge variant={statusColor[status]}>{status.toUpperCase()}</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{event.tenantId.slice(0, 8)}...</span>
                            <span>{format(new Date(event.receivedAt), "PPpp")}</span>
                        </div>
                    </CardContent>
                </Card>
            </DialogTrigger>

            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle>Event Details</DialogTitle>
                    <DialogDescription>
                        ID: {event.id}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="h-[60vh] w-full rounded-md border p-4">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium mb-1">Metadata</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>Tenant ID: <span className="text-muted-foreground">{event.tenantId}</span></div>
                                <div>Occurred At: <span className="text-muted-foreground text-xs">{format(new Date(event.receivedAt), "KB")}</span></div>
                                <div>Status: <Badge variant={statusColor[status]} className="ml-2">{status}</Badge></div>
                            </div>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-1">Payload</h4>
                            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                                {JSON.stringify(event.payload, null, 2)}
                            </pre>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-sm font-medium mb-1">Delivery Logs ({event.deliveries.length})</h4>
                            {event.deliveries.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No delivery attempts yet.</p>
                            ) : (
                                <div className="space-y-2">
                                    {event.deliveries.map((log) => (
                                        <div key={log.id} className="text-sm border p-2 rounded flex justify-between items-center">
                                            <span>{log.channel}</span>
                                            <div className="flex items-center gap-2">
                                                <span className={
                                                    log.status === 'SUCCESS' ? 'text-green-600' :
                                                        log.status === 'FAILED' ? 'text-red-600' : 'text-yellow-600'
                                                }>{log.status}</span>
                                                <span className="text-xs text-muted-foreground">{log.attempts} attempts</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
