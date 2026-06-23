"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks"
import { setSidebarOpen } from "@/lib/store/slices/uiSlice"
import {
  LayoutDashboard,
  GraduationCap,
  Trophy,
  MessageSquare,
  CreditCard,
  Users,
  Settings,
  BarChart3,
  Flag,
  X,
} from "lucide-react"

interface SidebarProps {
  type: "user" | "admin"
}

const userLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/quizzes", label: "Quizzes", icon: GraduationCap },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/messages", label: "Messages", icon: MessageSquare },
  { href: "/subscription", label: "Subscription", icon: CreditCard },
  { href: "/profile", label: "Profile", icon: Users },
  { href: "/profile/settings", label: "Settings", icon: Settings },
]

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/quizzes", label: "Manage Quizzes", icon: GraduationCap },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/admin/reports", label: "Reports", icon: Flag },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
]

export function Sidebar({ type }: SidebarProps) {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { sidebarOpen } = useAppSelector((state) => state.ui)
  const links = type === "admin" ? adminLinks : userLinks

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 md:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
        onClick={() => dispatch(setSidebarOpen(false))}
      />
      <aside
        className={cn(
          "fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 md:hidden">
          <span className="font-semibold">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(setSidebarOpen(false))}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="h-full py-4">
          <nav className="space-y-1 px-2">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => dispatch(setSidebarOpen(false))}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3",
                      isActive && "bg-secondary font-medium"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </ScrollArea>
      </aside>
    </>
  )
}
