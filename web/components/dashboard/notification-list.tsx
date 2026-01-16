"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export interface NotificationLog {
    id: string
    eventType: string
    payload: any
    status: "success" | "error" | "pending"
    timestamp: Date
    apiResponse?: any
}

interface NotificationListProps {
    logs: NotificationLog[]
}

export function NotificationList({ logs }: NotificationListProps) {
    return (
        <Card className="h-full border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 flex flex-col">
            <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Live log of sent notifications</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[400px] px-6 pb-6">
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {logs.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center text-muted-foreground py-10"
                                >
                                    No notifications sent yet.
                                </motion.div>
                            ) : (
                                logs.map((log) => (
                                    <motion.div
                                        key={log.id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.3 }}
                                        className="group flex flex-col border rounded-lg p-3 hover:bg-accent/50 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {log.status === "success" ? (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                ) : log.status === "error" ? (
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                ) : (
                                                    <Clock className="h-4 w-4 text-yellow-500" />
                                                )}
                                                <span className="font-semibold font-mono text-sm">{log.eventType}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(log.timestamp).toLocaleTimeString()}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center text-xs text-muted-foreground">
                                            <code className="bg-muted px-1 py-0.5 rounded truncate max-w-[120px]">
                                                {JSON.stringify(log.payload)}
                                            </code>
                                            <ArrowRight className="h-3 w-3" />
                                            <div className="flex items-center gap-1">
                                                <Badge variant={log.status === 'success' ? 'default' : 'destructive'} className="text-[10px] h-5 px-1.5">
                                                    {log.status === 'success' ? 'SENT' : 'FAILED'}
                                                </Badge>
                                                {log.apiResponse?.event_id && (
                                                    <code className="bg-muted px-1 py-0.5 rounded text-[10px]">
                                                        ID: {log.apiResponse.event_id.slice(0, 8)}...
                                                    </code>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
