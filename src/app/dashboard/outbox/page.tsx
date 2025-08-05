
'use client';

import { Send, Trash2 } from "lucide-react"
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
import { Badge } from "@/components/ui/badge";

export default function OutboxPage() {
  const { user } = useAuthStore();
  const { getOutbox, deleteShare } = useShareStore();
  const { toast } = useToast();

  const outboxItems = user ? getOutbox(user.email) : [];
  
  const handleRevoke = (shareId: string) => {
    deleteShare(shareId);
    toast({ title: 'Success', description: 'Share has been revoked.' });
  }

  return (
    <>
      <PageHeader
        title="Outbox"
        description="View items you have shared with other users."
      />
      
      <GlassCard>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>To</TableHead>
              <TableHead>Item</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="hidden lg:table-cell">Sent</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outboxItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.recipientEmail}</TableCell>
                <TableCell>{item.itemData?.title}</TableCell>
                 <TableCell className="hidden md:table-cell">
                    <Badge variant={item.status === 'accepted' ? 'default' : 'secondary'} className="capitalize">{item.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground hidden lg:table-cell">{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</TableCell>
                <TableCell className="text-right">
                   <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="ghost" size="icon" disabled={item.status === 'accepted'}>
                            <Trash2 className="h-4 w-4 text-red-400"/>
                             <span className="sr-only">Revoke</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure you want to revoke?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove the item from the recipient's inbox and they will no longer have access to it. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleRevoke(item.id)}>
                            Revoke Share
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                   </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
            {outboxItems.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        <Send className="mx-auto h-8 w-8 mb-2" />
                        You haven't shared any items yet.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </GlassCard>
    </>
  )
}
