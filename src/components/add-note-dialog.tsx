
'use client';

import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNoteStore, type Note } from '@/stores/note-store';

const CATEGORY_OPTIONS = ['Personal', 'Work', 'Development', 'Ideas'];

type AddNoteDialogProps = {
  children: React.ReactNode;
  note?: Note;
};

export function AddNoteDialog({ children, note }: AddNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();
  const { addNote, updateNote } = useNoteStore();

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setCategory(note.category);
      setContent(note.content);
    }
  }, [note]);

  const resetForm = () => {
    setTitle('');
    setCategory('');
    setContent('');
  };

  const handleSave = () => {
    if (!title || !category || !content) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all fields.',
      });
      return;
    }

    const newNote = {
      title,
      category,
      content,
    };

    if (note) {
      updateNote(note.id, newNote);
      toast({ title: 'Success', description: 'Note updated.' });
    } else {
      addNote(newNote);
      toast({ title: 'Success', description: 'Note saved.' });
    }

    resetForm();
    setOpen(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      if (!note) {
        resetForm();
      }
    }
    setOpen(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{note ? 'Edit Note' : 'Add New Note'}</DialogTitle>
          <DialogDescription>
            {note
              ? 'Update the details for this note.'
              : "Fill in the details for the new note. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Project Ideas"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Jot down your thoughts here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
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
          <Button type="submit" onClick={handleSave}>
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
