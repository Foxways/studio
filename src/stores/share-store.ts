import { create } from 'zustand';
import type { Credential } from './credential-store';
import type { Note } from './note-store';

export type ItemType = 'credential' | 'note';
type SharedItemData = Omit<Credential, 'id' | 'lastModified'> | Omit<Note, 'id' | 'lastModified'>;


export type SharedItem = {
  id: string;
  senderEmail: string;
  recipientEmail: string;
  itemData: any; 
  itemType: ItemType;
  status: 'pending' | 'accepted';
  createdAt: string; 
};

type ShareState = {
  sharedItems: SharedItem[];
  shareItem: (senderEmail: string, recipientEmail: string, itemData: any) => void;
  getInbox: (email: string) => SharedItem[];
  getOutbox: (email: string) => SharedItem[];
  deleteShare: (id: string) => void;
  acceptShare: (id: string) => SharedItem | undefined;
};

export const useShareStore = create<ShareState>((set, get) => ({
  sharedItems: [],
  shareItem: (senderEmail, recipientEmail, itemData) => {
    const { itemType, ...rest } = itemData;
    const newItem: SharedItem = {
      id: Date.now().toString(),
      senderEmail,
      recipientEmail,
      itemData: rest,
      itemType: itemData.hasOwnProperty('username') ? 'credential' : 'note',
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
