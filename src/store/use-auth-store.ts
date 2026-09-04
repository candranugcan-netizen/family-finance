import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLocked: boolean;
  lastActive: number;
  lock: () => void;
  unlock: () => void;
  updateActivity: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLocked: true, // Default selalu terkunci saat web dibuka
      lastActive: Date.now(),
      lock: () => set({ isLocked: true }),
      unlock: () => set({ isLocked: false, lastActive: Date.now() }),
      updateActivity: () => set({ lastActive: Date.now() }),
    }),
    { name: 'family-lock' }
  )
);