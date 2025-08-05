
'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/stores/auth-store';
import { useUserStore } from '@/stores/user-store';
import { useToast } from '@/hooks/use-toast';
import { AuthLayout } from '@/components/auth-layout';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z
  .object({
    newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

export default function ForceResetPasswordPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { resetPassword } = useUserStore();
  const { toast } = useToast();
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handlePasswordReset = (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You are not logged in.',
      });
      router.push('/');
      return;
    }
    const targetUser = useUserStore.getState().users.find(u => u.email === user.email);
    if(targetUser) {
        resetPassword(targetUser.id, values.newPassword);
        toast({
            title: 'Success',
            description: 'Your password has been changed. You can now access your dashboard.',
        });
        router.push('/dashboard');
    }
  };

  return (
    <AuthLayout>
      <GlassCard className="w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePasswordReset)} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Create New Password</h2>
              <p className="text-muted-foreground">
                Your password was reset by an administrator. Please create a new password to continue.
              </p>
            </div>
             <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                    <div className="relative">
                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                       <Input type={showNewPassword ? 'text' : 'password'} {...field} className="pl-10 pr-10" />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showNewPassword ? 'Hide password' : 'Show password'}</span>
                          </Button>
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                    <div className="relative">
                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                       <Input type={showConfirmPassword ? 'text' : 'password'} {...field} className="pl-10 pr-10" />
                       <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            <span className="sr-only">{showConfirmPassword ? 'Hide password' : 'Show password'}</span>
                          </Button>
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <Button type="submit" className="w-full font-semibold">
              Set New Password & Continue
            </Button>
          </form>
        </Form>
      </GlassCard>
    </AuthLayout>
  );
}
