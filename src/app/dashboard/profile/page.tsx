
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '@/stores/auth-store'
import { useToast } from '@/hooks/use-toast'
import { PageHeader } from '@/components/page-header'
import { GlassCard } from '@/components/glass-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required.'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

export default function ProfilePage() {
  const { user, changePassword } = useAuthStore()
  const [name, setName] = useState('User');
  const { toast } = useToast()

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  function handlePasswordChange(values: z.infer<typeof passwordFormSchema>) {
    const success = changePassword(
      user!.email,
      values.currentPassword,
      values.newPassword
    )

    if (success) {
      toast({
        title: 'Success',
        description: 'Your password has been changed successfully.',
      })
      passwordForm.reset()
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Incorrect current password. Please try again.',
      })
    }
  }
  
  const handleProfileUpdate = () => {
    // In a real app, you would have an API call here.
    toast({
        title: 'Success',
        description: 'Your profile has been updated.',
    })
  }

  return (
    <>
      <PageHeader
        title="Profile"
        description="Manage your personal details and account settings."
      />
      <div className="grid gap-8 max-w-2xl">
        <GlassCard>
          <h3 className="text-lg font-medium text-white mb-6">Personal Details</h3>
          <div className="space-y-4">
             <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email || ''} readOnly disabled />
            </div>
            <Button onClick={handleProfileUpdate}>Save Changes</Button>
          </div>
        </GlassCard>

        <GlassCard>
            <h3 className="text-lg font-medium text-white mb-6">Change Password</h3>
            <Form {...passwordForm}>
                <form
                onSubmit={passwordForm.handleSubmit(handlePasswordChange)}
                className="space-y-4"
                >
                <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                        <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                        <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                        <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit">Change Password</Button>
                </form>
            </Form>
        </GlassCard>
      </div>
    </>
  )
}
