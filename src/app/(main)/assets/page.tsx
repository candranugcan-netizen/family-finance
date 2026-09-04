'use client';

import { useState } from 'react';
import { useAssets } from '@/features/assets/hooks';
import { Asset } from '@/features/assets/types';
import CreateAssetModal from '@/features/assets/components/create-asset-modal';
import UpdatePriceModal from '@/features/assets/components/update-price-modal';
import { formatRupiah } from '@/lib/utils';
// KITA GUNAKAN ICON DASAR YANG PASTI AMAN
import { Briefcase, Plus } from 'lucide-react'; 

export default function AssetsPage() {
  const { data: assets, isLoading } = useAssets();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAssetForPrice, setSelectedAssetForPrice] = useState<Asset | null>(null);

  const totalInvested = assets?.reduce((acc, asset) => acc + (asset.units * asset.avg_buy_price), 0) || 0;
  const totalCurrentValue = assets?.reduce((acc, asset) => acc + (asset.units * asset.current_price), 0) || 0;
  const totalUnrealized = totalCurrentValue - totalInvested;
  const totalRealized = assets?.reduce((acc, asset) => acc + Number(asset.realized_gain), 0) || 0;
  const totalReturn = totalUnrealized + totalRealized;
  const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;
  const isProfit = totalReturn >= 0;

  return (
    <div className="min-h-screen relative pb-24">
      {/* HEADER & SUMMARY CARD */}
      <div className="bg-slate-900 text-white pt-10 pb-8 px-6 rounded-b-[40px] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-sm font-medium text-slate-300">Portofolio Aset</span>
          </div>
        </div>
        
        <p className="text-slate-400 text-xs font-medium mb-1">Total Nilai Aset</p>
        <h1 className="text-3xl font-bold tracking-tight mb-4">{formatRupiah(totalCurrentValue)}</h1>
        
        <div className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${isProfit ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
          <span>
            {isProfit ? '+' : ''}{formatRupiah(totalReturn)} ({returnPercentage.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div className="px-6 -mt-4 space-y-4">
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="w-full bg-white border border-slate-100 rounded-3xl p-4 flex items-center justify-center space-x-2 text-slate-800 font-bold shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:bg-slate-50 transition-colors"
        >
          <Plus className="w-5 h-5 text-slate-900" />
          <span>Tambah Aset Baru</span>
        </button>

        {/* DAFTAR ASET */}
        {isLoading ? (
          <div className="animate-pulse bg-slate-200 h-32 rounded-3xl w-full"></div>
        ) : assets?.length === 0 ? (
          <div className="text-center py-10">
            <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Belum ada portofolio aset.</p>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {assets?.map((asset) => {
              const invested = asset.units * asset.avg_buy_price;
              const currentValue = asset.units * asset.current_price;
              const unrealized = currentValue - invested;
              const assetIsProfit = unrealized >= 0;

              return (
                <div key={asset.id} className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-800">{asset.name}</h3>
                      <span className="inline-block px-2 py-0.5 mt-1 bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {asset.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="block text-sm font-bold text-slate-800">{formatRupiah(currentValue)}</span>
                      <span className="block text-[10px] text-slate-400 font-medium">{asset.units} unit</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                    <div>
                      <p className="text-[10px] text-slate-400">Harga Rata-rata</p>
                      <p className="text-xs font-semibold text-slate-700">{formatRupiah(asset.avg_buy_price)}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-[10px] text-slate-400">Unrealized Return</p>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <p className={`text-xs font-bold ${assetIsProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {assetIsProfit ? '+' : ''}{formatRupiah(unrealized)}
                        </p>
                        <button 
                          onClick={() => setSelectedAssetForPrice(asset)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[10px] font-bold text-slate-600 transition-colors"
                        >
                          EDIT
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODALS */}
      {isCreateOpen && <CreateAssetModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />}
      {selectedAssetForPrice && <UpdatePriceModal isOpen={!!selectedAssetForPrice} onClose={() => setSelectedAssetForPrice(null)} asset={selectedAssetForPrice} />}
    </div>
  );
}