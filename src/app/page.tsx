
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import { Fingerprint, Mail, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

  const handleBiometricLogin = async () => {
    toast({
        title: 'Authenticating...',
        description: 'Please use your device\'s biometric sensor.'
    });

    // Simulate a delay for the biometric scan
    await new Promise(resolve => setTimeout(resolve, 1500));

    // For this simulation, we'll try to log in a default user.
    // In a real application, this would involve the WebAuthn API and a backend.
    const biometricUser = users.find(u => u.email === 'user@example.com');

    if (biometricUser && biometricUser.active) {
        login(biometricUser.email);
        toast({
            title: 'Login Successful',
            description: `Welcome back, ${biometricUser.name}!`
        });
        if (biometricUser.password === 'password123') {
            router.push("/force-reset-password");
        } else {
            router.push("/dashboard");
        }
    } else {
        toast({
            variant: "destructive",
            title: "Authentication Failed",
            description: "Biometric login is not set up for this device or user.",
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
                type="password"
                placeholder="Password"
                required
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" className="w-full font-semibold">
            Login
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="secondary" className="w-full font-semibold" type="button" onClick={handleBiometricLogin}>
            <Fingerprint className="mr-2 h-5 w-5" />
            Login with Biometrics
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
