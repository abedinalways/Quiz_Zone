"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io as SocketIOClient, type Socket } from "socket.io-client"
import { useAppSelector } from "../store/hooks"

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const token = useAppSelector((state) => state.auth.token)

  useEffect(() => {
    if (!token) {
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
      return
    }

    const socketInstance = SocketIOClient(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000",
      {
        auth: { token },
        transports: ["websocket", "polling"],
      }
    )

    socketInstance.on("connect", () => setIsConnected(true))
    socketInstance.on("disconnect", () => setIsConnected(false))

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [token])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
