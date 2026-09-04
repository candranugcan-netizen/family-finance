'use client';

import { useState } from 'react';
import { Lock, Unlock, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/use-auth-store';

export default function PinScreen() {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const unlock = useAuthStore((state) => state.unlock);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 6) return setError('PIN harus 6 digit');
    
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin, action: isSetupMode ? 'setup' : 'verify' }),
      });
      
      const data = await res.json();

      if (data.error === 'needs_setup') {
        setIsSetupMode(true);
        setError('Aplikasi baru! Silakan buat 6 digit PIN Anda.');
        setPin('');
      } else if (!res.ok) {
        setError(data.error);
        setPin('');
      } else {
        if (isSetupMode) {
          setIsSetupMode(false);
          setError('PIN berhasil dibuat! Silakan masukkan PIN untuk masuk.');
          setPin('');
        } else {
          unlock(); // Buka aplikasi!
        }
      }
    } catch (err) {
      setError('Koneksi terputus.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-xs bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center">
        <div className="mx-auto w-12 h-12 bg-slate-100 text-slate-700 rounded-full flex items-center justify-center mb-6">
          {isSetupMode ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
        </div>
        
        <h1 className="text-xl font-bold text-slate-800 mb-1">
          {isSetupMode ? 'Setup PIN' : 'Masukkan PIN'}
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          {isSetupMode ? 'Buat 6 digit PIN untuk keluarga' : 'Akses brankas keuangan keluarga'}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/[^0-9]/g, ''));
              setError('');
            }}
            className="w-full text-center text-3xl tracking-[0.5em] font-mono p-4 border-2 border-slate-200 rounded-xl focus:border-slate-800 focus:outline-none transition-colors"
            placeholder="••••••"
            autoFocus
            disabled={loading}
          />
          
          {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}

          <button
            type="submit"
            disabled={loading || pin.length < 6}
            className="w-full mt-6 bg-slate-900 text-white py-4 rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center transition-opacity"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSetupMode ? 'Simpan PIN' : 'Buka Kunci')}
          </button>
        </form>
      </div>
    </div>
  );
}