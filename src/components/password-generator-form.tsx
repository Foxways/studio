
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, Clipboard, RefreshCw, Send } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Label } from './ui/label'

const formSchema = z.object({
  length: z.number().min(8).max(128),
  useUppercase: z.boolean().default(true),
  useLowercase: z.boolean().default(true),
  useNumbers: z.boolean().default(true),
  useSymbols: z.boolean().default(true),
})

type FormSchema = z.infer<typeof formSchema>;

interface PasswordGeneratorFormProps {
    onPasswordGenerated: (password: string) => void;
    showUsePasswordButton?: boolean;
}

export function PasswordGeneratorForm({ 
    onPasswordGenerated,
    showUsePasswordButton = true 
}: PasswordGeneratorFormProps) {
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null)
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

  // Generate password on initial load and when form values change
  useEffect(() => {
    const subscription = form.watch((values) => {
        onGenerate(values as FormSchema, false); // Don't call the callback on every change
    });
    // Generate initial password
    onGenerate(form.getValues(), false);
    
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch]);


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
        form.setError('useLowercase', { type: 'manual', message: 'Select at least one character type.' });
        return '';
    } else {
        form.clearErrors('useLowercase');
    }

    let password = '';
    const crypto = window.crypto || (window as any).msCrypto;
    const array = new Uint32Array(values.length);
    crypto.getRandomValues(array);

    for (let i = 0; i < values.length; i++) {
        password += availableChars[array[i] % availableChars.length];
    }
    return password;
  }

  function onGenerate(values: FormSchema, triggerCallback = false) {
    const newPassword = generatePassword(values);
    if (newPassword) {
      setGeneratedPassword(newPassword);
      if (triggerCallback) {
          onPasswordGenerated(newPassword);
      }
    } else {
      setGeneratedPassword(null);
    }
  }


  const handleCopy = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword)
      setCopied(true)
      toast({ title: 'Copied!', description: 'Password copied to clipboard.'})
      setTimeout(() => setCopied(false), 2000)
    }
  }
  
  const handleUsePassword = () => {
    if (generatedPassword) {
        onPasswordGenerated(generatedPassword);
    } else {
        toast({ title: 'No Password', description: 'Please generate a password first.'});
    }
  }

  return (
    <div className="space-y-6">
        <Form {...form}>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
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
                        <FormLabel className="font-normal text-xs">Uppercase (A-Z)</FormLabel>
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
                        <FormLabel className="font-normal text-xs">Lowercase (a-z)</FormLabel>
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
                        <FormLabel className="font-normal text-xs">Numbers (0-9)</FormLabel>
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
                        <FormLabel className="font-normal text-xs">Symbols (!@#$%)</FormLabel>
                        </FormItem>
                    )}
                    />
                </div>
                 {form.formState.errors.useLowercase && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.useLowercase.message}</p>
                )}
            </form>
        </Form>

         <div>
            <Label>Generated Password</Label>
            <div className="relative mt-2">
                <p className="text-sm font-mono p-3 pr-10 bg-black/20 rounded-md break-all text-white h-11 flex items-center">
                    {generatedPassword || <span className="text-muted-foreground">Adjust settings...</span>}
                </p>
                {generatedPassword && (
                    <Button variant="ghost" size="icon" className="absolute top-1/2 right-1 -translate-y-1/2 h-8 w-8" onClick={handleCopy}>
                        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Clipboard className="h-4 w-4" />}
                        <span className="sr-only">Copy password</span>
                    </Button>
                )}
            </div>
        </div>

        <div className="flex gap-2">
            <Button onClick={() => onGenerate(form.getValues())} className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Regenerate
            </Button>
            {showUsePasswordButton && (
             <Button onClick={handleUsePassword} variant="secondary" className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                Use Password
            </Button>
            )}
        </div>
    </div>
  )
}
