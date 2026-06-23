import { baseApi } from "./baseApi"
import type { ApiResponse, Message } from "@/types"

export const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query<ApiResponse<{ user: { _id: string; name: string; avatar?: string }; lastMessage: Message; unreadCount: number }[]>, void>({
      query: () => "/messages/conversations",
      providesTags: ["Message"],
    }),
    getMessages: builder.query<
      ApiResponse<Message[]>,
      { userId: string; page?: number }
    >({
      query: ({ userId, page }) => ({
        url: `/messages/${userId}`,
        params: { page },
      }),
      providesTags: ["Message"],
    }),
    sendMessage: builder.mutation<
      ApiResponse<Message>,
      { receiverId: string; content: string }
    >({
      query: (data) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Message"],
    }),
    markAsRead: builder.mutation<ApiResponse<null>, string>({
      query: (messageId) => ({
        url: `/messages/read/${messageId}`,
        method: "PUT",
      }),
      invalidatesTags: ["Message"],
    }),
    deleteMessage: builder.mutation<ApiResponse<null>, string>({
      query: (messageId) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Message"],
    }),
  }),
})

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useDeleteMessageMutation,
} = messageApi
