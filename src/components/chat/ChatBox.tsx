"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Loader2 } from "lucide-react"
import { useChat } from "@/hooks/useChat"
import type { Message, User } from "@/types"

interface ChatBoxProps {
  receiver: { _id: string; name: string; avatar?: string }
  currentUser: User
  initialMessages?: Message[]
}

export function ChatBox({ receiver, currentUser, initialMessages = [] }: ChatBoxProps) {
  const [message, setMessage] = useState("")
  const { messages, sendMessage, isTyping, emitTyping } = useChat({
    receiverId: receiver._id,
  })

  const allMessages = [...initialMessages, ...messages]

  const handleSend = () => {
    if (!message.trim()) return
    sendMessage(message)
    setMessage("")
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="border-b py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={receiver.avatar} />
            <AvatarFallback>{receiver.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <CardTitle className="text-sm">{receiver.name}</CardTitle>
        </div>
      </CardHeader>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {allMessages.map((msg, i) => {
            const isOwn = (msg.sender as string) === currentUser._id
            return (
              <div
                key={msg._id || i}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isOwn
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )
          })}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                <p className="text-sm text-muted-foreground">Typing...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            value={message}
            onChange={(e) => {
              setMessage(e.target.value)
              emitTyping()
            }}
            placeholder="Type a message..."
          />
          <Button type="submit" size="icon" disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </Card>
  )
}
