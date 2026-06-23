"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { useAuth } from "@/hooks/useAuth"
import { useGetQuizzesQuery, useDeleteQuizMutation } from "@/lib/store/api/quizApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  hard: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
}

export default function AdminQuizzesPage() {
  useAuth(true, true)
  const [page, setPage] = useState(1)
  const { data, isLoading } = useGetQuizzesQuery({ page, limit: 20 })
  const [deleteQuiz] = useDeleteQuizMutation()

  const quizzes = data?.data || []

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return
    try {
      await deleteQuiz(id).unwrap()
      toast.success("Quiz deleted")
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete")
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Quizzes</h1>
            <p className="text-muted-foreground mt-1">
              Create and manage quiz content
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Quiz
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>All Quizzes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz._id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{quiz.title}</h3>
                        <Badge className={difficultyColors[quiz.difficulty]}>
                          {quiz.difficulty}
                        </Badge>
                        <Badge variant="secondary">{quiz.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {quiz.questions?.length || 0} questions &middot;{" "}
                        {quiz.timeLimit} min &middot; {quiz.totalAttempts}{" "}
                        attempts
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(quiz._id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
