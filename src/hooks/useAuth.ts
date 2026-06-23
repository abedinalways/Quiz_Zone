"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { useGetProfileQuery } from "@/lib/store/api/authApi"
import { setCredentials, logout, setLoading } from "@/lib/store/slices/authSlice"

export function useAuth(requireAuth = false, requireAdmin = false) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, token, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth
  )

  const { data, isError, isSuccess } = useGetProfileQuery(undefined, {
    skip: !token,
  })

  useEffect(() => {
    if (!token) {
      dispatch(setLoading(false))
      return
    }

    if (isSuccess && data?.data) {
      dispatch(
        setCredentials({ user: data.data, token })
      )
    }

    if (isError) {
      dispatch(logout())
    }
  }, [isSuccess, isError, data, token, dispatch])

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        router.push("/login")
      }
      if (requireAdmin && user?.role !== "admin") {
        router.push("/dashboard")
      }
    }
  }, [isLoading, isAuthenticated, requireAuth, requireAdmin, user, router])

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    isAdmin: user?.role === "admin",
  }
}
