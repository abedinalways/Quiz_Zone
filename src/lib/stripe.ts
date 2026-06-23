import { loadStripe, type Stripe } from "@stripe/stripe-js"

let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = (): Promise<Stripe | null> => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!stripePromise && key) {
    stripePromise = loadStripe(key)
  }
  return stripePromise!
}
