
'use client';

import { useState, KeyboardEvent } from 'react';
import { Send, X } from 'lucide-react';
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
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

type ShareDialogProps = {
  children: React.ReactNode;
  itemIds: string[];
  itemType: ItemType;
  disabled?: boolean;
};

export function ShareDialog({ children, itemIds, itemType, disabled = false }: ShareDialogProps) {
  const [open, setOpen] = useState(false);
  const [recipients, setRecipients] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState('');
  const { toast } = useToast();
  const { user: currentUser } = useAuthStore();
  const { users } = useUserStore();
  const { shareItem } = useShareStore();
  const { findCredential } = useCredentialStore();
  const { findNote } = useNoteStore();

  const handleEmailInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (['Enter', ' ', ','].includes(e.key) && currentEmail) {
      e.preventDefault();
      const newEmail = currentEmail.trim().toLowerCase();
      if (newEmail && !recipients.includes(newEmail)) {
        setRecipients([...recipients, newEmail]);
      }
      setCurrentEmail('');
    }
  };
  
  const handleRemoveRecipient = (emailToRemove: string) => {
    setRecipients(recipients.filter(email => email !== emailToRemove));
  }

  const handleShare = () => {
    if (recipients.length === 0) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please enter at least one recipient email address.' });
      return;
    }

    let totalSharedCount = 0;

    recipients.forEach(email => {
        const recipient = users.find((u) => u.email === email);
        if (!recipient) {
          toast({ variant: 'destructive', title: 'User not found', description: `User with email ${email} does not exist.` });
          return;
        }
        if (recipient.email === currentUser?.email) {
          toast({ variant: 'destructive', title: 'Cannot share with yourself', description: 'You cannot share items with your own account.' });
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
            totalSharedCount += sharedCount
            toast({
                title: 'Success',
                description: `${itemIds.length} item(s) shared successfully with ${email}.`,
            });
        }
    });


    if(totalSharedCount > 0) {
        setOpen(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setCurrentEmail('');
      setRecipients([]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild disabled={disabled}>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Item(s)</DialogTitle>
          <DialogDescription>
            Enter email addresses of users you want to share with. Press space or enter to add an email.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Recipient's Email(s)</Label>
            <div className={cn("flex flex-wrap items-center gap-2 rounded-md border border-input p-2", recipients.length > 0 && "py-2 px-2")}>
                {recipients.map(email => (
                    <Badge key={email} variant="secondary">
                        {email}
                        <button onClick={() => handleRemoveRecipient(email)} className="ml-1 rounded-full p-0.5 hover:bg-black/20">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
                <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                    onKeyDown={handleEmailInput}
                    className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                />
            </div>
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
