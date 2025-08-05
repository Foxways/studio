
'use client';

import { useState, useMemo } from 'react';
import { PlusCircle, Search } from "lucide-react"
import { useNoteStore } from "@/stores/note-store";
import { PageHeader } from "@/components/page-header"
import { AddNoteDialog } from "@/components/add-note-dialog";
import { NoteCard } from "@/components/note-card";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NotesPage() {
  const { notes } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchQuery) {
      return notes;
    }
    return notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  return (
    <>
      <PageHeader
        title="Secure Notes"
        description="Organize your thoughts and sensitive information securely."
      >
        <div className="flex w-full md:w-auto flex-col md:flex-row items-stretch md:items-center gap-2">
            <div className="relative flex-1 md:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search notes..."
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <AddNoteDialog>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Note
                </Button>
            </AddNoteDialog>
        </div>
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
        ))}
      </div>
      {filteredNotes.length === 0 && (
        <div className="text-center text-muted-foreground py-16 col-span-full">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-white">No Notes Found</h3>
          <p>You haven't created any notes yet, or your search returned no results.</p>
        </div>
      )}
    </>
  )
}
