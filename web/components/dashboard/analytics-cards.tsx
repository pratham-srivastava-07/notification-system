"use client"

import { motion } from "framer-motion"
import { Activity, CheckCircle, XCircle, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AnalyticsStats {
  totalSent: number
  successCount: number
  failureCount: number
  lastActive: Date | null
}

interface AnalyticsCardsProps {
  stats: AnalyticsStats
}

export function AnalyticsCards({ stats }: AnalyticsCardsProps) {
  const cards = [
    {
      title: "Total Sent",
      value: stats.totalSent,
      icon: Zap,
      color: "text-accent",
      delay: 0.1,
    },
    {
      title: "Success Rate",
      value: stats.totalSent > 0 ? `${Math.round((stats.successCount / stats.totalSent) * 100)}%` : "0%",
      icon: Activity,
      color: "text-accent",
      delay: 0.2,
    },
    {
      title: "Successful",
      value: stats.successCount,
      icon: CheckCircle,
      color: "text-emerald-500",
      delay: 0.3,
    },
    {
      title: "Failed",
      value: stats.failureCount,
      icon: XCircle,
      color: "text-red-500",
      delay: 0.4,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: card.delay }}
        >
          <Card className="border border-border/50 bg-card/60 backdrop-blur-sm hover:bg-card/80 hover:border-accent/30 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-accent/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide">{card.title}</CardTitle>
              <card.icon className={`h-5 w-5 ${card.color} opacity-80`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground tracking-tight">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-2">
                {index === 0 && "Lifetime notifications"}
                {index === 1 && "Delivery reliability"}
                {index === 2 && "Processed successfully"}
                {index === 3 && "Failed to process"}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
