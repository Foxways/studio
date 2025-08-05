'use client'

import { useState } from 'react'
import { HeartPulse, RefreshCw, Shield, ShieldAlert, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { PageHeader } from '@/components/page-header'
import { GlassCard } from '@/components/glass-card'
import type { AnalyzePasswordStrengthOutput } from '@/ai/flows/analyze-password-strength'
import { analyzePasswordAction } from '@/lib/actions'
import { useToast } from '@/hooks/use-toast'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

const strengthMap = {
  weak: {
    label: 'Weak',
    color: 'bg-red-500',
    icon: ShieldAlert,
    value: 25,
  },
  moderate: {
    label: 'Moderate',
    color: 'bg-yellow-500',
    icon: Shield,
    value: 60,
  },
  strong: {
    label: 'Strong',
    color: 'bg-green-500',
    icon: ShieldCheck,
    value: 100,
  },
}

export default function PasswordAnalyzerPage() {
  const [password, setPassword] = useState('')
  const [result, setResult] = useState<AnalyzePasswordStrengthOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!password) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter a password.' })
        return
    }
    setIsLoading(true)
    setResult(null)
    const response = await analyzePasswordAction({ password })

    if (response.success && response.data) {
      setResult(response.data)
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      })
    }
    setIsLoading(false)
  }

  const strengthKey = result?.strength.toLowerCase() as keyof typeof strengthMap | undefined
  const strengthInfo = strengthKey ? strengthMap[strengthKey] : null

  return (
    <>
      <PageHeader
        title="Password Strength Analyzer"
        description="Analyze your password's strength and check for potential vulnerabilities."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium text-white">Enter Password</h3>
            <Textarea
              placeholder="Enter password to analyze..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rows={4}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <HeartPulse className="mr-2 h-4 w-4" />
              )}
              Analyze Password
            </Button>
          </form>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-medium text-white mb-4">Analysis Result</h3>
          {isLoading && (
            <div className="flex justify-center items-center h-48">
              <HeartPulse className="h-12 w-12 text-primary animate-pulse" />
            </div>
          )}
          {result && strengthInfo && (
            <div className="space-y-6">
                <div className='flex items-center gap-4'>
                    <strengthInfo.icon className={`h-10 w-10 ${strengthInfo.color.replace('bg-','text-')}`} />
                    <div>
                        <h4 className='text-xl font-bold text-white'>{strengthInfo.label}</h4>
                        <Progress value={strengthInfo.value} className={`h-2 mt-2 ${strengthInfo.color}`} />
                    </div>
                </div>
                {result.compromised && (
                    <Badge variant="destructive" className="text-base">Potentially Compromised</Badge>
                )}
                
                <div>
                    <h5 className="font-semibold text-white mb-2">Reasoning:</h5>
                    <p className="text-sm text-muted-foreground">{result.reasoning}</p>
                </div>

                <div>
                    <h5 className="font-semibold text-white mb-2">Suggestions for Improvement:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>

            </div>
          )}
          {!isLoading && !result && (
            <div className="text-center text-muted-foreground h-48 flex flex-col justify-center items-center">
              <p>Analysis will appear here.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </>
  )
}
