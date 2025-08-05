'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { credentials } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/glass-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { notFound } from 'next/navigation';

export default function CredentialDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const credential = credentials.find((c) => c.id === params.id);
  const [showPassword, setShowPassword] = useState(false);

  if (!credential) {
    return notFound();
  }

  return (
    <>
      <PageHeader
        title={credential.title}
        description="View and manage credential details."
      >
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </PageHeader>
      <GlassCard className="max-w-2xl mx-auto">
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={credential.title} readOnly />
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
            <div className="flex gap-2 mt-2">
              {credential.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Last Modified: {credential.lastModified}
            </p>
          </div>
        </div>
      </GlassCard>
    </>
  );
}
