"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/auth-layout"
import { GlassCard } from "@/components/glass-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RegisterPage() {
  const router = useRouter()

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd handle registration logic here
    router.push("/dashboard")
  }

  return (
    <AuthLayout>
      <GlassCard className="w-full max-w-md">
        <form onSubmit={handleRegister} className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-muted-foreground">
              Start your secure journey with SecurePass.
            </p>
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
              />
            </div>
            <div className="relative">
               <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm Password"
                required
                className="pl-10"
              />
            </div>
            <div className="relative">
              <HelpCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Select>
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select a security question" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pet">What was your first pet's name?</SelectItem>
                  <SelectItem value="city">In what city were you born?</SelectItem>
                  <SelectItem value="mother">What is your mother's maiden name?</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="relative">
              <Input
                id="security-answer"
                type="text"
                placeholder="Your Answer"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full font-semibold">
            Create Account
          </Button>
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/"
                className="font-medium text-primary hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </GlassCard>
    </AuthLayout>
  )
}
