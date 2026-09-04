'use client';

import { useTransactions } from '../hooks';
import { formatRupiah } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, ArrowRightLeft, Clock } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';

export default function TransactionHistory() {
  const { data: transactions, isLoading, error } = useTransactions(15); // Ambil 15 transaksi terakhir

  if (isLoading) {
    return (
      <div className="mt-8 space-y-4">
        <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-4"></div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 w-full bg-slate-100 rounded-2xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) return <p className="text-red-500 mt-8">Gagal memuat transaksi.</p>;

  return (
    <div className="mt-10">
      <h2 className="text-lg font-bold text-slate-800 mb-4">Aktivitas Terakhir</h2>
      
      {transactions?.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
          <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-500">Belum ada transaksi bulan ini.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions?.map((tx) => {
            const isExpense = tx.type === 'expense';
            const isIncome = tx.type === 'income';
            const isTransfer = tx.type === 'transfer';

            return (
              <div key={tx.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                
                <div className="flex items-center">
                  {/* Ikon berdasarkan tipe */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    isExpense ? 'bg-red-50 text-red-600' : 
                    isIncome ? 'bg-emerald-50 text-emerald-600' : 
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {isExpense && <ArrowUpRight className="w-5 h-5" />}
                    {isIncome && <ArrowDownRight className="w-5 h-5" />}
                    {isTransfer && <ArrowRightLeft className="w-5 h-5" />}
                  </div>
                  
                  {/* Info Transaksi */}
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">
                      {isTransfer ? 'Transfer' : tx.category?.name || 'Tanpa Kategori'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isTransfer 
                        ? `${tx.account?.name} → ${tx.to_account?.name}` 
                        : tx.account?.name}
                      {tx.notes ? ` • ${tx.notes}` : ''}
                    </p>
                  </div>
                </div>

                {/* Nominal & Tanggal */}
                <div className="text-right">
                  <p className={`font-bold text-sm ${
                    isExpense ? 'text-slate-900' : 
                    isIncome ? 'text-emerald-600' : 
                    'text-slate-900'
                  }`}>
                    {isExpense ? '-' : isIncome ? '+' : ''}
                    {formatRupiah(tx.amount)}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {format(parseISO(tx.date), 'd MMM', { locale: id })}
                  </p>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}