"use client"

import { useEffect, useCallback } from "react"
import { useSocket } from "@/lib/providers/SocketProvider"
import { useAppSelector } from "@/lib/store/hooks"

type MessageHandler = (data: any) => void

export function useSocketEvent(event: string, handler: MessageHandler) {
  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (!socket || !isConnected) return

    socket.on(event, handler)
    return () => {
      socket.off(event, handler)
    }
  }, [socket, isConnected, event, handler])
}

export function useSocketEmit() {
  const { socket, isConnected } = useSocket()

  const emit = useCallback(
    (event: string, data?: any) => {
      if (socket && isConnected) {
        socket.emit(event, data)
      }
    },
    [socket, isConnected]
  )

  return { emit, isConnected }
}
