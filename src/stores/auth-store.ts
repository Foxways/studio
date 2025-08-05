import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type AuthState = {
  user: { email: string } | null;
  login: (email: string) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email: string) => set({ user: { email } }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
