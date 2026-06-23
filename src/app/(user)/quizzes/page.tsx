"use client"

import { useState } from "react"
import Link from "next/link"
import { UserLayout } from "@/components/layout/UserLayout"
import { useAuth } from "@/hooks/useAuth"
import { useGetQuizzesQuery, useGetCategoriesQuery } from "@/lib/store/api/quizApi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Search } from "lucide-react"

const difficultyColors = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
}

export default function QuizzesPage() {
  useAuth(true)
  const [search, setSearch] = useState("")
  const [difficulty, setDifficulty] = useState("all")
  const [category, setCategory] = useState("all")

  const { data: categories } = useGetCategoriesQuery()
  const { data: quizzesData, isLoading } = useGetQuizzesQuery({
    search,
    difficulty: difficulty === "all" ? undefined : difficulty,
    category: category === "all" ? undefined : category,
    page: 1,
    limit: 20,
  })

  const quizzes = quizzesData?.data || []

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Browse Quizzes</h1>
          <p className="text-muted-foreground mt-1">
            Choose a quiz and test your knowledge
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search quizzes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={difficulty} onValueChange={(v) => v && setDifficulty(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={(v) => v && setCategory(v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.data?.map((cat) => (
                <SelectItem key={cat._id} value={cat._id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No quizzes found. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <Card key={quiz._id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={difficultyColors[quiz.difficulty]}>
                      {quiz.difficulty}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {quiz.questions?.length || 0} questions
                    </span>
                  </div>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {quiz.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{quiz.timeLimit} min</span>
                    <span>{quiz.totalAttempts} attempts</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/quiz/${quiz._id}`}>
                    <Button className="w-full">Start Quiz</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  )
}
