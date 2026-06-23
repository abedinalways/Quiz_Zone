"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { QuizDifficulty } from "@/types"

interface QuizCardProps {
  title: string
  description: string
  difficulty: QuizDifficulty
  questionCount: number
  timeLimit: number
  attempts: number
  onClick?: () => void
}

const difficultyConfig = {
  easy: {
    label: "Easy",
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  },
  medium: {
    label: "Medium",
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  },
  hard: {
    label: "Hard",
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  },
}

export function QuizCard({
  title,
  description,
  difficulty,
  questionCount,
  timeLimit,
  attempts,
  onClick,
}: QuizCardProps) {
  const config = difficultyConfig[difficulty]

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className={config.className}>{config.label}</Badge>
          <span className="text-xs text-muted-foreground">
            {questionCount} questions
          </span>
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{timeLimit} min</span>
          <span>{attempts} attempts</span>
        </div>
      </CardContent>
    </Card>
  )
}
