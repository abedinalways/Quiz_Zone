"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CreditCard } from "lucide-react"
import { useCreateCheckoutSessionMutation } from "@/lib/store/api/subscriptionApi"
import { toast } from "sonner"

interface CheckoutButtonProps {
  plan: string
  priceId: string
  label?: string
}

export function CheckoutButton({ plan, priceId, label = "Subscribe" }: CheckoutButtonProps) {
  const [createCheckout, { isLoading }] = useCreateCheckoutSessionMutation()

  const handleCheckout = async () => {
    try {
      const result = await createCheckout({ priceId, plan }).unwrap()

      if (result.data?.url) {
        window.location.href = result.data.url
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Checkout failed")
    }
  }

  return (
    <Button
      className="w-full"
      onClick={handleCheckout}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" />
      ) : (
        <CreditCard className="h-4 w-4 mr-2" />
      )}
      {label}
    </Button>
  )
}
