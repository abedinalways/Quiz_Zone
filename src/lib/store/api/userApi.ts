import { baseApi } from "./baseApi"
import type { ApiResponse, User, Follow, Report } from "@/types"

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<ApiResponse<User[]>, { search?: string; page?: number }>({
      query: (params) => ({
        url: "/users",
        params,
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query<ApiResponse<User>, string>({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),

    // Follow/Unfollow
    followUser: builder.mutation<ApiResponse<Follow>, string>({
      query: (userId) => ({
        url: `/users/${userId}/follow`,
        method: "POST",
      }),
      invalidatesTags: ["User", "Follow"],
    }),
    unfollowUser: builder.mutation<ApiResponse<null>, string>({
      query: (userId) => ({
        url: `/users/${userId}/unfollow`,
        method: "POST",
      }),
      invalidatesTags: ["User", "Follow"],
    }),
    getFollowers: builder.query<ApiResponse<User[]>, string>({
      query: (userId) => `/users/${userId}/followers`,
      providesTags: ["Follow"],
    }),
    getFollowing: builder.query<ApiResponse<User[]>, string>({
      query: (userId) => `/users/${userId}/following`,
      providesTags: ["Follow"],
    }),

    // Report
    reportUser: builder.mutation<
      ApiResponse<Report>,
      { reportedId: string; reason: string; description: string }
    >({
      query: (data) => ({
        url: "/users/report",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Report"],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowersQuery,
  useGetFollowingQuery,
  useReportUserMutation,
} = userApi
