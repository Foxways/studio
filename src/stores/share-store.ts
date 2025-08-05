
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Credential } from './credential-store';
import { useCredentialStore } from './credential-store';
import type { Note } from './note-store';
import { useNoteStore } from './note-store';

export type ItemType = 'credential' | 'note';

export type SharedItem = {
  id: string;
  senderEmail: string;
  recipientEmail: string;
  itemId: string;
  itemType: ItemType;
  status: 'pending' | 'accepted';
  createdAt: string; 
};

// This is a helper type for displaying in the UI
export type SharedItemWithData = SharedItem & {
    itemData: Credential | Note | null;
}

type ShareState = {
  sharedItems: SharedItem[];
  shareItems: (senderEmail: string, recipientEmails: string[], itemIds: string[], itemType: ItemType) => void;
  getInbox: (email: string) => SharedItemWithData[];
  getOutbox: (email: string) => SharedItemWithData[];
  deleteShare: (id: string) => void;
  acceptShare: (id: string) => SharedItem | undefined;
};

export const useShareStore = create<ShareState>()(
  persist(
    (set, get) => ({
      sharedItems: [],
      shareItems: (senderEmail, recipientEmails, itemIds, itemType) => {
        const newItems: SharedItem[] = [];
        recipientEmails.forEach(recipientEmail => {
            itemIds.forEach(itemId => {
                const newItem: SharedItem = {
                    id: `${Date.now()}-${itemId}-${recipientEmail}`,
                    senderEmail,
                    recipientEmail,
                    itemId,
                    itemType: itemType,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                };
                newItems.push(newItem);
            });
        });
        
        set((state) => ({ sharedItems: [...state.sharedItems, ...newItems] }));
      },
      getInbox: (email) => {
        const { sharedItems } = get();
        const items = sharedItems.filter((item) => item.recipientEmail === email && item.status === 'pending');
        
        const credentials = useCredentialStore.getState().credentials;
        const notes = useNoteStore.getState().notes;

        return items.map(item => {
            const itemData = item.itemType === 'credential' 
                ? credentials.find(c => c.id === item.itemId)
                : notes.find(n => n.id === item.itemId);
            return { ...item, itemData: itemData || null };
        }).filter(item => item.itemData !== null) as SharedItemWithData[];
      },
      getOutbox: (email) => {
        const { sharedItems } = get();
        const items = sharedItems.filter((item) => item.senderEmail === email);

        const credentials = useCredentialStore.getState().credentials;
        const notes = useNoteStore.getState().notes;

        return items.map(item => {
            const itemData = item.itemType === 'credential' 
                ? credentials.find(c => c.id === item.itemId)
                : notes.find(n => n.id === item.itemId);
            return { ...item, itemData: itemData || null };
        }).filter(item => item.itemData !== null) as SharedItemWithData[];
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
    }),
    {
        name: 'share-storage',
        storage: createJSONStorage(() => sessionStorage),
    }
  )
);
