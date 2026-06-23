import { baseApi } from "./baseApi"
import type { ApiResponse, Notification } from "@/types"

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ApiResponse<Notification[]>, { page?: number }>({
      query: (params) => ({
        url: "/notifications",
        params,
      }),
      providesTags: ["Notification"],
    }),
    getUnreadCount: builder.query<ApiResponse<{ count: number }>, void>({
      query: () => "/notifications/unread-count",
      providesTags: ["Notification"],
    }),
    markNotificationRead: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
    markAllRead: builder.mutation<ApiResponse<null>, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PUT",
      }),
      invalidatesTags: ["Notification"],
    }),
    deleteNotification: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
})

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllReadMutation,
  useDeleteNotificationMutation,
} = notificationApi
