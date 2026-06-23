"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, Clock } from "lucide-react"
import type { Quiz, Question } from "@/types"

interface QuizPlayerProps {
  quiz: Quiz
  onSubmit: (answers: number[]) => void
  isSubmitting: boolean
}

export function QuizPlayer({ quiz, onSubmit, isSubmitting }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<number[]>(
    new Array(quiz.questions.length).fill(-1)
  )
  const [currentQuestion, setCurrentQuestion] = useState(0)

  const question = quiz.questions[currentQuestion]
  const answeredCount = answers.filter((a) => a !== -1).length
  const progress = (answeredCount / quiz.questions.length) * 100

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = parseInt(value)
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const canSubmit = answers.every((a) => a !== -1)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {quiz.questions.length}
        </span>
        <span className="text-sm text-muted-foreground">
          {answeredCount} answered
        </span>
      </div>

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{question.text}</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentQuestion]?.toString()}
            onValueChange={handleAnswer}
          >
            {question.options.map((option, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 rounded-lg border p-3 hover:bg-muted/50 cursor-pointer"
              >
                <RadioGroupItem
                  value={index.toString()}
                  id={`q${currentQuestion}-o${index}`}
                />
                <Label
                  htmlFor={`q${currentQuestion}-o${index}`}
                  className="flex-1 cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <div className="flex gap-2">
          {currentQuestion < quiz.questions.length - 1 ? (
            <Button onClick={handleNext} disabled={answers[currentQuestion] === -1}>
              Next
            </Button>
          ) : (
            <Button
              onClick={() => onSubmit(answers)}
              disabled={!canSubmit || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Submit Quiz
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
