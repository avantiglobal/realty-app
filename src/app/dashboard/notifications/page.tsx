"use client"
import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { notifications as allNotifications } from "@/lib/data"
import type { Notification } from "@/lib/types"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  React.useEffect(() => {
    setNotifications(allNotifications);
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">Notifications</h1>
        <p className="text-muted-foreground">
          Here are all your notifications.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            You have {notifications.length} total notifications.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-4 rounded-lg border p-4"
            >
              <div
                className={cn(
                  "mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full",
                  !notification.read && "bg-primary"
                )}
              />
              <div className="grid gap-1">
                <p className="font-semibold">{notification.title}</p>
                <p className="text-sm text-muted-foreground">
                  {notification.description}
                </p>
                 <p className="text-xs text-muted-foreground">
                  {format(notification.createdAt, "P")}
                </p>
              </div>
            </div>
          ))
          ) : (
            <div className="text-center text-muted-foreground py-8">
                No notifications found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
