"use client"

import { useEffect, useState } from "react"
import { API_BASE } from "@/lib/config"
import fetchAPI from "@/lib/fetchAPI"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      const res = await fetchAPI(`${API_BASE}/api/users/notifications`, {
        credentials: "include",
      })

      if (!res.ok) {
        throw new Error("Failed to fetch notifications")
      }

      const data = await res.json()
    //   console.log(data.notifications)
      setNotifications(data.notifications || [])
    } catch (err: any) {
      console.error(err)
      setError(err.message || "Failed to fetch notifications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading notifications...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Notifications</h2>

      {error && <div className="text-red-600">{error}</div>}

      {!notifications || notifications.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No notifications found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {notifications.map((n, idx) => (
            <Card key={idx} className="w-full">
              <CardHeader className="items-center">
                <CardTitle className="flex items-center gap-2 w-full">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-slate-600" />
                    <span className="font-semibold">Notification</span>
                  </div>
                  <div className="ml-auto text-sm text-muted-foreground">{/* optional timestamp */}</div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{n}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
