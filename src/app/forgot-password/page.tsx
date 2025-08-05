"use client"

import Link from "next/link"
import React, { useState } from "react"
import { Mail, HelpCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthLayout } from "@/components/auth-layout"
import { GlassCard } from "@/components/glass-card"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [step, setStep] = useState(1) // 1 for email, 2 for security question

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd verify the email exists
    setStep(2)
  }

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you'd verify the answer and reset password
    alert("Password reset link sent!")
  }

  return (
    <AuthLayout>
      <GlassCard className="w-full max-w-md">
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Forgot Password</h2>
              <p className="text-muted-foreground">
                Enter your email to recover your account.
              </p>
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" className="w-full font-semibold">
              Continue
            </Button>
            <div className="mt-6 text-center text-sm">
              <Link href="/" className="font-medium text-primary hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSecuritySubmit} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Security Question</h2>
              <p className="text-muted-foreground">
                Answer your security question to continue.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-md border border-input/50 bg-black/20 p-3">
                <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-white">What was your first pet's name?</p>
              </div>
              <Input
                id="security-answer"
                type="text"
                placeholder="Your Answer"
                required
              />
            </div>
            <Button type="submit" className="w-full font-semibold">
              Reset Password
            </Button>
             <div className="mt-6 text-center text-sm">
              <button onClick={() => setStep(1)} type="button" className="font-medium text-primary hover:underline">
                Use a different email
              </button>
            </div>
          </form>
        )}
      </GlassCard>
    </AuthLayout>
  )
}
