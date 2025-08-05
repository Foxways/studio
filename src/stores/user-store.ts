
import { create } from 'zustand';
import { users as initialUsers } from '@/lib/data';

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Admin' | 'User';
  active: boolean;
  securityQuestion?: string;
  securityAnswer?: string;
};

type NewUser = Omit<User, 'id' | 'role' | 'active'> & {
    name: string;
};

type UserState = {
  users: User[];
  addUser: (user: NewUser) => void;
  toggleUserStatus: (id: string) => void;
  findUser: (id: string) => User | undefined;
  deleteUser: (id: string) => void;
  resetPassword: (id: string, newPassword?: string) => void;
};

export const useUserStore = create<UserState>((set, get) => ({
  users: initialUsers,
  addUser: (user) => {
    const newUser: User = {
        ...user,
        id: Date.now().toString(),
        role: 'User',
        active: true,
    };
    set((state) => ({ users: [newUser, ...state.users] }))
  },
  toggleUserStatus: (id: string) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, active: !u.active } : u
      ),
    })),
  findUser: (id) => get().users.find((u) => u.id === id),
  deleteUser: (id) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== id),
    })),
  resetPassword: (id: string, newPassword = 'password123') =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === id ? { ...u, password: newPassword } : u
      ),
    })),
}));
