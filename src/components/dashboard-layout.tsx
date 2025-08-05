"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import DashboardSidebar from "@/components/dashboard-sidebar"
import DashboardHeader from "@/components/dashboard-header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full bg-background">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/background-gradient.svg')" }}
      ></div>
      <div className="relative z-10">
        <SidebarProvider defaultOpen>
            <DashboardSidebar />
            <main className="flex flex-1 flex-col transition-[margin-left] duration-300 ease-in-out md:ml-64 min-h-screen">
              <DashboardHeader />
              <div className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
              </div>
               <footer className="text-center p-4 text-muted-foreground text-sm">
                Copyright 2025 | Powered by kishanmanohar@gmail.com - V.1.0.0
              </footer>
            </main>
        </SidebarProvider>
      </div>
    </div>
  )
}
