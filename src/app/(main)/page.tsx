'use client';

import { useState } from 'react';
import { Plus, Wallet, ReceiptText, ArrowDownRight, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useAccounts } from '@/features/accounts/hooks';
import { useCurrentMonthCashFlow } from '@/features/reports/hooks';
import CreateAccountModal from '@/features/accounts/components/create-account-modal';
import TransactionModal from '@/features/transactions/components/transaction-modal';
import TransactionHistory from '@/features/transactions/components/transaction-history';
import { formatRupiah } from '@/lib/utils';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import ExpenseChart from '@/features/reports/components/expense-chart';
import BudgetWidget from '@/features/budgets/components/budget-widget';

export default function DashboardPage() {
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  
  const { data: accounts, isLoading: accLoading } = useAccounts();
  const { data: cashFlow, isLoading: cfLoading } = useCurrentMonthCashFlow();

  const totalBalance = accounts?.reduce((sum, acc) => sum + Number(acc.current_balance), 0) || 0;
  const currentMonthName = format(new Date(), 'MMMM yyyy', { locale: id });

  return (
    <div className="min-h-screen relative">
      {/* HEADER: E-Banking Elegant Style */}
      <div className="bg-slate-900 text-white pt-10 pb-20 px-6 rounded-b-[40px] shadow-sm">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-sm font-medium text-slate-300">Family Finance</span>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Wallet className="w-5 h-5" />
          </button>
        </div>

        <p className="text-slate-400 text-sm font-medium mb-1">Total Saldo Tersedia</p>
        <h1 className="text-4xl font-bold tracking-tight mb-2">
          {accLoading ? 'Menghitung...' : formatRupiah(totalBalance)}
        </h1>
      </div>

      {/* BODY CONTENT (Diangkat ke atas sedikit agar overlap dengan header) */}
      <div className="px-6 -mt-10 space-y-6 pb-24">
        
        {/* CASH FLOW WIDGET */}
        <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Arus Kas • {currentMonthName}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
              <div className="flex items-center space-x-2 mb-2">
                <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                <span className="text-xs text-slate-500 font-medium">Uang Masuk</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {cfLoading ? '...' : formatRupiah(cashFlow?.income || 0)}
              </p>
            </div>
            
            <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100/50">
              <div className="flex items-center space-x-2 mb-2">
                <ArrowUpRight className="w-4 h-4 text-red-600" />
                <span className="text-xs text-slate-500 font-medium">Uang Keluar</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {cfLoading ? '...' : formatRupiah(cashFlow?.expense || 0)}
              </p>
            </div>
          </div>
        </div>

        <BudgetWidget />

        <ExpenseChart />

        {/* QUICK ACTIONS / ACCOUNTS */}
        <div className="flex justify-between items-end">
          <h2 className="text-base font-bold text-slate-800">Rekening</h2>
          <button 
            onClick={() => setIsAccountModalOpen(true)}
            className="text-xs font-bold text-slate-900 flex items-center bg-slate-100 px-3 py-1.5 rounded-full hover:bg-slate-200 transition-colors"
          >
            <Plus className="w-3 h-3 mr-1" /> Tambah
          </button>
        </div>

        {/* Miniatur Daftar Rekening (Bisa diskroll horizontal jika banyak) */}
        <div className="flex overflow-x-auto space-x-3 pb-2 snap-x hide-scrollbar">
          {accounts?.map((acc) => (
            <div key={acc.id} className="min-w-[140px] bg-white p-4 rounded-2xl border border-slate-100 shadow-sm snap-start">
              <p className="text-xs text-slate-500 mb-1 truncate">{acc.name}</p>
              <p className="text-sm font-bold text-slate-800">{formatRupiah(acc.current_balance)}</p>
            </div>
          ))}
          {accounts?.length === 0 && (
            <p className="text-xs text-slate-400">Belum ada rekening.</p>
          )}
        </div>

        {/* HISTORI TRANSAKSI (Komponen Phase 3.4) */}
        <TransactionHistory />

      </div>

      {/* --- FLOATING ACTION BUTTON (FAB) --- */}
      {/* Posisinya dinaikkan ke bottom-24 karena ada bottom-nav di bottom-0 */}
      {/* <button
        onClick={() => setIsTxModalOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex items-center justify-center hover:scale-105 transition-transform active:scale-95 z-50"
      >
        <ReceiptText className="w-6 h-6" />
      </button> */}

      {/* Modals */}
      <CreateAccountModal isOpen={isAccountModalOpen} onClose={() => setIsAccountModalOpen(false)} />
      {/* <TransactionModal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} /> */}
    </div>
  );
}