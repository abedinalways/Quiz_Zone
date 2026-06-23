"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { useSocket } from "@/lib/providers/SocketProvider"
import type { Message } from "@/types"

interface UseChatOptions {
  receiverId: string
  onNewMessage?: (message: Message) => void
}

export function useChat({ receiverId, onNewMessage }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const { socket, isConnected } = useSocket()
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!socket || !isConnected) return

    socket.emit("join:chat", receiverId)

    socket.on("message:receive", (message: Message) => {
      setMessages((prev) => [...prev, message])
      onNewMessage?.(message)
    })

    socket.on("user:typing", (userId: string) => {
      if (userId === receiverId) {
        setIsTyping(true)
      }
    })

    socket.on("user:stop-typing", (userId: string) => {
      if (userId === receiverId) {
        setIsTyping(false)
      }
    })

    return () => {
      socket.emit("leave:chat", receiverId)
      socket.off("message:receive")
      socket.off("user:typing")
      socket.off("user:stop-typing")
    }
  }, [socket, isConnected, receiverId, onNewMessage])

  const sendMessage = useCallback(
    (content: string) => {
      if (socket && isConnected) {
        socket.emit("message:send", { receiverId, content })
      }
    },
    [socket, isConnected, receiverId]
  )

  const emitTyping = useCallback(() => {
    if (socket && isConnected) {
      socket.emit("user:typing", receiverId)

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit("user:stop-typing", receiverId)
      }, 1000)
    }
  }, [socket, isConnected, receiverId])

  return {
    messages,
    setMessages,
    sendMessage,
    isTyping,
    emitTyping,
    isConnected,
  }
}
