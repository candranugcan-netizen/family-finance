import { create } from 'zustand';

interface UIState {
  isTxModalOpen: boolean;
  openTxModal: () => void;
  closeTxModal: () => void;
  // Tambahan untuk Budget
  isBudgetModalOpen: boolean;
  openBudgetModal: () => void;
  closeBudgetModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isTxModalOpen: false,
  openTxModal: () => set({ isTxModalOpen: true }),
  closeTxModal: () => set({ isTxModalOpen: false }),
  
  isBudgetModalOpen: false,
  openBudgetModal: () => set({ isBudgetModalOpen: true }),
  closeBudgetModal: () => set({ isBudgetModalOpen: false }),
}));