import { baseApi } from "./baseApi"
import type { ApiResponse, Subscription } from "@/types"

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMySubscription: builder.query<ApiResponse<Subscription | null>, void>({
      query: () => "/subscriptions/my",
      providesTags: ["Subscription"],
    }),
    getPlans: builder.query<
      ApiResponse<{ id: string; name: string; price: number; interval: string; features: string[] }[]>,
      void
    >({
      query: () => "/subscriptions/plans",
    }),
    createCheckoutSession: builder.mutation<
      ApiResponse<{ sessionId: string; url: string }>,
      { priceId: string; plan: string }
    >({
      query: (data) => ({
        url: "/subscriptions/create-checkout",
        method: "POST",
        body: data,
      }),
    }),
    cancelSubscription: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/subscriptions/cancel",
        method: "POST",
      }),
      invalidatesTags: ["Subscription"],
    }),
    getRemainingFreeQuizzes: builder.query<ApiResponse<{ remaining: number }>, void>({
      query: () => "/subscriptions/free-quizzes-remaining",
    }),

    // Admin
    getAllSubscriptions: builder.query<ApiResponse<Subscription[]>, { page?: number }>({
      query: (params) => ({
        url: "/admin/subscriptions",
        params,
      }),
      providesTags: ["Subscription"],
    }),
  }),
})

export const {
  useGetMySubscriptionQuery,
  useGetPlansQuery,
  useCreateCheckoutSessionMutation,
  useCancelSubscriptionMutation,
  useGetRemainingFreeQuizzesQuery,
  useGetAllSubscriptionsQuery,
} = subscriptionApi
