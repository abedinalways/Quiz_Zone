"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Flag, UserMinus, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useReportUserMutation } from "@/lib/store/api/userApi"
import { toast } from "sonner"

interface UserActionsProps {
  userId: string
  onFollow?: () => void
  onUnfollow?: () => void
  isFollowing?: boolean
}

export function UserActions({ userId, onFollow, onUnfollow, isFollowing }: UserActionsProps) {
  const router = useRouter()
  const [reportUser] = useReportUserMutation()

  const handleReport = async () => {
    const reason = prompt("Reason for report (spam, harassment, inappropriate, cheating, other):")
    if (!reason) return

    try {
      await reportUser({
        reportedId: userId,
        reason,
        description: reason,
      }).unwrap()
      toast.success("User reported")
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to report")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push(`/messages?user=${userId}`)}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Send Message
        </DropdownMenuItem>
        {isFollowing ? (
          <DropdownMenuItem onClick={onUnfollow}>
            <UserMinus className="mr-2 h-4 w-4" />
            Unfollow
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onFollow}>
            <UserMinus className="mr-2 h-4 w-4" />
            Follow
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleReport} className="text-red-600">
          <Flag className="mr-2 h-4 w-4" />
          Report User
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
