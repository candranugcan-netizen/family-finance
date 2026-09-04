'use client';

import { useState } from 'react';
import { useAssets } from '@/features/assets/hooks';
import { useLiabilities } from '@/features/liabilities/hooks';
import { Liability } from '@/features/liabilities/types';
import CreateLiabilityModal from '@/features/liabilities/components/create-liability-modal';
import UpdateDebtModal from '@/features/liabilities/components/update-debt-modal';
import { formatRupiah } from '@/lib/utils';
import { Wallet, Plus, CreditCard, Pencil } from 'lucide-react';

export default function NetWorthPage() {
  const { data: assets, isLoading: isLoadingAssets } = useAssets();
  const { data: liabilities, isLoading: isLoadingLiabilities } = useLiabilities();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedLiability, setSelectedLiability] = useState<Liability | null>(null);

  // --- KALKULASI NET WORTH ---
  const totalAssets = assets?.reduce((acc, asset) => acc + (asset.units * asset.current_price), 0) || 0;
  const totalLiabilities = liabilities?.reduce((acc, item) => acc + item.remaining_amount, 0) || 0;
  const netWorth = totalAssets - totalLiabilities;
  const isPositiveNetWorth = netWorth >= 0;

  const isLoading = isLoadingAssets || isLoadingLiabilities;

  return (
    <div className="min-h-screen relative pb-24">
      {/* HEADER & SUMMARY CARD */}
      <div className="bg-slate-900 text-white pt-10 pb-8 px-6 rounded-b-[40px] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <Wallet className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-sm font-medium text-slate-300">Kekayaan Bersih</span>
          </div>
        </div>
        
        <p className="text-slate-400 text-xs font-medium mb-1">Total Net Worth</p>
        <h1 className={`text-3xl font-bold tracking-tight mb-6 ${isPositiveNetWorth ? 'text-white' : 'text-rose-400'}`}>
          {formatRupiah(netWorth)}
        </h1>
        
        {/* Breakdown Row */}
        <div className="flex items-center gap-4 border-t border-slate-700 pt-4">
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Aset</p>
            <p className="text-sm font-bold text-emerald-400">{formatRupiah(totalAssets)}</p>
          </div>
          <div className="w-px h-8 bg-slate-700"></div>
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Total Utang</p>
            <p className="text-sm font-bold text-rose-400">{formatRupiah(totalLiabilities)}</p>
          </div>
        </div>
      </div>

      {/* BODY CONTENT: DAFTAR UTANG */}
      <div className="px-6 -mt-4 space-y-4">
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="w-full bg-white border border-slate-100 rounded-3xl p-4 flex items-center justify-center space-x-2 text-slate-800 font-bold shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-slate-50 transition-colors"
        >
          <Plus className="w-5 h-5 text-slate-900" />
          <span>Tambah Utang/Kewajiban</span>
        </button>

        {isLoading ? (
          <div className="animate-pulse bg-slate-200 h-32 rounded-3xl w-full"></div>
        ) : liabilities?.length === 0 ? (
          <div className="text-center py-10">
            <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Hebat! Anda tidak memiliki catatan utang.</p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-slate-800 px-1">Rincian Kewajiban</h3>
            
            {liabilities?.map((item) => {
              const progress = (item.remaining_amount / item.initial_amount) * 100;
              const isPaidOff = item.remaining_amount <= 0;

              return (
                <div key={item.id} className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">{item.name}</h3>
                      <span className="inline-block px-2 py-0.5 mt-1 bg-rose-50 text-rose-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400">Sisa Utang</p>
                      <span className="block text-sm font-bold text-rose-500">{formatRupiah(item.remaining_amount)}</span>
                    </div>
                  </div>

                  {/* Progress Bar Sisa Utang */}
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-3">
                    <div 
                      className="bg-rose-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-400">Pinjaman Awal</p>
                      <p className="text-xs font-semibold text-slate-700">{formatRupiah(item.initial_amount)}</p>
                    </div>
                    
                    {!isPaidOff && (
                      <button 
                        onClick={() => setSelectedLiability(item)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <Pencil className="w-3 h-3 text-slate-600" />
                        <span className="text-[10px] font-bold text-slate-600">UPDATE SISA</span>
                      </button>
                    )}
                    {isPaidOff && (
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg">LUNAS 🎉</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALS */}
      {isCreateOpen && <CreateLiabilityModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />}
      {selectedLiability && <UpdateDebtModal isOpen={!!selectedLiability} onClose={() => setSelectedLiability(null)} liability={selectedLiability} />}
    </div>
  );
}