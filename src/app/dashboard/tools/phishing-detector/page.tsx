'use client'

import { useState } from 'react'
import { ScanSearch, RefreshCw, ShieldAlert, ShieldCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/page-header'
import { GlassCard } from '@/components/glass-card'
import type { PhishingDetectionOutput } from '@/ai/flows/phishing-detection'
import { detectPhishingAction } from '@/lib/actions'
import { useToast } from '@/hooks/use-toast'

export default function PhishingDetectorPage() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<PhishingDetectionOutput | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please enter a URL.' })
        return
    }
    setIsLoading(true)
    setResult(null)
    const response = await detectPhishingAction({ url })

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
        title="Phishing Detector"
        description="Analyze URLs for potential phishing attempts before you click."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <GlassCard>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-medium text-white">Enter URL to Scan</h3>
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ScanSearch className="mr-2 h-4 w-4" />
              )}
              Scan URL
            </Button>
          </form>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-medium text-white mb-4">Scan Result</h3>
          {isLoading && (
            <div className="flex justify-center items-center h-48">
              <ScanSearch className="h-12 w-12 text-primary animate-pulse" />
            </div>
          )}
          {result && (
            <div className="space-y-4">
                <div className={`flex items-center gap-4 p-4 rounded-lg ${result.isPhishing ? 'bg-red-900/50' : 'bg-green-900/50'}`}>
                    {result.isPhishing ? (
                        <ShieldAlert className="h-10 w-10 text-red-400 flex-shrink-0" />
                    ) : (
                        <ShieldCheck className="h-10 w-10 text-green-400 flex-shrink-0" />
                    )}
                    <div>
                        <h4 className="text-xl font-bold text-white">
                            {result.isPhishing ? "Potential Phishing Attempt" : "Looks Safe"}
                        </h4>
                    </div>
                </div>
                
                <div>
                    <h5 className="font-semibold text-white mb-2">AI Reasoning:</h5>
                    <p className="text-sm text-muted-foreground">{result.reason}</p>
                </div>
            </div>
          )}
          {!isLoading && !result && (
            <div className="text-center text-muted-foreground h-48 flex flex-col justify-center items-center">
              <p>Scan results will appear here.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </>
  )
}
