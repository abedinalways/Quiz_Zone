"use client"

import { StoreProvider } from "@/lib/providers/StoreProvider"
import { ThemeProvider } from "@/lib/providers/ThemeProvider"
import { SocketProvider } from "@/lib/providers/SocketProvider"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ThemeProvider>
        <SocketProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </SocketProvider>
      </ThemeProvider>
    </StoreProvider>
  )
}
