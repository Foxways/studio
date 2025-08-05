
'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Trash2, Calendar, KeyRound } from 'lucide-react';
import { useLicenseStore } from '@/stores/license-store';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/glass-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { AddLicenseDialog } from '@/components/add-license-dialog';
import { format } from 'date-fns';

export default function LicenseDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { findLicense, deleteLicense } = useLicenseStore();
  const license = findLicense(params.id);
  const { toast } = useToast();

  if (!license) {
    return notFound();
  }

  const handleDelete = () => {
    deleteLicense(license.id);
    toast({
      title: 'Success',
      description: 'License deleted successfully.',
    });
    router.push('/dashboard/licenses');
  };
  
  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: 'Success', description: 'Product key copied to clipboard.' });
  }

  return (
    <>
      <PageHeader
        title={license.name}
        description="View and manage license details."
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => router.back()} className="w-full sm:w-auto justify-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <AddLicenseDialog license={license}>
             <Button className="w-full sm:w-auto justify-center">
                <Edit className="mr-2 h-4 w-4" />
                Edit
            </Button>
          </AddLicenseDialog>
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
                  this license.
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
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" value={license.name} readOnly />
          </div>
           <div>
            <Label htmlFor="productKey">Product Key</Label>
            <div className="relative">
                <Input id="productKey" value={license.productKey} readOnly className="pr-24 font-mono" />
                <Button variant="secondary" size="sm" className="absolute top-1/2 right-1.5 -translate-y-1/2" onClick={() => handleCopy(license.productKey)}>
                    <KeyRound className="mr-2 h-4 w-4" />
                    Copy
                </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="purchaseDate" value={format(new Date(license.purchaseDate), 'PPP')} readOnly className="pl-10"/>
                </div>
            </div>
            <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                 <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="expiryDate" value={format(new Date(license.expiryDate), 'PPP')} readOnly className="pl-10"/>
                </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </>
  );
}
