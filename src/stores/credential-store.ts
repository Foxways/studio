import { create } from 'zustand';
import { credentials as initialCredentials } from '@/lib/data';

export type Credential = {
  id: string;
  title: string;
  username: string;
  password: string;
  url?: string;
  tags: string[];
  notes?: string;
  customFields?: { id: number; label: string; value: string }[];
  lastModified: string;
};

type CredentialState = {
  credentials: Credential[];
  addCredential: (credential: Credential) => void;
  updateCredential: (id: string, updatedCredential: Omit<Credential, 'id'>) => void;
  deleteCredential: (id: string) => void;
  deleteCredentials: (ids: string[]) => void;
  findCredential: (id: string) => Credential | undefined;
};

export const useCredentialStore = create<CredentialState>((set, get) => ({
  credentials: initialCredentials.map(c => ({...c, url: `https://www.${c.title.split(' ')[0].toLowerCase()}.com`})),
  addCredential: (credential) =>
    set((state) => ({
      credentials: [...state.credentials, credential],
    })),
  updateCredential: (id, updatedCredential) =>
    set((state) => ({
      credentials: state.credentials.map((c) =>
        c.id === id ? { ...c, ...updatedCredential, id } : c
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
}));
