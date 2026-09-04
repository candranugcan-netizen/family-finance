'use client';

import { useState } from 'react';
import { useCreateGoal } from '../hooks';
import { X } from 'lucide-react';

export default function CreateGoalModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  
  const createGoal = useCreateGoal();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;

    await createGoal.mutateAsync({
      name,
      target_amount: Number(targetAmount),
    });
    
    setName('');
    setTargetAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Target Baru</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Target</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Contoh: Dana Darurat"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Target Dana (Rp)</label>
            <input
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Contoh: 10000000"
              required
            />
          </div>
          <button
            type="submit"
            disabled={createGoal.isPending}
            className="w-full bg-slate-900 text-white rounded-2xl py-4 text-sm font-bold mt-4 hover:bg-slate-800"
          >
            {createGoal.isPending ? 'Menyimpan...' : 'Simpan Target'}
          </button>
        </form>
      </div>
    </div>
  );
}