import { create } from 'zustand';
import { licenses as initialLicenses } from '@/lib/data';

export type License = {
  id: string;
  name: string;
  productKey: string;
  purchaseDate: string; // Stored as ISO string
  expiryDate: string; // Stored as ISO string
};

type LicenseState = {
  licenses: License[];
  addLicense: (license: Omit<License, 'id'>) => void;
  updateLicense: (id: string, updatedLicense: Omit<License, 'id'>) => void;
  deleteLicense: (id: string) => void;
  findLicense: (id: string) => License | undefined;
  replaceLicenses: (licenses: License[]) => void;
};

export const useLicenseStore = create<LicenseState>((set, get) => ({
  licenses: initialLicenses,
  addLicense: (license) =>
    set((state) => ({
      licenses: [
        { ...license, id: Date.now().toString() },
        ...state.licenses,
      ],
    })),
  updateLicense: (id, updatedLicense) =>
    set((state) => ({
      licenses: state.licenses.map((l) =>
        l.id === id
          ? {
              ...l,
              ...updatedLicense,
              id,
            }
          : l
      ),
    })),
  deleteLicense: (id) =>
    set((state) => ({
      licenses: state.licenses.filter((l) => l.id !== id),
    })),
  findLicense: (id) => get().licenses.find((l) => l.id === id),
  replaceLicenses: (licenses) => set({ licenses }),
}));
