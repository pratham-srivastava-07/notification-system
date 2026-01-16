"use client"

import { useState } from "react"
import { NotificationForm } from "@/components/dashboard/notification-form"
import { NotificationList, NotificationLog } from "@/components/dashboard/notification-list"
import { AnalyticsCards } from "@/components/dashboard/analytics-cards"
import { Toaster } from "sonner" // Assuming sonner is installed or will be, actually shadcn typically uses its own toast. I might need to swap this.
// Let's stick to standard console for now or basic alerting if toast isn't set up, but shadcn usually installs functionality.
// Wait, I didn't install sonner or toast. I'll stick to local state feedback which is already in the components.

export default function DashboardPage() {
  const [logs, setLogs] = useState<NotificationLog[]>([])

  const stats = {
    totalSent: logs.length,
    successCount: logs.filter(l => l.status === 'success').length,
    failureCount: logs.filter(l => l.status === 'error').length,
    lastActive: logs.length > 0 ? logs[0].timestamp : null
  }

  const handleSendNotification = async (eventType: string, payload: string) => {
    const newLog: NotificationLog = {
      id: crypto.randomUUID(),
      eventType,
      payload: JSON.parse(payload),
      status: 'pending',
      timestamp: new Date()
    }

    setLogs(prev => [newLog, ...prev])

    try {
      const res = await fetch('http://localhost:5000/v1/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'test-api-key-123' // Hardcoded for demo as per known working key
        },
        body: JSON.stringify({
          event_type: eventType,
          payload: JSON.parse(payload)
        })
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.message || 'Failed to send')

      setLogs(prev => prev.map(log =>
        log.id === newLog.id
          ? { ...log, status: 'success', apiResponse: data }
          : log
      ))
    } catch (error) {
      console.error(error)
      setLogs(prev => prev.map(log =>
        log.id === newLog.id
          ? { ...log, status: 'error' }
          : log
      ))
      throw error // Re-throw to let form handle UI error state
    }
  }

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Notification System</h1>
        <p className="text-muted-foreground">Manage and track your event ingestion pipeline.</p>
      </div>

      <AnalyticsCards stats={stats} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <NotificationForm onSend={handleSendNotification} />
        </div>
        <div className="col-span-3">
          <NotificationList logs={logs} />
        </div>
      </div>
    </div>
  )
}
