'use client'

import { useState } from 'react'
import { ShieldAlert, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/page-header'
import { GlassCard } from '@/components/glass-card'
import type { MonitorDarkWebOutput } from '@/ai/flows/dark-web-monitoring'
import { monitorDarkWebAction } from '@/lib/actions'
import { useToast } from '@/hooks/use-toast'

export default function DarkWebMonitorPage() {
  const [email, setEmail] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [result, setResult] = useState<MonitorDarkWebOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !apiKey) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter both an email and an API key.' })
        return
    }
    setIsLoading(true)
    setResult(null)
    const response = await monitorDarkWebAction({ email, apiKey })

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

  return (
    <>
      <PageHeader
        title="Dark Web Monitor"
        description="Scan for your credentials in known data breaches."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium text-white">Enter Credentials to Scan</h3>
             <div>
                <label htmlFor="email" className="text-sm font-medium text-white/80">Email Address</label>
                <Input
                id="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-1"
                />
            </div>
             <div>
                <label htmlFor="apiKey" className="text-sm font-medium text-white/80">API Key</label>
                <Input
                id="apiKey"
                placeholder="Enter your monitoring service API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                type="password"
                className="mt-1"
                />
                 <p className="text-xs text-muted-foreground mt-1">Note: This is for demonstration. Use a valid key from a real service.</p>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShieldAlert className="mr-2 h-4 w-4" />
              )}
              Scan Now
            </Button>
          </form>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-medium text-white mb-4">Scan Result</h3>
          {isLoading && (
            <div className="flex justify-center items-center h-48">
              <ShieldAlert className="h-12 w-12 text-primary animate-pulse" />
            </div>
          )}
          {result && (
            <div className="space-y-4">
                <div className={`p-4 rounded-lg ${result.foundBreaches ? 'bg-red-900/50' : 'bg-green-900/50'}`}>
                    {result.foundBreaches ? (
                        <div className="flex items-center gap-4">
                            <AlertTriangle className="h-10 w-10 text-red-400 flex-shrink-0" />
                             <div>
                                <h4 className="text-xl font-bold text-white">Breaches Found</h4>
                                <p className="text-red-300">Your credentials appeared in one or more data breaches.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <CheckCircle2 className="h-10 w-10 text-green-400 flex-shrink-0" />
                            <div>
                                <h4 className="text-xl font-bold text-white">No Breaches Found</h4>
                                <p className="text-green-300">Your credentials were not found in any known breaches.</p>
                            </div>
                        </div>
                    )}
                </div>
                
                {result.foundBreaches && result.breachRecords && (
                    <div>
                        <h5 className="font-semibold text-white mb-2">Breach Details:</h5>
                        <ul className="space-y-2">
                        {result.breachRecords.map((breach, i) => (
                            <li key={i} className="p-3 bg-black/20 rounded-md">
                                <p className="font-semibold">{breach.source}</p>
                                <p className="text-sm text-muted-foreground">Date: {breach.breachDate}</p>
                                <p className="text-sm text-muted-foreground mt-1">{breach.description}</p>
                            </li>
                        ))}
                        </ul>
                    </div>
                )}
            </div>
          )}
          {!isLoading && !result && (
            <div className="text-center text-muted-foreground h-48 flex flex-col justify-center items-center">
              <p>Monitoring results will appear here.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </>
  )
}
