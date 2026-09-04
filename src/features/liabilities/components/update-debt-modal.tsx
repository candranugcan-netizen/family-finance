'use client';

import { useState, useEffect } from 'react';
import { useUpdateRemainingDebt } from '../hooks';
import { Liability } from '../types';
import { X, Info } from 'lucide-react';

interface UpdateDebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  liability: Liability | null;
}

export default function UpdateDebtModal({ isOpen, onClose, liability }: UpdateDebtModalProps) {
  const [newRemaining, setNewRemaining] = useState('');
  const updateDebt = useUpdateRemainingDebt();

  useEffect(() => {
    if (liability) setNewRemaining(liability.remaining_amount.toString());
  }, [liability]);

  if (!isOpen || !liability) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemaining) return;

    await updateDebt.mutateAsync({
      id: liability.id,
      newRemaining: Number(newRemaining),
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Update Sisa Utang</h2>
            <p className="text-xs text-slate-500">{liability.name}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Sisa Utang Terbaru (Rp)</label>
            <input type="number" value={newRemaining} onChange={(e) => setNewRemaining(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-slate-900" required />
          </div>
          
          <div className="bg-amber-50 rounded-2xl p-4 flex items-start space-x-3 border border-amber-100">
            <Info className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-[11px] text-amber-700 leading-relaxed">
              Catat sisa pokok utang Anda setelah melakukan pembayaran cicilan. Ini akan otomatis memperbarui nilai Net Worth Anda.
            </p>
          </div>

          <button type="submit" disabled={updateDebt.isPending} className="w-full bg-slate-900 text-white rounded-2xl py-4 text-sm font-bold mt-2 hover:bg-slate-800">
            {updateDebt.isPending ? 'Menyimpan...' : 'Update Sisa Utang'}
          </button>
        </form>
      </div>
    </div>
  );
}