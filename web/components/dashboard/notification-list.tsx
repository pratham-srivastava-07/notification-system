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
    <Card className="h-full border border-border/50 bg-card/60 backdrop-blur-sm flex flex-col shadow-xl">
      <CardHeader className="border-b border-border/30 pb-4">
        <CardTitle className="text-xl font-bold tracking-tight">Recent Activity</CardTitle>
        <CardDescription className="text-sm mt-1">Live log of sent notifications</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[400px] px-6 py-4">
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {logs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center text-muted-foreground py-12"
                >
                  <p className="text-sm">No notifications sent yet.</p>
                  <p className="text-xs mt-1 text-muted-foreground/60">Send your first notification to get started</p>
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
                    className="group flex flex-col border border-border/40 rounded-lg p-4 hover:bg-accent/5 hover:border-accent/30 transition-all duration-200 bg-background/30 backdrop-blur-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        {log.status === "success" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        ) : log.status === "error" ? (
                          <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500 flex-shrink-0 animate-spin" />
                        )}
                        <span className="font-semibold font-mono text-sm text-foreground tracking-tight">
                          {log.eventType}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </div>

                    <div className="grid grid-cols-[1fr_auto_1fr] gap-2 items-center text-xs text-muted-foreground">
                      <code className="bg-background/60 border border-border/30 px-2 py-1.5 rounded text-xs truncate max-w-[100px] font-mono text-foreground/70">
                        {JSON.stringify(log.payload).substring(0, 30)}...
                      </code>
                      <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant={
                            log.status === "success" ? "default" : log.status === "error" ? "destructive" : "secondary"
                          }
                          className="text-xs h-6 px-2 font-medium"
                        >
                          {log.status === "success" ? "SENT" : log.status === "error" ? "FAILED" : "PENDING"}
                        </Badge>
                        {log.apiResponse?.event_id && (
                          <code className="bg-background/60 border border-border/30 px-1.5 py-1 rounded text-xs font-mono text-foreground/60">
                            ID: {log.apiResponse.event_id.slice(0, 6)}...
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
