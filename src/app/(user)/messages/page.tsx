"use client"

import { useState } from "react"
import { UserLayout } from "@/components/layout/UserLayout"
import { useAuth } from "@/hooks/useAuth"
import { useChat } from "@/hooks/useChat"
import { useGetConversationsQuery, useGetMessagesQuery } from "@/lib/store/api/messageApi"
import { useSendMessageMutation } from "@/lib/store/api/messageApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Loader2, Send, MessageSquare } from "lucide-react"

export default function MessagesPage() {
  const { user } = useAuth(true)
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [messageText, setMessageText] = useState("")

  const { data: conversations, isLoading: convsLoading } =
    useGetConversationsQuery()
  const { data: messages, isLoading: msgsLoading } = useGetMessagesQuery(
    { userId: selectedUser || "" },
    { skip: !selectedUser }
  )

  const [sendMessage] = useSendMessageMutation()

  const handleSend = async () => {
    if (!messageText.trim() || !selectedUser) return
    try {
      await sendMessage({
        receiverId: selectedUser,
        content: messageText,
      }).unwrap()
      setMessageText("")
    } catch (error) {
      console.error("Failed to send message", error)
    }
  }

  return (
    <UserLayout>
      <div className="h-[calc(100vh-8rem)]">
        <Card className="h-full">
          <div className="flex h-full">
            <div className="w-80 border-r">
              <CardHeader>
                <CardTitle className="text-lg">Conversations</CardTitle>
              </CardHeader>
              <ScrollArea className="h-[calc(100%-5rem)]">
                {convsLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : conversations?.data?.length === 0 ? (
                  <div className="text-center py-8 px-4">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No conversations yet
                    </p>
                  </div>
                ) : (
                  conversations?.data?.map((conv: any) => (
                    <div key={conv.user._id}>
                      <button
                        className={`w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors ${
                          selectedUser === conv.user._id ? "bg-muted" : ""
                        }`}
                        onClick={() => setSelectedUser(conv.user._id)}
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conv.user.avatar} />
                          <AvatarFallback>
                            {conv.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">
                            {conv.user.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.lastMessage.content}
                          </p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-5 flex items-center justify-center px-1">
                            {conv.unreadCount}
                          </span>
                        )}
                      </button>
                      <Separator />
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>

            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  <CardHeader className="border-b">
                    <CardTitle className="text-lg">
                      {conversations?.data?.find(
                        (c: any) => c.user._id === selectedUser
                      )?.user.name || "Chat"}
                    </CardTitle>
                  </CardHeader>
                  <ScrollArea className="flex-1 p-4">
                    {msgsLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-5 w-5 animate-spin" />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages?.data?.map((msg: any) => (
                          <div
                            key={msg._id}
                            className={`flex ${
                              msg.sender === user?._id
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                msg.sender === user?._id
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
                        ))}
                      </div>
                    )}
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
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Type a message..."
                      />
                      <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg text-muted-foreground">
                      Select a conversation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </UserLayout>
  )
}
