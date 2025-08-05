
'use client'

import { useState } from 'react'
import { Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/page-header'
import { GlassCard } from '@/components/glass-card'
import { useToast } from '@/hooks/use-toast'
import { PasswordGeneratorForm } from '@/components/password-generator-form'

export default function PasswordGeneratorPage() {
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      toast({ title: 'Copied!', description: 'Password copied to clipboard.' });
    }
  };

  return (
    <>
      <PageHeader
        title="Advanced Password Generator"
        description="Craft a strong, unique password for you."
      >
         {generatedPassword && (
          <Button onClick={handleCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Password
          </Button>
        )}
      </PageHeader>
      
      <div className="space-y-4">
        {generatedPassword && (
          <GlassCard>
              <p className="text-2xl md:text-3xl font-mono p-4 bg-black/20 rounded-md break-all text-white text-center">
                  {generatedPassword}
              </p>
          </GlassCard>
        )}

        <GlassCard className="max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">Customize Your Password</h3>
          <PasswordGeneratorForm onPasswordGenerated={setGeneratedPassword} showUsePasswordButton={false} />
        </GlassCard>
      </div>
    </>
  )
}
