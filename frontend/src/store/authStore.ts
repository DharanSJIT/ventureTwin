import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  _id: string;
  name: string;
  email: string;
  token: string;
  profileImage?: string;
  resumeUrl?: string;
  resumeText?: string;
  skills: string[];
  projects: any[];
  certifications: any[];
  achievements: any[];
  activeTemplate?: string;
  username?: string;
}

interface AuthState {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
