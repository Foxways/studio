'use client';

import { Check, Mail, X } from "lucide-react"
import React from "react";
import { formatDistanceToNow } from 'date-fns';

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
import { GlassCard } from "@/components/glass-card"
import { useToast } from "@/hooks/use-toast";
import { useShareStore } from "@/stores/share-store";
import { useAuthStore } from "@/stores/auth-store";
import { useCredentialStore } from "@/stores/credential-store";
import { useNoteStore } from "@/stores/note-store";
import { Badge } from "@/components/ui/badge";

export default function InboxPage() {
  const { user } = useAuthStore();
  const { getInbox, deleteShare, acceptShare } = useShareStore();
  const { addCredential } = useCredentialStore();
  const { addNote } = useNoteStore();
  const { toast } = useToast();

  const inboxItems = user ? getInbox(user.email) : [];

  const handleAccept = (shareId: string) => {
    const item = acceptShare(shareId);
    if (item) {
        if (item.itemType === 'credential') {
            addCredential(item.itemData);
        } else {
            addNote(item.itemData);
        }
        toast({ title: 'Success', description: `Item has been added to your vault.` });
    }
  };
  
  const handleDelete = (shareId: string) => {
    deleteShare(shareId);
    toast({ title: 'Success', description: 'Item removed from inbox.' });
  }

  return (
    <>
      <PageHeader
        title="Inbox"
        description="View items shared with you by other users."
      />
      
      <GlassCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>From</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden lg:table-cell">Received</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inboxItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.senderEmail}</TableCell>
                <TableCell>{item.itemData.title}</TableCell>
                <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="capitalize">{item.itemType}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground hidden lg:table-cell">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</TableCell>
                <TableCell className="text-right">
                   <AlertDialog>
                      <Button variant="ghost" size="icon" onClick={() => handleAccept(item.id)}>
                        <Check className="h-4 w-4 text-green-400"/>
                        <span className="sr-only">Accept</span>
                      </Button>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon">
                            <X className="h-4 w-4 text-red-400"/>
                             <span className="sr-only">Decline</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Declining this item will permanently remove it from your inbox.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                   </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
             {inboxItems.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        <Mail className="mx-auto h-8 w-8 mb-2" />
                        Your inbox is empty.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </GlassCard>
    </>
  )
}
