"use client"

import { useState } from "react"
import { NotificationForm } from "@/components/dashboard/notification-form"
import { NotificationList, type NotificationLog } from "@/components/dashboard/notification-list"
import { AnalyticsCards } from "@/components/dashboard/analytics-cards"

export default function DashboardPage() {
  const [logs, setLogs] = useState<NotificationLog[]>([])

  const stats = {
    totalSent: logs.length,
    successCount: logs.filter((l) => l.status === "success").length,
    failureCount: logs.filter((l) => l.status === "error").length,
    lastActive: logs.length > 0 ? logs[0].timestamp : null,
  }

  const handleSendNotification = async (eventType: string, payload: string) => {
    const newLog: NotificationLog = {
      id: crypto.randomUUID(),
      eventType,
      payload: JSON.parse(payload),
      status: "pending",
      timestamp: new Date(),
    }

    setLogs((prev) => [newLog, ...prev])

    try {
      const parsedPayload = JSON.parse(payload)

      const response = await fetch("http://localhost:5000/v1/events", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": "test-api-key-123" },
        body: JSON.stringify({
          event_type: eventType,
          payload: parsedPayload,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`)
      }

      const apiResponse = await response.json()

      setLogs((prev) => prev.map((log) => (log.id === newLog.id ? { ...log, status: "success", apiResponse } : log)))
    } catch (error) {
      console.error(error)
      setLogs((prev) => prev.map((log) => (log.id === newLog.id ? { ...log, status: "error" } : log)))
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-8 space-y-8">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Notification System</h1>
        <p className="text-base text-muted-foreground max-w-2xl">
          Manage and track your event ingestion pipeline with real-time monitoring and analytics.
        </p>
      </div>

      <AnalyticsCards stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
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
