
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
      <div className="relative z-10 flex flex-col md:flex-row">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out md:ml-64 min-h-screen">
          <DashboardHeader />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
          <footer className="text-center p-4 text-muted-foreground text-sm shrink-0">
            Copyright 2025 | Powered by kishanmanohar@gmail.com - V.1.0.0
          </footer>
        </div>
      </div>
    </div>
  )
}
