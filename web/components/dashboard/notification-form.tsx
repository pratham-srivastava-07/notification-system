"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"

interface NotificationFormProps {
    onSend: (eventType: string, payload: string) => Promise<void>
}

export function NotificationForm({ onSend }: NotificationFormProps) {
    const [eventType, setEventType] = useState("")
    const [payload, setPayload] = useState('{\n  "message": "Hello World"\n}')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Validate JSON
            JSON.parse(payload)
            await onSend(eventType, payload)
            setEventType("")
            // Keep payload as template or clear it? Let's keep common template
        } catch (err) {
            if (err instanceof SyntaxError) {
                setError("Invalid JSON payload")
            } else {
                setError("Failed to send notification")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="w-full border-border/40 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Send Notification</CardTitle>
                            <CardDescription>Trigger a new event to the ingestion API</CardDescription>
                        </div>
                        <Badge variant="outline" className="animate-pulse">Live</Badge>
                    </div>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="eventType">Event Type</Label>
                            <Input
                                id="eventType"
                                placeholder="e.g. USER_SIGNUP"
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value)}
                                required
                                className="font-mono"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="payload">Payload (JSON)</Label>
                            <Textarea
                                id="payload"
                                placeholder="{ ... }"
                                value={payload}
                                onChange={(e) => setPayload(e.target.value)}
                                className="font-mono min-h-[150px]"
                                required
                            />
                            {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading || !eventType}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Send Notification
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </motion.div>
    )
}
