import type { PropsWithChildren } from "react"
import { ShieldCheck } from "lucide-react"

export function AuthLayout({ children }: PropsWithChildren) {
  return (
    <main className="relative min-h-screen w-full bg-background">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background-gradient.svg')" }}
      ></div>
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center p-4">
        <div className="flex-grow flex flex-col items-center justify-center w-full">
            <div className="mb-8 flex items-center gap-3 text-center">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <h1 className="text-4xl font-bold text-white">SecurePass</h1>
            </div>
            {children}
        </div>
        <footer className="w-full text-center p-4 text-muted-foreground text-sm">
            Copyright 2025 | Powered by kishanmanohar@gmail.com - V.1.0.0
        </footer>
      </div>
    </main>
  )
}
