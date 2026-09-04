'use client';

import { useState } from 'react';
import { useCategories } from '@/features/transactions/hooks';
import { useUpsertBudget } from '../hooks';
import { format } from 'date-fns';
import { X } from 'lucide-react';

export default function CreateBudgetModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  
  const { data: categories } = useCategories();
  const upsertBudget = useUpsertBudget();
  const expenseCategories = categories?.filter(c => c.type === 'expense') || [];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || !amount) return;

    await upsertBudget.mutateAsync({
      category_id: categoryId,
      amount: Number(amount),
      period: format(new Date(), 'yyyy-MM'), // Bulan ini
    });
    
    setCategoryId('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Atur Budget Bulanan</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Kategori Pengeluaran</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              required
            >
              <option value="" disabled>Pilih Kategori</option>
              {expenseCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Limit Budget (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="Contoh: 1500000"
              required
            />
          </div>
          <button
            type="submit"
            disabled={upsertBudget.isPending}
            className="w-full bg-slate-900 text-white rounded-2xl py-4 text-sm font-bold mt-4 hover:bg-slate-800"
          >
            {upsertBudget.isPending ? 'Menyimpan...' : 'Simpan Budget'}
          </button>
        </form>
      </div>
    </div>
  );
}