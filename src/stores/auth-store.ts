import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { users } from '@/lib/data';

type AuthState = {
  user: { email: string } | null;
  login: (email: string) => void;
  logout: () => void;
  changePassword: (email: string, oldPass: string, newPass: string) => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email: string) => set({ user: { email } }),
      logout: () => set({ user: null }),
      changePassword: (email, oldPass, newPass) => {
        const user = users.find(u => u.email === email);
        if (user && user.password === oldPass) {
            // In a real app, this would be an API call.
            // Here we are "mutating" the imported data, which only works for the session.
            user.password = newPass;
            return true;
        }
        return false;
      }
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);
