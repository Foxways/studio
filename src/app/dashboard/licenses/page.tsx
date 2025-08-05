'use client';

import { PlusCircle, MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { PageHeader } from "@/components/page-header"
import { useLicenseStore } from "@/stores/license-store";
import { GlassCard } from "@/components/glass-card"
import { AddLicenseDialog } from "@/components/add-license-dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

export default function LicensesPage() {
  const router = useRouter();
  const { licenses, deleteLicense } = useLicenseStore();
  const { toast } = useToast();

  const handleRowClick = (licenseId: string) => {
    router.push(`/dashboard/licenses/${licenseId}`);
  };
  
  const handleDelete = (licenseId: string) => {
    deleteLicense(licenseId);
    toast({ title: 'Success', description: 'License deleted.' });
  }

  const handleCopy = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(key);
    toast({ title: 'Success', description: 'Product key copied to clipboard.' });
  }

  return (
    <>
      <PageHeader
        title="License Keys"
        description="Securely store and manage your software licenses and product keys."
      >
        <AddLicenseDialog>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Add License
          </Button>
        </AddLicenseDialog>
      </PageHeader>
      
      <GlassCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead className="hidden md:table-cell">Product Key</TableHead>
              <TableHead className="hidden lg:table-cell">Purchase Date</TableHead>
              <TableHead className="hidden lg:table-cell">Expiry Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {licenses.map((license) => (
              <TableRow key={license.id} className="cursor-pointer" onClick={() => handleRowClick(license.id)}>
                <TableCell className="font-medium">{license.name}</TableCell>
                <TableCell className="font-mono text-muted-foreground hidden md:table-cell">{license.productKey}</TableCell>
                <TableCell className="text-muted-foreground hidden lg:table-cell">{format(new Date(license.purchaseDate), 'PPP')}</TableCell>
                <TableCell className="text-muted-foreground hidden lg:table-cell">{format(new Date(license.expiryDate), 'PPP')}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                   <AlertDialog>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <AddLicenseDialog license={license}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
                        </AddLicenseDialog>
                        <DropdownMenuItem onClick={(e) => handleCopy(e, license.productKey)}>Copy Key</DropdownMenuItem>
                          <AlertDialogTrigger asChild>
                             <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                          </AlertDialogTrigger>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this license key.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(license.id)}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                   </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>
    </>
  )
}
