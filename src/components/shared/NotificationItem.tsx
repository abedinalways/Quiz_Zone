"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, MessageSquare, Trophy, CreditCard, UserPlus, AlertTriangle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Notification, NotificationType } from "@/types"

const iconMap: Record<NotificationType, React.ElementType> = {
  message: MessageSquare,
  follow: UserPlus,
  quiz_result: Trophy,
  achievement: Trophy,
  subscription: CreditCard,
  report: AlertTriangle,
}

export function NotificationItem({ notification }: { notification: Notification }) {
  const Icon = iconMap[notification.type] || Bell

  return (
    <div
      className={`flex items-start gap-4 p-4 rounded-lg border ${
        !notification.read ? "bg-muted/50 border-l-primary border-l-4" : ""
      }`}
    >
      <div className="mt-1">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{notification.title}</p>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </div>
  )
}
