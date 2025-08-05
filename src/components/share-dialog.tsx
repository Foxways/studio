'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useShareStore, type ItemType } from '@/stores/share-store';
import { useAuthStore } from '@/stores/auth-store';
import { useUserStore } from '@/stores/user-store';
import { useCredentialStore } from '@/stores/credential-store';
import { useNoteStore } from '@/stores/note-store';

type ShareDialogProps = {
  children: React.ReactNode;
  itemIds: string[];
  itemType: ItemType;
  disabled?: boolean;
};

export function ShareDialog({ children, itemIds, itemType, disabled = false }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const { toast } = useToast();
  const { user: currentUser } = useAuthStore();
  const { users } = useUserStore();
  const { shareItem } = useShareStore();
  const { findCredential } = useCredentialStore();
  const { findNote } = useNoteStore();

  const handleShare = () => {
    if (!email) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter an email address.' });
      return;
    }
    const recipient = users.find((u) => u.email === email);
    if (!recipient) {
      toast({ variant: 'destructive', title: 'Error', description: 'User not found.' });
      return;
    }
    if (recipient.email === currentUser?.email) {
      toast({ variant: 'destructive', title: 'Error', description: 'You cannot share items with yourself.' });
      return;
    }

    let sharedCount = 0;
    itemIds.forEach((id) => {
      const itemData = itemType === 'credential' ? findCredential(id) : findNote(id);
      if (itemData && currentUser) {
        shareItem(currentUser.email, recipient.email, itemData);
        sharedCount++;
      }
    });

    if (sharedCount > 0) {
      toast({
        title: 'Success',
        description: `${sharedCount} item(s) shared successfully with ${email}.`,
      });
    }

    setOpen(false);
    setEmail('');
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEmail('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={disabled}>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Item(s)</DialogTitle>
          <DialogDescription>
            Enter the email address of the user you want to share with. They must have an account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Recipient's Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleShare}>
            <Send className="mr-2 h-4 w-4" />
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
