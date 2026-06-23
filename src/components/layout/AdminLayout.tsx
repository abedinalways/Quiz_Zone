"use client"

import { Sidebar } from "./Sidebar"
import { Navbar } from "./Navbar"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar type="admin" />
        <main className="flex-1 md:ml-64 p-6 pt-6">
          {children}
        </main>
      </div>
    </div>
  )
}
