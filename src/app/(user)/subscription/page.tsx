"use client"

import { UserLayout } from "@/components/layout/UserLayout"
import { useAuth } from "@/hooks/useAuth"
import { useGetMySubscriptionQuery, useGetPlansQuery, useCreateCheckoutSessionMutation, useCancelSubscriptionMutation } from "@/lib/store/api/subscriptionApi"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Check, CreditCard, XCircle } from "lucide-react"
import { toast } from "sonner"

export default function SubscriptionPage() {
  useAuth(true)
  const { data: subscription } = useGetMySubscriptionQuery()
  const { data: plans, isLoading: plansLoading } = useGetPlansQuery()
  const [createCheckout, { isLoading: checkoutLoading }] =
    useCreateCheckoutSessionMutation()
  const [cancelSub, { isLoading: cancelling }] =
    useCancelSubscriptionMutation()

  const handleSubscribe = async (plan: string) => {
    try {
      const priceMap: Record<string, string> = {
        monthly: "price_monthly",
        yearly: "price_yearly",
        lifetime: "price_lifetime",
      }

      const result = await createCheckout({
        priceId: priceMap[plan],
        plan,
      }).unwrap()

      if (result.data?.url) {
        window.location.href = result.data.url
      } else if (result.data?.sessionId) {
        window.location.href = `${process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://checkout.stripe.com"}?session_id=${result.data.sessionId}`
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to start checkout")
    }
  }

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return
    try {
      await cancelSub().unwrap()
      toast.success("Subscription cancelled")
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel")
    }
  }

  const isSubscribed = subscription?.data?.status === "active"

  return (
    <UserLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription</h1>
          <p className="text-muted-foreground mt-1">
            Get unlimited access to all quizzes
          </p>
        </div>

        {isSubscribed && (
          <Card className="border-green-500">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                  Active
                </Badge>
                <CardTitle>Your Subscription</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Plan: {subscription.data?.plan}
              </p>
              {subscription.data?.endDate && (
                <p className="text-sm text-muted-foreground">
                  Expires:{" "}
                  {new Date(subscription.data.endDate).toLocaleDateString()}
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Cancel Subscription
              </Button>
            </CardFooter>
          </Card>
        )}

        {plansLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {plans?.data?.map((plan) => (
              <Card key={plan.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl capitalize">
                    {plan.name}
                  </CardTitle>
                  <CardDescription>{plan.interval}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="text-3xl font-bold mb-4">
                    ${plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.interval}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={checkoutLoading || isSubscribed}
                  >
                    {checkoutLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <CreditCard className="h-4 w-4 mr-2" />
                    )}
                    {isSubscribed ? "Current Plan" : "Subscribe"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </UserLayout>
  )
}
