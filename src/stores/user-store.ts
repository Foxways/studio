import { create } from 'zustand';
import { users as initialUsers } from '@/lib/data';

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'User';
  active: boolean;
};

type UserState = {
  users: User[];
  toggleUserStatus: (id: string) => void;
  findUser: (id: string) => User | undefined;
};

export const useUserStore = create<UserState>((set, get) => ({
  users: initialUsers,
  toggleUserStatus: (id: string) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, active: !u.active } : u
      ),
    })),
  findUser: (id) => get().users.find((u) => u.id === id),
}));
