'use client';

import { useState } from 'react';
import { useTopUpGoal } from '../hooks';
import { Goal } from '../types';
import { formatRupiah } from '@/lib/utils';
import { X, ArrowUpCircle } from 'lucide-react';

interface TopUpGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
}

export default function TopUpGoalModal({ isOpen, onClose, goal }: TopUpGoalModalProps) {
  const [amount, setAmount] = useState('');
  const topUpGoal = useTopUpGoal();

  if (!isOpen || !goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    await topUpGoal.mutateAsync({
      id: goal.id,
      amount: Number(amount),
    });
    
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Top Up Dana</h2>
            <p className="text-xs text-slate-500">{goal.name}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Nominal Top Up (Rp)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-slate-400 text-sm font-medium">Rp</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                placeholder="0"
                required
              />
            </div>
          </div>
          
          <div className="bg-emerald-50 rounded-2xl p-4 flex items-start space-x-3 border border-emerald-100">
            <ArrowUpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-700 leading-relaxed">
              Dana ini akan ditambahkan ke total tabungan <span className="font-bold">{goal.name}</span> Anda.
            </p>
          </div>

          <button
            type="submit"
            disabled={topUpGoal.isPending}
            className="w-full bg-slate-900 text-white rounded-2xl py-4 text-sm font-bold mt-2 hover:bg-slate-800"
          >
            {topUpGoal.isPending ? 'Memproses...' : 'Tambah Dana'}
          </button>
        </form>
      </div>
    </div>
  );
}