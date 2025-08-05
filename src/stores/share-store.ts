
import { create } from 'zustand';
import type { Credential } from './credential-store';
import type { Note } from './note-store';

export type ItemType = 'credential' | 'note';

export type SharedItem = {
  id: string;
  senderEmail: string;
  recipientEmail: string;
  itemData: Credential | Note; 
  itemType: ItemType;
  status: 'pending' | 'accepted';
  createdAt: string; 
};

type ShareState = {
  sharedItems: SharedItem[];
  shareItem: (senderEmail: string, recipientEmail: string, itemData: Credential | Note) => void;
  getInbox: (email: string) => SharedItem[];
  getOutbox: (email: string) => SharedItem[];
  deleteShare: (id: string) => void;
  acceptShare: (id: string) => SharedItem | undefined;
};

export const useShareStore = create<ShareState>((set, get) => ({
  sharedItems: [],
  shareItem: (senderEmail, recipientEmail, itemData) => {
    // Correctly determine itemType by checking for a unique property
    const itemType = 'username' in itemData ? 'credential' : 'note';

    const newItem: SharedItem = {
      id: Date.now().toString(),
      senderEmail,
      recipientEmail,
      itemData,
      itemType: itemType,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ sharedItems: [newItem, ...state.sharedItems] }));
  },
  getInbox: (email) => {
    return get().sharedItems.filter((item) => item.recipientEmail === email && item.status === 'pending');
  },
  getOutbox: (email) => {
    return get().sharedItems.filter((item) => item.senderEmail === email);
  },
  deleteShare: (id) => {
    set((state) => ({
      sharedItems: state.sharedItems.filter((item) => item.id !== id),
    }));
  },
  acceptShare: (id) => {
     let acceptedItem: SharedItem | undefined;
    set((state) => ({
      sharedItems: state.sharedItems.map((item) => {
        if (item.id === id) {
          acceptedItem = { ...item, status: 'accepted' };
          return acceptedItem;
        }
        return item;
      }),
    }));
    return acceptedItem;
  },
}));
