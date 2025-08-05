'use client';

import { PlusCircle } from "lucide-react"
import { useNoteStore } from "@/stores/note-store";
import { PageHeader } from "@/components/page-header"
import { GlassCard } from "@/components/glass-card"
import { AddNoteDialog } from "@/components/add-note-dialog";
import { NoteCard } from "@/components/note-card";

export default function NotesPage() {
  const { notes } = useNoteStore();

  return (
    <>
      <PageHeader
        title="Secure Notes"
        description="Organize your thoughts and sensitive information securely."
      >
        <AddNoteDialog>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Note
            </button>
        </AddNoteDialog>
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </>
  )
}
