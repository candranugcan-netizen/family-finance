'use client'; // WAJIB ADA karena kita pakai Zustand hook di bawah

import AuthGuard from "@/components/auth/auth-guard";
import BottomNav from '@/components/layout/bottom-nav';
import TransactionModal from '@/features/transactions/components/transaction-modal';
import CreateBudgetModal from '@/features/budgets/components/create-budget-modal';
import { useUIStore } from '@/store/ui-store';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  // PERBAIKAN: Ambil state dan action budget dari store
  const { isTxModalOpen, closeTxModal, isBudgetModalOpen, closeBudgetModal } = useUIStore();
  
  return (
    <AuthGuard>
      <div className="min-h-screen bg-slate-50 flex flex-col items-center">
        <main className="w-full max-w-md flex-1 relative bg-slate-50 pb-20 shadow-sm">
          {children}
        </main>
        
        <BottomNav />

        {/* Modal transaksi global */}
        <TransactionModal isOpen={isTxModalOpen} onClose={closeTxModal} />

        {/* PERBAIKAN: Hilangkan tanda kutip pada props isOpen dan onClose */}
        <CreateBudgetModal isOpen={isBudgetModalOpen} onClose={closeBudgetModal} />
      </div>
    </AuthGuard>
  );
}