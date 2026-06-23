"use client"

import { UserLayout } from "@/components/layout/UserLayout"
import { useAuth } from "@/hooks/useAuth"
import { useGetLeaderboardQuery } from "@/lib/store/api/quizApi"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trophy, Medal, Award } from "lucide-react"

const rankIcons = [
  { Icon: Trophy, className: "text-yellow-500" },
  { Icon: Medal, className: "text-gray-400" },
  { Icon: Award, className: "text-orange-500" },
]

export default function LeaderboardPage() {
  useAuth(true)
  const { data, isLoading } = useGetLeaderboardQuery({ global: true })

  const leaderboard = (data?.data as any)?.leaderboard || []

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">
            Top performers across all quizzes
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-20">
            <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg text-muted-foreground">
              No scores yet. Be the first!
            </p>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Global Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((entry: any, index: number) => (
                  <div
                    key={entry.user._id}
                    className="flex items-center gap-4 p-4 rounded-lg border"
                  >
                    <div className="flex-shrink-0 w-10 text-center">
                      {index < 3 ? (
                        <div className="flex justify-center">
                          {(() => {
                            const RankIcon = rankIcons[index].Icon
                            return (
                              <RankIcon
                                className={`h-6 w-6 mx-auto ${rankIcons[index].className}`}
                              />
                            )
                          })()}
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-muted-foreground">
                          #{index + 1}
                        </span>
                      )}
                    </div>
                    <Avatar>
                      <AvatarImage src={entry.user.avatar} />
                      <AvatarFallback>
                        {entry.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{entry.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.quizzesTaken} quizzes taken
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{entry.totalScore}</p>
                      <p className="text-xs text-muted-foreground">
                        Avg: {Math.round(entry.averageScore)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </UserLayout>
  )
}
