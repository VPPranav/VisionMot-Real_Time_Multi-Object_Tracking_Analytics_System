import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserAccount {
  username: string;
  email: string;
  password?: string; // Stored for mock auth only
}

interface AuthState {
   user: string | null;
   registeredUsers: UserAccount[];
   signup: (account: UserAccount) => { success: boolean; error?: string };
   login: (email: string, password?: string) => { success: boolean; error?: string };
   logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      registeredUsers: [],
      
      signup: (account) => {
        const { registeredUsers } = get();
        if (registeredUsers.some(u => u.email === account.email)) {
          return { success: false, error: 'Email already registered.' };
        }
        set({ registeredUsers: [...registeredUsers, account], user: account.username });
        return { success: true };
      },
      
      login: (email, password) => {
        const { registeredUsers } = get();
        const existingUser = registeredUsers.find(u => u.email === email);
        
        if (!existingUser) {
          return { success: false, error: 'Create Account before Logging in.' };
        }
        if (existingUser.password !== password) {
          return { success: false, error: 'Incorrect password.' };
        }
        
        set({ user: existingUser.username });
        return { success: true };
      },

      logout: () => set({ user: null }),
    }),
    {
      name: 'visionmot-auth-storage',
    }
  )
);
