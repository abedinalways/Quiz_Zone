export type UserRole = "user" | "admin" | "moderator"
export type QuizDifficulty = "easy" | "medium" | "hard"
export type QuizStatus = "draft" | "published" | "archived"
export type SubscriptionStatus = "active" | "inactive" | "expired" | "cancelled"
export type ReportReason = "spam" | "harassment" | "inappropriate" | "cheating" | "other"
export type MessageType = "text" | "image" | "system"
export type NotificationType = "message" | "follow" | "quiz_result" | "achievement" | "subscription" | "report"

export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  quizzesTaken: number
  totalScore: number
  followers: string[]
  following: string[]
  subscription: SubscriptionStatus
  subscriptionExpiry?: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface Quiz {
  _id: string
  title: string
  description: string
  category: string
  difficulty: QuizDifficulty
  timeLimit: number
  passingScore: number
  questions: Question[]
  status: QuizStatus
  createdBy: string | User
  totalAttempts: number
  averageScore: number
  createdAt: string
  updatedAt: string
}

export interface Question {
  _id: string
  text: string
  options: string[]
  correctOption: number
  explanation?: string
}

export interface QuizResult {
  _id: string
  user: string | User
  quiz: string | Quiz
  score: number
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  timeTaken: number
  answers: number[]
  completedAt: string
}

export interface Message {
  _id: string
  sender: string | User
  receiver: string | User
  content: string
  messageType: MessageType
  read: boolean
  createdAt: string
}

export interface Notification {
  _id: string
  user: string | User
  type: NotificationType
  title: string
  message: string
  read: boolean
  link?: string
  createdAt: string
}

export interface Subscription {
  _id: string
  user: string | User
  plan: "monthly" | "yearly" | "lifetime"
  status: SubscriptionStatus
  price: number
  startDate: string
  endDate: string
  stripeSubscriptionId?: string
  stripePaymentId?: string
  createdAt: string
}

export interface LeaderboardEntry {
  user: Pick<User, "_id" | "name" | "avatar">
  totalScore: number
  quizzesTaken: number
  averageScore: number
  rank: number
}

export interface Follow {
  _id: string
  follower: string | User
  following: string | User
  createdAt: string
}

export interface Report {
  _id: string
  reporter: string | User
  reported: string | User
  reason: ReportReason
  description: string
  resolved: boolean
  createdAt: string
}

export interface QuizCategory {
  _id: string
  name: string
  description: string
  icon: string
  quizCount: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data: T
  error?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface QuizSubmission {
  quizId: string
  answers: number[]
  timeTaken: number
}
