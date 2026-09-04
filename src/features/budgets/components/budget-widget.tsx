'use client';

import { useBudgets } from '../hooks';
import { useExpenseByCategory } from '@/features/reports/hooks';
import { useUIStore } from '@/store/ui-store'; // BARU: Import global store
import { formatRupiah } from '@/lib/utils';
import { format } from 'date-fns';
import { Target, AlertCircle, Settings2 } from 'lucide-react'; // BARU: Import icon Settings2

export default function BudgetWidget() {
  const currentPeriod = format(new Date(), 'yyyy-MM');
  const { data: budgets, isLoading: isBudgetLoading } = useBudgets(currentPeriod);
  const { data: expenses, isLoading: isExpenseLoading } = useExpenseByCategory();
  
  // BARU: Ambil action untuk membuka modal
  const { openBudgetModal } = useUIStore();

  if (isBudgetLoading || isExpenseLoading) {
    return <div className="h-32 w-full bg-slate-50 animate-pulse rounded-3xl mb-6"></div>;
  }

  // TAMPILAN KETIKA BELUM ADA BUDGET SAMA SEKALI
  if (!budgets || budgets.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 mb-6 flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-3">
          <Target className="w-5 h-5 text-slate-400" />
        </div>
        <h2 className="text-sm font-bold text-slate-800 mb-1">Budget Bulanan</h2>
        <p className="text-xs text-slate-400 mb-4">Belum ada batas pengeluaran yang diatur.</p>
        <button 
          onClick={openBudgetModal}
          className="px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-sm"
        >
          + Atur Budget Pertama
        </button>
      </div>
    );
  }

  // TAMPILAN KETIKA SUDAH ADA BUDGET
  return (
    <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-bold text-slate-800">Status Budget</h2>
        </div>
        {/* BARU: Tombol Edit/Tambah Budget di Header */}
        <button 
          onClick={openBudgetModal}
          className="p-1.5 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
        >
          <Settings2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-5">
        {budgets.map((budget) => {
          // Cari pengeluaran aktual dari hook useExpenseByCategory
          const catName = budget.category?.name || '';
          const actualExpense = expenses?.find(e => e.name === catName)?.value || 0;
          
          const percentage = (actualExpense / budget.amount) * 100;
          const isOver = percentage >= 100;
          const isWarning = percentage >= 80 && !isOver;

          // Penentuan warna
          const barColor = isOver ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500';
          const textColor = isOver ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-slate-600';

          return (
            <div key={budget.id} className="space-y-1.5">
              <div className="flex justify-between items-end text-xs mb-1">
                <span className="font-semibold text-slate-700">{catName}</span>
                <div className="text-right">
                  <span className={`font-bold ${textColor}`}>{formatRupiah(actualExpense)}</span>
                  <span className="text-slate-400 font-medium"> / {formatRupiah(budget.amount)}</span>
                </div>
              </div>
              
              {/* Progress Bar Container */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 rounded-full ${barColor}`} 
                  style={{ width: `${Math.min(percentage, 100)}%` }} // Max 100% agar bar tidak keluar jalur
                ></div>
              </div>
              
              {isOver && (
                <p className="text-[10px] text-red-500 font-medium flex items-center pt-1">
                  <AlertCircle className="w-3 h-3 mr-1" /> Over budget
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}