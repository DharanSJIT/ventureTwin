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
  careerPath?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
  updateCareerPath: (path: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
      updateCareerPath: async (path: string) => {
        const state = get();
        if (!state.user || !state.token) return;
        
        // Optimistic UI update
        const previousPath = state.user.careerPath;
        set((state) => ({
          user: state.user ? { ...state.user, careerPath: path } : null
        }));

        try {
          const res = await fetch('http://localhost:3000/api/users/career-path', {
            method: 'PUT',
            headers: { 
              'Content-Type': 'application/json',
              Authorization: `Bearer ${state.token}`
            },
            body: JSON.stringify({ careerPath: path })
          });
          
          if (!res.ok) {
             console.error("Failed response from backend:", await res.text());
             // Revert optimistic update
             set((state) => ({
               user: state.user ? { ...state.user, careerPath: previousPath } : null
             }));
          }
        } catch (e) {
          console.error("Failed to update career path", e);
          // Revert optimistic update
          set((state) => ({
            user: state.user ? { ...state.user, careerPath: previousPath } : null
          }));
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
