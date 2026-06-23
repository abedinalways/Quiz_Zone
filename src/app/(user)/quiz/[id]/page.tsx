"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { UserLayout } from "@/components/layout/UserLayout"
import { useAuth } from "@/hooks/useAuth"
import { useGetQuizByIdQuery, useSubmitQuizMutation } from "@/lib/store/api/quizApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, Clock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"

interface QuizPageProps {
  params: { id: string }
}

export default function QuizPage({ params }: QuizPageProps) {
  const router = useRouter()
  useAuth(true)

  const { data: quizData, isLoading: quizLoading } = useGetQuizByIdQuery(params.id)
  const [submitQuiz, { isLoading: submitting }] = useSubmitQuizMutation()

  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [result, setResult] = useState<any>(null)

  const quiz = quizData?.data

  useEffect(() => {
    if (quiz) {
      setAnswers(new Array(quiz.questions.length).fill(-1))
    }
  }, [quiz])

  useEffect(() => {
    if (!started || finished || !quiz) return

    setTimeLeft(quiz.timeLimit * 60)
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [started, finished, quiz])

  const handleSubmit = useCallback(async () => {
    if (submitting || !quiz) return
    setFinished(true)

    try {
      const result = await submitQuiz({
        quizId: quiz._id,
        answers,
        timeTaken: (quiz.timeLimit * 60) - timeLeft,
      }).unwrap()
      setResult(result.data)
      toast.success("Quiz submitted!")
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit quiz")
      setFinished(false)
    }
  }, [answers, quiz, submitQuiz, timeLeft, submitting])

  if (quizLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </UserLayout>
    )
  }

  if (!quiz) {
    return (
      <UserLayout>
        <div className="text-center py-20">
          <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg">Quiz not found</p>
        </div>
      </UserLayout>
    )
  }

  if (!started) {
    return (
      <UserLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <div className="flex items-center justify-center gap-4 mt-4">
                <Badge>{quiz.difficulty}</Badge>
                <span className="text-sm text-muted-foreground">
                  {quiz.questions.length} Questions
                </span>
                <span className="text-sm text-muted-foreground">
                  {quiz.timeLimit} Minutes
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                {quiz.description}
              </p>
              <div className="mt-6 space-y-2 text-sm">
                <p>✓ Read each question carefully</p>
                <p>✓ You can only submit once</p>
                <p>✓ Timer starts when you begin</p>
                <p>✓ Passing score: {quiz.passingScore}%</p>
              </div>
            </CardContent>
            <div className="flex justify-center pb-6">
              <Button size="lg" onClick={() => setStarted(true)}>
                Start Quiz
              </Button>
            </div>
          </Card>
        </div>
      </UserLayout>
    )
  }

  if (finished && result) {
    const percentage = Math.round(
      (result.correctAnswers / result.totalQuestions) * 100
    )
    return (
      <UserLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">{percentage}%</div>
                <p className="text-muted-foreground">
                  {result.correctAnswers} / {result.totalQuestions} correct
                </p>
              </div>
              <Progress value={percentage} className="h-3" />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <p className="text-2xl font-bold text-green-600">
                    {result.correctAnswers}
                  </p>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <p className="text-2xl font-bold text-red-600">
                    {result.incorrectAnswers}
                  </p>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </div>
              </div>
            </CardContent>
            <div className="flex justify-center gap-4 pb-6">
              <Button variant="outline" onClick={() => router.push("/quizzes")}>
                More Quizzes
              </Button>
              <Button onClick={() => router.push("/dashboard")}>
                Dashboard
              </Button>
            </div>
          </Card>
        </div>
      </UserLayout>
    )
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{quiz.title}</h1>
          <div className="flex items-center gap-2 text-lg font-mono">
            <Clock className="h-5 w-5" />
            <span className={timeLeft < 60 ? "text-red-500" : ""}>
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <Progress
          value={
            (answers.filter((a) => a !== -1).length / quiz.questions.length) *
            100
          }
          className="h-2"
        />

        {quiz.questions.map((question, index) => (
          <Card key={question._id}>
            <CardHeader>
              <CardTitle className="text-base">
                <span className="text-muted-foreground mr-2">
                  {index + 1}.
                </span>
                {question.text}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[index]?.toString()}
                onValueChange={(value) => {
                  const newAnswers = [...answers]
                  newAnswers[index] = parseInt(value)
                  setAnswers(newAnswers)
                }}
              >
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
                  >
                    <RadioGroupItem
                      value={optIndex.toString()}
                      id={`q${index}-o${optIndex}`}
                    />
                    <Label
                      htmlFor={`q${index}-o${optIndex}`}
                      className="flex-1 cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-center pb-8">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={submitting || answers.includes(-1)}
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Submit Quiz
          </Button>
        </div>
      </div>
    </UserLayout>
  )
}
