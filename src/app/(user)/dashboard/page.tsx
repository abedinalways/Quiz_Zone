"use client"

import { useAuth } from "@/hooks/useAuth"
import { UserLayout } from "@/components/layout/UserLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetMyResultsQuery } from "@/lib/store/api/quizApi"
import { useGetRemainingFreeQuizzesQuery } from "@/lib/store/api/subscriptionApi"
import {
  GraduationCap,
  Trophy,
  Target,
  Clock,
  Loader2,
} from "lucide-react"

export default function UserDashboardPage() {
  const { user, isLoading: authLoading } = useAuth(true)
  const { data: resultsData, isLoading: resultsLoading } = useGetMyResultsQuery({
    page: 1,
    limit: 5,
  })
  const { data: freeQuizzes } = useGetRemainingFreeQuizzesQuery()

  if (authLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </UserLayout>
    )
  }

  const stats = [
    {
      title: "Quizzes Taken",
      value: resultsData?.total || 0,
      icon: GraduationCap,
    },
    {
      title: "Total Score",
      value: user?.totalScore || 0,
      icon: Trophy,
    },
    {
      title: "Accuracy",
      value: resultsData?.total
        ? `${Math.round(
            (resultsData.data.reduce(
              (acc, r) => acc + (r.correctAnswers / r.totalQuestions) * 100,
              0
            ) / resultsData.total)
          )}%`
        : "0%",
      icon: Target,
    },
    {
      title: "Free Quizzes Left",
      value: freeQuizzes?.data?.remaining ?? 50,
      icon: Clock,
    },
  ]

  const recentResults = resultsData?.data || []

  return (
    <UserLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s your quiz activity overview.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Quiz Results</CardTitle>
          </CardHeader>
          <CardContent>
            {resultsLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : recentResults.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                You haven&apos;t taken any quizzes yet. Start quizzing!
              </p>
            ) : (
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <div
                    key={result._id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-medium">
                        {typeof result.quiz === "object"
                          ? result.quiz.title
                          : "Quiz"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {result.correctAnswers}/{result.totalQuestions} correct
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {Math.round(
                          (result.correctAnswers / result.totalQuestions) * 100
                        )}
                        %
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {result.timeTaken}s
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  )
}
