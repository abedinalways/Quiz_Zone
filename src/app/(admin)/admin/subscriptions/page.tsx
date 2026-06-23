"use client"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { useAuth } from "@/hooks/useAuth"
import { useGetAllSubscriptionsQuery } from "@/lib/store/api/subscriptionApi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, CreditCard } from "lucide-react"

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  expired: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  cancelled: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100",
}

export default function AdminSubscriptionsPage() {
  useAuth(true, true)
  const { data, isLoading } = useGetAllSubscriptionsQuery({})

  const subscriptions = data?.data || []

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscriptions</h1>
          <p className="text-muted-foreground mt-1">
            Manage user subscriptions
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                All Subscriptions ({subscriptions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub._id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold capitalize">
                          {typeof sub.user === "object"
                            ? (sub.user as any).name
                            : "User"}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {sub.plan} plan
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={statusColors[sub.status]}>
                        {sub.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        ${sub.price} &middot;{" "}
                        {sub.endDate
                          ? new Date(sub.endDate).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
