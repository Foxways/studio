
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/auth-layout"
import { GlassCard } from "@/components/glass-card"
import { useToast } from "@/hooks/use-toast"
import { useAuthStore } from "@/stores/auth-store"
import { useUserStore } from "@/stores/user-store"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login } = useAuthStore();
  const { users } = useUserStore();
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    const user = users.find(
      (u) => u.email === email && u.password === password
    )

    if (user) {
      if (!user.active) {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Your account is inactive. Please contact an administrator.",
        })
        return;
      }
      login(user.email);
      
      if (user.password === 'password123') {
        router.push("/force-reset-password");
      } else {
        router.push("/dashboard")
      }

    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      })
    }
  }

  return (
    <AuthLayout>
      <GlassCard className="w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to access your vault.</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                className="pl-10 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? 'Hide password' : 'Show password'}</span>
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full font-semibold">
            Login
          </Button>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline"
              >
                Sign up
              </Link>
            </p>
            <p className="text-muted-foreground mt-2">
              <Link
                href="/forgot-password"
                className="text-xs hover:underline"
              >
                Forgot password?
              </Link>
            </p>
          </div>
        </form>
      </GlassCard>
    </AuthLayout>
  )
}
