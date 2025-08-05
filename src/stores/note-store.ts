import { create } from 'zustand';
import { notes as initialNotes } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';

export type Note = {
  id: string;
  title: string;
  category: string;
  content: string;
  lastModified: string;
};

type NoteState = {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'lastModified'>) => void;
  updateNote: (id: string, updatedNote: Omit<Note, 'id' | 'lastModified'>) => void;
  deleteNote: (id: string) => void;
  findNote: (id: string) => Note | undefined;
};

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: initialNotes,
  addNote: (note) =>
    set((state) => ({
      notes: [
        { ...note, id: Date.now().toString(), lastModified: 'just now' },
        ...state.notes,
      ],
    })),
  updateNote: (id, updatedNote) =>
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id
          ? {
              ...n,
              ...updatedNote,
              id,
              lastModified: formatDistanceToNow(new Date(), {
                addSuffix: true,
              }),
            }
          : n
      ),
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
    })),
  findNote: (id) => get().notes.find((n) => n.id === id),
}));
