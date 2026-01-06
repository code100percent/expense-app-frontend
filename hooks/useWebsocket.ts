"use client"

import { useEffect, useRef } from "react"

export function useWebSocket(onMessage: (data: any) => void) {
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:5000")

    socket.onopen = () => {
      console.log("WebSocket connected")
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onMessage(data)
    }

    socket.onclose = () => {
      console.log("WebSocket disconnected")
    }

    socketRef.current = socket

    return () => socket.close()
  }, [])

  return socketRef
}
