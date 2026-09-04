'use client';

import { useState } from 'react';
import { useCreateAsset } from '../hooks';
import { X } from 'lucide-react';

export default function CreateAssetModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [units, setUnits] = useState('');
  const [avgBuyPrice, setAvgBuyPrice] = useState('');
  
  const createAsset = useCreateAsset();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !category || !units || !avgBuyPrice) return;

    // Saat baru beli, harga pasar (current_price) diasumsikan sama dengan harga beli
    await createAsset.mutateAsync({
      name,
      category,
      units: Number(units),
      avg_buy_price: Number(avgBuyPrice),
      current_price: Number(avgBuyPrice), 
    });
    
    setName(''); setCategory(''); setUnits(''); setAvgBuyPrice('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Tambah Aset Baru</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Aset</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Contoh: Emas Antam, BBCA" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Kategori</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" required>
                <option value="" disabled>Pilih</option>
                <option value="Emas">Emas</option>
                <option value="Saham">Saham</option>
                <option value="Reksadana">Reksadana</option>
                <option value="Kripto">Kripto</option>
                <option value="Properti">Properti</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Jumlah Unit</label>
              <input type="number" step="any" value={units} onChange={(e) => setUnits(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="10.5" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Harga Beli Rata-rata (Per Unit)</label>
            <input type="number" value={avgBuyPrice} onChange={(e) => setAvgBuyPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Contoh: 1200000" required />
          </div>
          <button type="submit" disabled={createAsset.isPending} className="w-full bg-slate-900 text-white rounded-2xl py-4 text-sm font-bold mt-2 hover:bg-slate-800">
            {createAsset.isPending ? 'Menyimpan...' : 'Simpan Aset'}
          </button>
        </form>
      </div>
    </div>
  );
}