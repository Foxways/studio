
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Mail, Lock, HelpCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthLayout } from '@/components/auth-layout';
import { GlassCard } from '@/components/glass-card';
import { useToast } from '@/hooks/use-toast';
import { useUserStore, type User } from '@/stores/user-store';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { users, resetPassword: updateUserPassword } = useUserStore();
  
  const [email, setEmail] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1 for email, 2 for security question, 3 for new password

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find((u) => u.email === email);
    if (user) {
      setCurrentUser(user);
      setStep(2);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No user found with this email address.',
      });
    }
  };

  const handleSecuritySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.securityAnswer?.toLowerCase() === securityAnswer.toLowerCase()) {
      setStep(3);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Incorrect answer. Please try again.',
      });
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
        toast({ variant: 'destructive', title: 'Error', description: 'Password must be at least 8 characters long.' });
        return;
    }
    if (newPassword !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: "Passwords don't match.",
      });
      return;
    }
    
    if (currentUser) {
        updateUserPassword(currentUser.id, newPassword);
        toast({
            title: 'Success',
            description: 'Your password has been reset successfully.',
        });
        router.push('/');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
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
        );
      case 2:
        return (
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
                <p className="text-sm text-white">{currentUser?.securityQuestion}</p>
              </div>
              <Input
                id="security-answer"
                type="text"
                placeholder="Your Answer"
                required
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full font-semibold">
              Verify Answer
            </Button>
            <div className="mt-6 text-center text-sm">
              <button onClick={() => setStep(1)} type="button" className="font-medium text-primary hover:underline">
                Use a different email
              </button>
            </div>
          </form>
        );
        case 3:
        return (
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white">Reset Your Password</h2>
              <p className="text-muted-foreground">
                Enter and confirm your new password.
              </p>
            </div>
            <div className="space-y-4">
               <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    id="new-password"
                    type="password"
                    placeholder="New Password"
                    required
                    className="pl-10"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                </div>
                <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm New Password"
                    required
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                </div>
            </div>
            <Button type="submit" className="w-full font-semibold">
              Set New Password
            </Button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <AuthLayout>
      <GlassCard className="w-full max-w-md">
        {renderStep()}
      </GlassCard>
    </AuthLayout>
  );
}
