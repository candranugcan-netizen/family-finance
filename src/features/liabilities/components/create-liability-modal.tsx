'use client';

import { useState } from 'react';
import { useCreateLiability } from '../hooks';
import { X } from 'lucide-react';

export default function CreateLiabilityModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [initialAmount, setInitialAmount] = useState('');
  const [remainingAmount, setRemainingAmount] = useState('');
  
  const createLiability = useCreateLiability();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !initialAmount || !remainingAmount) return;

    await createLiability.mutateAsync({
      name,
      category,
      initial_amount: Number(initialAmount),
      remaining_amount: Number(remainingAmount),
    });
    
    setName(''); setCategory(''); setInitialAmount(''); setRemainingAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Tambah Utang/Kewajiban</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Pinjaman</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Contoh: KPR Rumah, Cicilan Mobil" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Kategori</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" required>
              <option value="" disabled>Pilih Kategori</option>
              <option value="KPR">KPR (Rumah/Tanah)</option>
              <option value="Kendaraan">Kredit Kendaraan</option>
              <option value="Kartu Kredit">Kartu Kredit</option>
              <option value="Paylater">Paylater / Pinjol</option>
              <option value="Personal">Pinjaman Personal / Keluarga</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Total Pinjaman Awal (Rp)</label>
            <input type="number" value={initialAmount} onChange={(e) => setInitialAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="0" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Sisa Utang Saat Ini (Rp)</label>
            <input type="number" value={remainingAmount} onChange={(e) => setRemainingAmount(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="0" required />
          </div>
          <button type="submit" disabled={createLiability.isPending} className="w-full bg-slate-900 text-white rounded-2xl py-4 text-sm font-bold mt-2 hover:bg-slate-800">
            {createLiability.isPending ? 'Menyimpan...' : 'Simpan Utang'}
          </button>
        </form>
      </div>
    </div>
  );
}