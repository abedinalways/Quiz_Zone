import { baseApi } from "./baseApi"
import type {
  ApiResponse,
  PaginatedResponse,
  Quiz,
  QuizResult,
  QuizSubmission,
  QuizCategory,
} from "@/types"

export const quizApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getQuizzes: builder.query<
      PaginatedResponse<Quiz>,
      { page?: number; limit?: number; category?: string; difficulty?: string; search?: string }
    >({
      query: (params) => ({
        url: "/quizzes",
        params,
      }),
      providesTags: ["Quiz"],
    }),
    getQuizById: builder.query<ApiResponse<Quiz>, string>({
      query: (id) => `/quizzes/${id}`,
      providesTags: ["Quiz"],
    }),
    getCategories: builder.query<ApiResponse<QuizCategory[]>, void>({
      query: () => "/quizzes/categories",
      providesTags: ["Category"],
    }),
    submitQuiz: builder.mutation<ApiResponse<QuizResult>, QuizSubmission>({
      query: (data) => ({
        url: "/quizzes/submit",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["QuizResult"],
    }),
    getMyResults: builder.query<PaginatedResponse<QuizResult>, { page?: number; limit?: number }>(
      {
        query: (params) => ({
          url: "/quizzes/my-results",
          params,
        }),
        providesTags: ["QuizResult"],
      }
    ),
    getQuizResult: builder.query<ApiResponse<QuizResult>, string>({
      query: (id) => `/quizzes/result/${id}`,
      providesTags: ["QuizResult"],
    }),
    getLeaderboard: builder.query<
      any,
      { quizId?: string; global?: boolean }
    >({
      query: (params) => ({
        url: "/quizzes/leaderboard",
        params,
      }),
      providesTags: ["Leaderboard"],
    }),

    // Admin endpoints
    createQuiz: builder.mutation<ApiResponse<Quiz>, Partial<Quiz>>({
      query: (data) => ({
        url: "/admin/quizzes",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Quiz"],
    }),
    updateQuiz: builder.mutation<ApiResponse<Quiz>, { id: string; data: Partial<Quiz> }>({
      query: ({ id, data }) => ({
        url: `/admin/quizzes/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Quiz"],
    }),
    deleteQuiz: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/admin/quizzes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Quiz"],
    }),
  }),
})

export const {
  useGetQuizzesQuery,
  useGetQuizByIdQuery,
  useGetCategoriesQuery,
  useSubmitQuizMutation,
  useGetMyResultsQuery,
  useGetQuizResultQuery,
  useGetLeaderboardQuery,
  useCreateQuizMutation,
  useUpdateQuizMutation,
  useDeleteQuizMutation,
} = quizApi
