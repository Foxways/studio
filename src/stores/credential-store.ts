import { create } from 'zustand';
import { credentials as initialCredentials } from '@/lib/data';

export type Credential = {
  id: string;
  title: string;
  username: string;
  password: string;
  url: string;
  tags: string[];
  notes?: string;
  customFields?: { id: number; label: string; value: string }[];
  lastModified: string; // Stored as ISO string
};

type CredentialState = {
  credentials: Credential[];
  addCredential: (credential: Omit<Credential, 'id' | 'lastModified'>) => void;
  updateCredential: (id: string, updatedCredential: Omit<Credential, 'id' | 'lastModified'>) => void;
  deleteCredential: (id: string) => void;
  deleteCredentials: (ids: string[]) => void;
  findCredential: (id: string) => Credential | undefined;
  replaceCredentials: (credentials: Credential[]) => void;
};

export const useCredentialStore = create<CredentialState>((set, get) => ({
  credentials: initialCredentials,
  addCredential: (credential) =>
    set((state) => ({
      credentials: [{ 
        ...credential,
        id: Date.now().toString(),
        lastModified: new Date().toISOString()
      }, ...state.credentials],
    })),
  updateCredential: (id, updatedCredential) =>
    set((state) => ({
      credentials: state.credentials.map((c) =>
        c.id === id ? { ...c, ...updatedCredential, id, lastModified: new Date().toISOString() } : c
      ),
    })),
  deleteCredential: (id) =>
    set((state) => ({
      credentials: state.credentials.filter((c) => c.id !== id),
    })),
  deleteCredentials: (ids) =>
    set((state) => ({
      credentials: state.credentials.filter((c) => !ids.includes(c.id)),
    })),
  findCredential: (id) => get().credentials.find((c) => c.id === id),
  replaceCredentials: (credentials) => set({ credentials }),
}));
