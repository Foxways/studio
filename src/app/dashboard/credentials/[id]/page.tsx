'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useCredentialStore } from '@/stores/credential-store';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/glass-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { AddCredentialDialog } from '@/components/add-credential-dialog';
import { formatDistanceToNow } from 'date-fns';

export default function CredentialDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { findCredential, deleteCredential } = useCredentialStore();
  const credential = findCredential(params.id);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  if (!credential) {
    return notFound();
  }

  const handleDelete = () => {
    deleteCredential(credential.id);
    toast({
      title: 'Success',
      description: 'Credential deleted successfully.',
    });
    router.push('/dashboard');
  };

  return (
    <>
      <PageHeader
        title={credential.title}
        description="View and manage credential details."
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto justify-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <AddCredentialDialog credential={credential}>
             <Button className="w-full sm:w-auto justify-center">
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </Button>
          </AddCredentialDialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto justify-center">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this credential.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </PageHeader>
      <GlassCard className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={credential.title} readOnly />
          </div>
           <div>
            <Label htmlFor="url">URL</Label>
            <Input id="url" value={credential.url} readOnly />
          </div>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={credential.username} readOnly />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={credential.password}
                readOnly
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? 'Hide password' : 'Show password'}
                </span>
              </Button>
            </div>
          </div>
          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {credential.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
           {credential.notes && (
            <div>
                <Label>Notes</Label>
                <p className="text-sm text-muted-foreground mt-2 p-4 bg-black/20 rounded-md whitespace-pre-wrap">{credential.notes}</p>
            </div>
            )}

            {credential.customFields && credential.customFields.length > 0 && (
                 <div>
                    <Label>Custom Fields</Label>
                    <div className="space-y-2 mt-2">
                    {credential.customFields.map((field) => (
                        <div key={field.id} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <p className="font-medium text-white/80 w-full sm:w-1/3">{field.label}:</p>
                             <p className="text-muted-foreground w-full sm:w-2/3">{field.value}</p>
                        </div>
                    ))}
                    </div>
                </div>
            )}
          <div>
            <p className="text-sm text-muted-foreground">
              Last Modified: {formatDistanceToNow(new Date(credential.lastModified), { addSuffix: true })}
            </p>
          </div>
        </div>
      </GlassCard>
    </>
  );
}
