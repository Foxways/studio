'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Bot, Check, Clipboard, RefreshCw, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { PageHeader } from '@/components/page-header'
import { GlassCard } from '@/components/glass-card'
import { useToast } from '@/hooks/use-toast'

const formSchema = z.object({
  length: z.number().min(8).max(128),
  useUppercase: z.boolean().default(true),
  useLowercase: z.boolean().default(true),
  useNumbers: z.boolean().default(true),
  useSymbols: z.boolean().default(true),
})

type FormSchema = z.infer<typeof formSchema>;

export default function PasswordGeneratorPage() {
  const [result, setResult] = useState<{ password: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      length: 16,
      useUppercase: true,
      useLowercase: true,
      useNumbers: true,
      useSymbols: true,
    },
  })

  const generatePassword = (values: FormSchema): string => {
    const charSets = {
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
    };

    let availableChars = '';
    if (values.useLowercase) availableChars += charSets.lowercase;
    if (values.useUppercase) availableChars += charSets.uppercase;
    if (values.useNumbers) availableChars += charSets.numbers;
    if (values.useSymbols) availableChars += charSets.symbols;

    if (availableChars === '') {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Please select at least one character type.'
        });
        return '';
    }

    let password = '';
    for (let i = 0; i < values.length; i++) {
        const randomIndex = Math.floor(Math.random() * availableChars.length);
        password += availableChars[randomIndex];
    }
    return password;
  }

  async function onSubmit(values: FormSchema) {
    setIsLoading(true);
    setResult(null);

    // Simulate a short delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newPassword = generatePassword(values);
    if (!newPassword) {
        setIsLoading(false);
        return;
    }
    
    setResult({ password: newPassword });
    setIsLoading(false);
  }


  const handleCopy = () => {
    if (result?.password) {
      navigator.clipboard.writeText(result.password)
      setCopied(true)
      toast({ title: 'Copied!', description: 'Password copied to clipboard.'})
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <PageHeader
        title="Advanced Password Generator"
        description="Craft a strong, unique password for you."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <GlassCard>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Password Length</FormLabel>
                      <span className="text-primary font-bold">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={8}
                        max={128}
                        step={1}
                        defaultValue={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="useUppercase"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">Uppercase (A-Z)</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="useLowercase"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">Lowercase (a-z)</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="useNumbers"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">Numbers (0-9)</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="useSymbols"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormLabel className="font-normal">Symbols (!@#$%)</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Password
              </Button>
            </form>
          </Form>
        </GlassCard>

        <GlassCard>
            <h3 className="text-lg font-medium text-white mb-4">Generated Password</h3>
            {isLoading && (
                 <div className="flex justify-center items-center h-48">
                    <Bot className="h-12 w-12 text-primary animate-pulse" />
                 </div>
            )}
            {result && (
                <div className="space-y-4">
                    <div className="relative">
                        <p className="text-lg font-mono p-4 pr-12 bg-black/20 rounded-md break-all text-white">
                            {result.password}
                        </p>
                        <Button variant="ghost" size="icon" className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8" onClick={handleCopy}>
                            {copied ? <Check className="h-5 w-5 text-green-400" /> : <Clipboard className="h-5 w-5" />}
                            <span className="sr-only">Copy password</span>
                        </Button>
                    </div>
                </div>
            )}
            {!isLoading && !result && (
                <div className="text-center text-muted-foreground h-48 flex flex-col justify-center items-center">
                    <p>Your new password will appear here.</p>
                </div>
            )}
        </GlassCard>
      </div>
    </>
  )
}
