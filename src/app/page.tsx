import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Trophy, MessageSquare, CreditCard, Users, Zap } from "lucide-react"

const features = [
  {
    icon: GraduationCap,
    title: "MCQ Quizzes",
    description:
      "Challenge yourself with quizzes across various categories and difficulty levels.",
  },
  {
    icon: Trophy,
    title: "Leaderboard",
    description:
      "Compete with others and climb the ranks with your quiz scores.",
  },
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description:
      "Connect with other users and get support through real-time messaging.",
  },
  {
    icon: CreditCard,
    title: "Subscription",
    description:
      "Get 50 free quizzes, then subscribe for unlimited access.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Follow other users, build your network, and learn together.",
  },
  {
    icon: Zap,
    title: "Multiple Difficulties",
    description:
      "Choose from Easy, Medium, and Hard modes to match your skill level.",
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <GraduationCap className="h-6 w-6" />
            QuizZone
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl mb-6">
            Test Your Knowledge
            <span className="text-primary block mt-2">with QuizZone</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Challenge yourself with thousands of MCQ quizzes, compete on leaderboards,
            and learn something new every day.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Start Quizzing</Button>
            </Link>
            <Link href="/quizzes">
              <Button size="lg" variant="outline">Browse Quizzes</Button>
            </Link>
          </div>
        </section>

        <section className="border-t py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything you need to learn and compete
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex flex-col items-center text-center p-6 rounded-lg border bg-card"
                >
                  <feature.icon className="h-10 w-10 mb-4 text-primary" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t py-20 bg-muted/50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sign up today and get 50 free quizzes. Subscribe for unlimited access!
            </p>
            <Link href="/register">
              <Button size="lg">Create Free Account</Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} QuizZone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
