"use client"

import { useEffect, useRef } from "react"
import {WS_URL} from "../lib/config"
export function useWebSocket(onMessage: (data: any) => void) {
  const socketRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const socket = new WebSocket(WS_URL)

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
