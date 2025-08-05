'use client';

import { useState, useMemo } from 'react';
import { PlusCircle, Search } from "lucide-react"
import { useNoteStore } from "@/stores/note-store";
import { PageHeader } from "@/components/page-header"
import { AddNoteDialog } from "@/components/add-note-dialog";
import { NoteCard } from "@/components/note-card";
import { Input } from '@/components/ui/input';

export default function NotesPage() {
  const { notes } = useNoteStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = useMemo(() => {
    if (!searchQuery) {
      return notes;
    }
    return notes.filter((note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [notes, searchQuery]);

  return (
    <>
      <PageHeader
        title="Secure Notes"
        description="Organize your thoughts and sensitive information securely."
      >
        <div className="flex items-center gap-2">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search notes..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <AddNoteDialog>
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Note
                </button>
            </AddNoteDialog>
        </div>
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredNotes.map((note) => (
            <NoteCard key={note.id} note={note} />
        ))}
      </div>
      {filteredNotes.length === 0 && (
        <div className="text-center text-muted-foreground py-16">
          <p>No notes found matching your search.</p>
        </div>
      )}
    </>
  )
}
