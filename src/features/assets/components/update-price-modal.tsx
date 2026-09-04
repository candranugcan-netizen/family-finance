'use client';

import { useState, useEffect } from 'react';
import { useUpdateAssetPrice } from '../hooks';
import { Asset } from '../types';
import { X, RefreshCw } from 'lucide-react';

interface UpdatePriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
}

export default function UpdatePriceModal({ isOpen, onClose, asset }: UpdatePriceModalProps) {
  const [newPrice, setNewPrice] = useState('');
  const updatePrice = useUpdateAssetPrice();

  // Set default form dengan harga terakhir saat modal dibuka
  useEffect(() => {
    if (asset) setNewPrice(asset.current_price.toString());
  }, [asset]);

  if (!isOpen || !asset) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrice) return;

    await updatePrice.mutateAsync({
      id: asset.id,
      newPrice: Number(newPrice),
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Update Harga Pasar</h2>
            <p className="text-xs text-slate-500">{asset.name}</p>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Harga Saat Ini (Per Unit)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="text-slate-400 text-sm font-medium">Rp</span>
              </div>
              <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900" required />
            </div>
          </div>
          
          <div className="bg-sky-50 rounded-2xl p-4 flex items-start space-x-3 border border-sky-100">
            <RefreshCw className="w-5 h-5 text-sky-600 shrink-0" />
            <p className="text-[11px] text-sky-700 leading-relaxed">
              Memperbarui harga ini akan secara otomatis menghitung ulang Unrealized Return pada portofolio Anda.
            </p>
          </div>

          <button type="submit" disabled={updatePrice.isPending} className="w-full bg-slate-900 text-white rounded-2xl py-4 text-sm font-bold mt-2 hover:bg-slate-800">
            {updatePrice.isPending ? 'Mengupdate...' : 'Simpan Valuasi'}
          </button>
        </form>
      </div>
    </div>
  );
}