'use client';

import { MoreHorizontal, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/glass-card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNoteStore, type Note } from '@/stores/note-store';
import { AddNoteDialog } from './add-note-dialog';
import { ViewNoteDialog } from './view-note-dialog';
import { formatDistanceToNow } from 'date-fns';

export function NoteCard({ note }: { note: Note }) {
  const { deleteNote } = useNoteStore();
  const { toast } = useToast();

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNote(note.id);
    toast({ title: 'Success', description: 'Note deleted.' });
  };
  
  const excerpt = note.content.length > 100 ? `${note.content.substring(0, 100)}...` : note.content;

  return (
    <ViewNoteDialog note={note}>
        <GlassCard className="flex flex-col cursor-pointer h-full">
        <div className="flex items-start justify-between">
            <Badge variant="secondary" className="mb-2">
            {note.category}
            </Badge>
            <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                aria-haspopup="true"
                size="icon"
                variant="ghost"
                className="-mt-2 -mr-2"
                >
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <AddNoteDialog note={note}>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Edit
                </DropdownMenuItem>
                </AddNoteDialog>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-red-500" onSelect={(e) => e.preventDefault()}>Delete</DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this note.
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
            </DropdownMenuContent>
            </DropdownMenu>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{note.title}</h3>
        <p className="text-sm text-muted-foreground flex-grow">{excerpt}</p>
        <p className="text-xs text-muted-foreground mt-4 pt-4 border-t">
            {formatDistanceToNow(new Date(note.lastModified), { addSuffix: true })}
        </p>
        </GlassCard>
    </ViewNoteDialog>
  );
}
