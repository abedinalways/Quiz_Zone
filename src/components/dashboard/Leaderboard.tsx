"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  name: string
  avatar?: string
  score: number
  quizzesTaken: number
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  title?: string
}

export function Leaderboard({ entries, title = "Leaderboard" }: LeaderboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.rank}
              className="flex items-center gap-4 p-3 rounded-lg border"
            >
              <div className="flex-shrink-0 w-8 text-center font-bold text-muted-foreground">
                #{entry.rank}
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={entry.avatar} />
                <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{entry.name}</p>
                <p className="text-sm text-muted-foreground">
                  {entry.quizzesTaken} quizzes
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{entry.score}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
