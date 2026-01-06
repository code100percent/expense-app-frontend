"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react"

type NotificationType = "success" | "error" | "warning" | "info"

interface NotificationProps {
  title?: string
  message: string
  type?: NotificationType
  duration?: number // auto dismiss in ms
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
}

const styleMap = {
  success: "border-green-500 bg-green-50 text-green-800",
  error: "border-red-500 bg-red-50 text-red-800",
  warning: "border-yellow-500 bg-yellow-50 text-yellow-800",
  info: "border-blue-500 bg-blue-50 text-blue-800",
}

export default function Notification({
  title,
  message,
  type = "info",
  duration = 3000,
}: NotificationProps) {
  const [visible, setVisible] = useState(true)
  const Icon = iconMap[type]

  /* ---------------- Auto dismiss ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  return (
    <div className="fixed top-4 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4">
      <div
        className={cn(
          "relative flex items-start gap-3 rounded-xl border p-4 shadow-lg",
          "animate-in fade-in slide-in-from-top-2",
          "animate-out fade-out slide-out-to-top-2",
          styleMap[type]
        )}
      >
        {/* Icon */}
        <Icon className="h-5 w-5 mt-0.5" />

        {/* Content */}
        <div className="flex-1">
          {title && <p className="font-semibold">{title}</p>}
          <p className="text-sm">{message}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setVisible(false)}
          className="absolute right-2 top-2 rounded-md p-1 hover:bg-black/10 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
