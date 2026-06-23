"use client"

import { UserLayout } from "@/components/layout/UserLayout"
import { useAuth } from "@/hooks/useAuth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, Mail, Calendar, Award, Users } from "lucide-react"

export default function ProfilePage() {
  const { user, isLoading } = useAuth(true)

  if (isLoading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </UserLayout>
    )
  }

  return (
    <UserLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-2xl">
                {user?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user?.name}</CardTitle>
            <div className="flex items-center justify-center gap-2 mt-1">
              <Badge variant="secondary">{user?.role}</Badge>
              {user?.subscription === "active" && (
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Subscribed
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="text-center pb-2">
              <Award className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-3xl">{user?.totalScore || 0}</CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              Total Score
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center pb-2">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-3xl">
                {user?.followers?.length || 0}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              Followers
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="text-center pb-2">
              <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
              <CardTitle className="text-3xl">
                {user?.following?.length || 0}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-sm text-muted-foreground">
              Following
            </CardContent>
          </Card>
        </div>
      </div>
    </UserLayout>
  )
}
