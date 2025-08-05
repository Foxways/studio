
'use client';

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
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { type Note } from '@/stores/note-store';
import { AddNoteDialog } from './add-note-dialog';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

type ViewNoteDialogProps = {
  children: React.ReactNode;
  note: Note;
};

export function ViewNoteDialog({ children, note }: ViewNoteDialogProps) {
    const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{note.title}</DialogTitle>
          <DialogDescription className="flex items-center gap-4 pt-2">
             <Badge variant="secondary" className="text-sm">{note.category}</Badge>
             <span className="text-xs text-muted-foreground">Last updated: {formatDistanceToNow(new Date(note.lastModified), { addSuffix: true })}</span>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh] my-4">
            <div className="prose prose-invert prose-sm whitespace-pre-wrap pr-6">
                {note.content}
            </div>
        </ScrollArea>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
          <AddNoteDialog note={note}>
            <Button type="submit">
                Edit Note
            </Button>
          </AddNoteDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
