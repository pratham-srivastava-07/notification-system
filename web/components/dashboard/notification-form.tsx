"use client"

import type React from "react"

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
      JSON.parse(payload)
      await onSend(eventType, payload)
      setEventType("")
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full border border-border/50 bg-card/60 backdrop-blur-sm shadow-xl">
        <CardHeader className="border-b border-border/30 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold tracking-tight">Send Notification</CardTitle>
              <CardDescription className="text-sm mt-1">Trigger a new event to the ingestion API</CardDescription>
            </div>
            <Badge variant="outline" className="animate-pulse bg-accent/20 border-accent/40 text-accent">
              Live
            </Badge>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5 pt-6">
            <div className="space-y-2.5">
              <Label htmlFor="eventType" className="text-sm font-medium text-foreground">
                Event Type
              </Label>
              <Input
                id="eventType"
                placeholder="e.g. USER_SIGNUP"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                required
                className="font-mono text-sm bg-background/50 border-border/50 focus:border-accent/50 focus:ring-accent/30"
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="payload" className="text-sm font-medium text-foreground">
                Payload (JSON)
              </Label>
              <Textarea
                id="payload"
                placeholder="{ ... }"
                value={payload}
                onChange={(e) => setPayload(e.target.value)}
                className="font-mono min-h-[150px] text-sm bg-background/50 border-border/50 focus:border-accent/50 focus:ring-accent/30 resize-none"
                required
              />
              {error && <p className="text-xs text-destructive font-medium mt-2">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="border-t border-border/30 pt-4">
            <Button
              type="submit"
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2.5 transition-all duration-200"
              disabled={loading || !eventType}
            >
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
