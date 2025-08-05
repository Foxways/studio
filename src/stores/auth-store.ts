import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { users as allUsers } from '@/lib/data';

type User = {
  email: string;
  role: 'Admin' | 'User';
};

type AuthState = {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  changePassword: (email: string, oldPass: string, newPass: string) => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email: string) => {
        const userData = allUsers.find(u => u.email === email);
        if (userData) {
            set({ user: { email: userData.email, role: userData.role as 'Admin' | 'User' } });
        }
      },
      logout: () => set({ user: null }),
      changePassword: (email, oldPass, newPass) => {
        const user = allUsers.find(u => u.email === email);
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
