'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/use-auth-store';
import PinScreen from './pin-screen';

const AUTO_LOCK_TIMEOUT = 5 * 60 * 1000; // 5 menit

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLocked, lastActive, lock, updateActivity } = useAuthStore();

  useEffect(() => {
    // Jika sedang terkunci, tidak perlu listen aktivitas
    if (isLocked) return;

    const checkLock = setInterval(() => {
      if (Date.now() - useAuthStore.getState().lastActive > AUTO_LOCK_TIMEOUT) {
        lock();
      }
    }, 10000); // Cek setiap 10 detik

    // Reset timer setiap kali user sentuh layar/scroll
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => updateActivity();

    events.forEach(event => window.addEventListener(event, handleActivity));

    return () => {
      clearInterval(checkLock);
      events.forEach(event => window.removeEventListener(event, handleActivity));
    };
  }, [isLocked, lock, updateActivity]);

  if (isLocked) return <PinScreen />;

  return <>{children}</>;
}